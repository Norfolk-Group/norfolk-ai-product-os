import { execFileSync } from "node:child_process";
import { createPrivateKey, createPublicKey } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve, sep } from "node:path";
import { canonicalJson, sha256, signManifest, validateManifestFiles, verifyManifest, type ReleaseFile, type SignedManifest } from "./manifest.js";
import { validateReleaseAuthorization, type ReleaseAuthorization } from "./authorization.js";

export interface TrustedReleaseOptions { root: string; authorization: ReleaseAuthorization; outputDirectory: string; privateKeyPem: string; publicKeyPem: string; createdAt: string }
export interface TrustedReleaseResult { directory: string; manifestSha256: string; publicKeySha256: string; assetPaths: string[] }

function candidatePath(root: string, version: string, name: string): string { return resolve(root, "releases", version, name); }
function safeOutput(directory: string, path: string): string {
  if (path.startsWith("/") || path.split("/").includes("..")) throw new Error(`unsafe path ${path}`);
  const target = resolve(directory, path);
  if (!target.startsWith(`${resolve(directory)}${sep}`)) throw new Error(`unsafe path ${path}`);
  return target;
}

export async function buildTrustedRelease(options: TrustedReleaseOptions): Promise<TrustedReleaseResult> {
  const errors = validateReleaseAuthorization(options.authorization);
  if (errors.length) throw new Error(errors.join("\n"));
  const { authorization } = options;
  const candidateRelease = JSON.parse(await readFile(candidatePath(options.root, authorization.candidateVersion, "release.json"), "utf8"));
  const candidateManifest = JSON.parse(await readFile(candidatePath(options.root, authorization.candidateVersion, "manifest.json"), "utf8")) as { files: ReleaseFile[]; minimumKitVersion: string; status: string };
  if (candidateRelease.status !== "candidate" || candidateManifest.status !== "candidate") throw new Error("source must be a candidate");
  if (candidateRelease.sourceCommit !== authorization.candidateSourceCommit || candidateRelease.manifestSha256 !== authorization.candidateManifestSha256) throw new Error("candidate provenance does not match authorization");
  if (candidateRelease.signedBy === authorization.trustedKeyId) throw new Error("candidate key cannot be reused as trusted key");
  if (validateManifestFiles(candidateManifest.files).length) throw new Error("candidate manifest contains unsafe files");
  const privateKey = createPrivateKey(options.privateKeyPem);
  const publicKey = createPublicKey(options.publicKeyPem);
  if (publicKey.export({ type: "spki", format: "pem" }).toString() !== createPublicKey(privateKey).export({ type: "spki", format: "pem" }).toString()) throw new Error("private and public keys do not match");

  await mkdir(options.outputDirectory);
  const payload = join(options.outputDirectory, "payload");
  const files: ReleaseFile[] = [];
  for (const file of [...candidateManifest.files].sort((a, b) => a.path.localeCompare(b.path))) {
    const body = execFileSync("git", ["show", `${authorization.candidateSourceCommit}:${file.path}`], { cwd: options.root, maxBuffer: 64 * 1024 * 1024 });
    if (sha256(body) !== file.sha256) throw new Error(`candidate source content hash mismatch: ${file.path}`);
    const target = safeOutput(payload, file.path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, body);
    files.push(file);
  }
  const authorizationSha256 = sha256(canonicalJson(authorization));
  const publicKeySha256 = sha256(publicKey.export({ type: "spki", format: "der" }));
  const manifest = { schemaVersion: 1, version: authorization.releaseVersion, status: "released", visibility: "private", sourceCommit: authorization.candidateSourceCommit, createdAt: options.createdAt, minimumKitVersion: candidateManifest.minimumKitVersion, candidate: { version: authorization.candidateVersion, manifestSha256: authorization.candidateManifestSha256 }, authorizationSha256, publicKeySha256, files };
  const bundle = signManifest(manifest, privateKey, authorization.trustedKeyId);
  const records: Record<string, string | Buffer> = {
    "manifest.json": `${JSON.stringify(manifest, null, 2)}\n`,
    "signed-manifest.json": `${JSON.stringify(bundle, null, 2)}\n`,
    "release.json": `${JSON.stringify({ version: authorization.releaseVersion, status: "released", visibility: "private", sourceCommit: authorization.candidateSourceCommit, manifestSha256: sha256(canonicalJson(manifest)), candidateVersion: authorization.candidateVersion, signedBy: authorization.trustedKeyId, createdAt: options.createdAt, minimumKitVersion: candidateManifest.minimumKitVersion }, null, 2)}\n`,
    "release-authorization.json": `${canonicalJson(authorization)}\n`,
    "trusted-public-key.pem": publicKey.export({ type: "spki", format: "pem" }),
  };
  for (const [path, body] of Object.entries(records)) await writeFile(join(options.outputDirectory, path), body);
  const assetPaths = [...candidateManifest.files.map((file) => `payload/${file.path}`), ...Object.keys(records)].sort();
  const checksums = await Promise.all(assetPaths.map(async (path) => `${sha256(await readFile(join(options.outputDirectory, path)))}  ${path}`));
  await writeFile(join(options.outputDirectory, "checksums.sha256"), `${checksums.join("\n")}\n`);
  assetPaths.push("checksums.sha256");
  const verifyErrors = await verifyTrustedRelease(options.outputDirectory, options.publicKeyPem);
  if (verifyErrors.length) throw new Error(verifyErrors.join("\n"));
  return { directory: options.outputDirectory, manifestSha256: sha256(canonicalJson(manifest)), publicKeySha256, assetPaths: assetPaths.sort() };
}

export async function verifyTrustedRelease(directory: string, publicKeyPem: string): Promise<string[]> {
  const errors: string[] = [];
  try {
    const expectedKey = createPublicKey(publicKeyPem);
    const embeddedKey = createPublicKey(await readFile(join(directory, "trusted-public-key.pem"), "utf8"));
    const expectedDer = expectedKey.export({ type: "spki", format: "der" });
    const embeddedDer = embeddedKey.export({ type: "spki", format: "der" });
    if (!Buffer.from(expectedDer).equals(Buffer.from(embeddedDer))) errors.push("trusted key does not match embedded key");
    const bundle = JSON.parse(await readFile(join(directory, "signed-manifest.json"), "utf8")) as SignedManifest;
    if (!verifyManifest(bundle, expectedKey)) errors.push("manifest signature is invalid for trusted key");
    const manifest = bundle.manifest as unknown as { publicKeySha256: string; files: ReleaseFile[] };
    if (manifest.publicKeySha256 !== sha256(expectedDer)) errors.push("trusted key hash does not match manifest");
    for (const file of manifest.files ?? []) {
      try { if (sha256(await readFile(safeOutput(join(directory, "payload"), file.path))) !== file.sha256) errors.push(`content hash mismatch: ${file.path}`); }
      catch { errors.push(`content hash missing: ${file.path}`); }
    }
    const checksumLines = (await readFile(join(directory, "checksums.sha256"), "utf8")).trim().split("\n");
    for (const line of checksumLines) {
      const match = /^([0-9a-f]{64})  (.+)$/.exec(line);
      if (!match) { errors.push("invalid checksum record"); continue; }
      try { if (sha256(await readFile(safeOutput(directory, match[2]))) !== match[1]) errors.push(`asset checksum mismatch: ${match[2]}`); }
      catch { errors.push(`asset missing: ${match[2]}`); }
    }
  } catch (error) { errors.push(`trusted release unreadable: ${(error as Error).message}`); }
  return [...new Set(errors)];
}
