import { randomBytes } from "node:crypto";
import { AwsClient } from "aws4fetch";
import { sha256 } from "../release/manifest.js";

export interface R2CredentialRequest { accountId: string; apiToken: string; bucket: string; parentAccessKeyId: string; prefix: string }
export interface R2TemporaryCredentials { accessKeyId: string; secretAccessKey: string; sessionToken: string }
export interface R2DiagnosticInput { endpoint: string; bucket: string; authorizedPrefix: string; objectKey: string; credentials: R2TemporaryCredentials; fetcher?: typeof fetch; now?: () => Date }
export interface R2DiagnosticEvidence { provider: "cloudflare-r2"; passed: true; bucketSha256: string; objectKeySha256: string; payloadSha256: string; startedAt: string; completedAt: string; deletionConfirmed: true }

export async function requestTemporaryR2Credentials(input: R2CredentialRequest, fetcher: typeof fetch = fetch): Promise<R2TemporaryCredentials> {
  if (!input.prefix || !input.prefix.endsWith("/") || input.prefix.startsWith("/")) throw new Error("diagnostic prefix must be a relative directory prefix");
  const response = await fetcher(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(input.accountId)}/r2/temp-access-credentials`, {
    method: "POST",
    headers: { authorization: `Bearer ${input.apiToken}`, "content-type": "application/json" },
    body: JSON.stringify({ bucket: input.bucket, parentAccessKeyId: input.parentAccessKeyId, permission: "object-read-write", ttlSeconds: 900, prefixes: [input.prefix] }),
  });
  if (!response.ok) throw new Error(`R2 temporary credential request failed with HTTP ${response.status}`);
  const body = await response.json() as { success?: boolean; result?: Partial<R2TemporaryCredentials> };
  if (!body.success || !body.result?.accessKeyId || !body.result.secretAccessKey || !body.result.sessionToken) throw new Error("R2 temporary credential response was incomplete");
  return body.result as R2TemporaryCredentials;
}

function objectUrl(endpoint: string, bucket: string, key: string): string {
  const path = key.split("/").map(encodeURIComponent).join("/");
  return `${endpoint.replace(/\/$/, "")}/${encodeURIComponent(bucket)}/${path}`;
}

export async function runR2Diagnostic(input: R2DiagnosticInput): Promise<R2DiagnosticEvidence> {
  if (!input.objectKey.startsWith(input.authorizedPrefix) || input.objectKey === input.authorizedPrefix || input.objectKey.includes("..")) throw new Error("object key must remain inside the authorized diagnostic prefix");
  const fetcher = input.fetcher ?? fetch;
  const clock = input.now ?? (() => new Date());
  const startedAt = clock().toISOString();
  const payload = randomBytes(64);
  const payloadSha256 = sha256(payload);
  const aws = new AwsClient({ accessKeyId: input.credentials.accessKeyId, secretAccessKey: input.credentials.secretAccessKey, sessionToken: input.credentials.sessionToken, service: "s3" });
  const request = async (method: string) => fetcher(await aws.sign(objectUrl(input.endpoint, input.bucket, input.objectKey), { method, body: method === "PUT" ? payload : undefined }));
  const put = await request("PUT");
  if (!put.ok) throw new Error(`R2 diagnostic PUT failed with HTTP ${put.status}`);
  const head = await request("HEAD");
  if (!head.ok) throw new Error(`R2 diagnostic HEAD failed with HTTP ${head.status}`);
  const get = await request("GET");
  if (!get.ok || sha256(new Uint8Array(await get.arrayBuffer())) !== payloadSha256) throw new Error("R2 diagnostic GET checksum mismatch");
  const deletion = await request("DELETE");
  if (!deletion.ok) throw new Error(`R2 diagnostic DELETE failed with HTTP ${deletion.status}`);
  const absence = await request("HEAD");
  if (absence.status !== 404) throw new Error("R2 diagnostic object was not absent after deletion");
  return { provider: "cloudflare-r2", passed: true, bucketSha256: sha256(input.bucket), objectKeySha256: sha256(input.objectKey), payloadSha256, startedAt, completedAt: clock().toISOString(), deletionConfirmed: true };
}
