import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { redactDiagnosticOutput, validateWorkOSReadinessEnvironment } from "../../tools/readiness/workos.js";
import { requestTemporaryR2Credentials, runR2Diagnostic } from "../../tools/readiness/r2.js";

test("WorkOS readiness requires staging values and redacts credential-shaped output", () => {
  assert.deepEqual(validateWorkOSReadinessEnvironment({}), ["missing WORKOS_API_KEY", "missing WORKOS_CLIENT_ID", "missing WORKOS_REDIRECT_URI", "WORKOS_ENVIRONMENT must be staging"]);
  assert.equal(redactDiagnosticOutput("api key sk_test_secret and code=abc123"), "api key [REDACTED] and code=[REDACTED]");
});

test("WorkOS readiness installs the SDK version named by the accepted evidence", async () => {
  const packageJson = JSON.parse(await readFile("package.json", "utf8")) as { devDependencies?: Record<string, string> };
  assert.equal(packageJson.devDependencies?.["@workos-inc/node"], "10.9.0");
});

test("R2 requests fifteen-minute read-write credentials for one diagnostic prefix", async () => {
  const observed: unknown[] = [];
  const credentials = await requestTemporaryR2Credentials({ accountId: "account", apiToken: "token", bucket: "norfolk-product-os", parentAccessKeyId: "parent", prefix: "diagnostics/product-os/" }, async (_url, init) => {
    observed.push(JSON.parse(String(init?.body)));
    return new Response(JSON.stringify({ success: true, errors: [], messages: [], result: { accessKeyId: "temporary", secretAccessKey: "secret", sessionToken: "session" } }), { status: 200 });
  });
  assert.deepEqual(observed, [{ bucket: "norfolk-product-os", parentAccessKeyId: "parent", permission: "object-read-write", ttlSeconds: 900, paths: { prefixPaths: ["diagnostics/product-os/"] } }]);
  assert.equal(credentials.sessionToken, "session");
});

test("R2 temporary credential request fails closed on provider errors", async () => {
  await assert.rejects(() => requestTemporaryR2Credentials({ accountId: "account", apiToken: "token", bucket: "bucket", parentAccessKeyId: "parent", prefix: "diagnostics/" }, async () => new Response("denied", { status: 403 })), /temporary credential request failed/);
});

test("R2 diagnostic refuses a key outside its authorized prefix", async () => {
  await assert.rejects(() => runR2Diagnostic({
    endpoint: "https://example.r2.cloudflarestorage.com",
    bucket: "bucket",
    authorizedPrefix: "diagnostics/product-os/",
    objectKey: "other/object.txt",
    credentials: { accessKeyId: "temporary", secretAccessKey: "secret", sessionToken: "session" },
  }), /authorized diagnostic prefix/);
});
