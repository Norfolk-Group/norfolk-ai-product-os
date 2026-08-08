import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import { validateReleaseAuthorization } from "../../tools/release/authorization.js";
import { validateReleasePreflight } from "../../tools/release/preflight.js";
import { buildTrustedRelease, verifyTrustedRelease } from "../../tools/release/trusted.js";
import { sha256 } from "../../tools/release/manifest.js";

const root = resolve(import.meta.dirname, "../..");
const candidate = JSON.parse(await readFile(resolve(root, "releases/0.3.0-candidate.4/release.json"), "utf8"));
const validAuthorization = {
  schemaVersion: 1,
  releaseVersion: "0.3.0",
  candidateVersion: candidate.version,
  candidateSourceCommit: candidate.sourceCommit,
  candidateManifestSha256: candidate.manifestSha256,
  releaseWorkflowCommit: "a".repeat(40),
  approver: "ricardo-cidale-personal",
  approvedAt: "2026-08-07T22:00:00.000Z",
  scope: "private-github-release",
  confirmation: "publish-private-release",
  trustedKeyId: "norfolk-product-os-release-2026-01",
} as const;

test("a complete private release authorization is accepted", () => {
  assert.deepEqual(validateReleaseAuthorization(validAuthorization), []);
});

test("authorization fails closed on candidate publication and ambiguous values", () => {
  assert.ok(validateReleaseAuthorization({ ...validAuthorization, releaseVersion: validAuthorization.candidateVersion }).length > 0);
  const errors = validateReleaseAuthorization({ ...validAuthorization, scope: "public", confirmation: "yes", releaseWorkflowCommit: "main", candidateManifestSha256: "unknown" });
  assert.ok(errors.length >= 4);
});

const validState = {
  authorization: validAuthorization,
  ref: "refs/heads/main",
  headCommit: "c".repeat(40),
  parentCommit: validAuthorization.releaseWorkflowCommit,
  changedPaths: ["release-authorizations/0.3.0.json"],
  candidateTagCommit: validAuthorization.candidateSourceCommit,
  candidateRelease: candidate,
  targetTagExists: false,
  targetReleaseExists: false,
};

test("preflight accepts an authorization-only main commit over the reviewed workflow commit", () => {
  assert.deepEqual(validateReleasePreflight(validState), []);
});

test("preflight rejects extra changes, existing versions, and moved candidate tags", () => {
  const errors = validateReleasePreflight({ ...validState, changedPaths: [...validState.changedPaths, "standards/security.md"], candidateTagCommit: "d".repeat(40), targetReleaseExists: true });
  assert.ok(errors.some((error) => error.includes("authorization commit")));
  assert.ok(errors.some((error) => error.includes("candidate source tag")));
  assert.ok(errors.some((error) => error.includes("already exists")));
});

test("trusted build signs reconstructed candidate content and detects tampering", async () => {
  const output = await mkdtemp(join(tmpdir(), "product-os-trusted-"));
  const directory = join(output, "0.3.0");
  const keys = generateKeyPairSync("ed25519");
  const privateKeyPem = keys.privateKey.export({ type: "pkcs8", format: "pem" }).toString();
  const publicKeyPem = keys.publicKey.export({ type: "spki", format: "pem" }).toString();
  const before = sha256(await readFile(resolve(root, "releases/0.3.0-candidate.4/manifest.json")));
  const result = await buildTrustedRelease({ root, authorization: validAuthorization, outputDirectory: directory, privateKeyPem, publicKeyPem, createdAt: "2026-08-07T22:30:00.000Z" });
  assert.deepEqual(await verifyTrustedRelease(result.directory, publicKeyPem), []);
  assert.equal(sha256(await readFile(resolve(root, "releases/0.3.0-candidate.4/manifest.json"))), before);
  await writeFile(join(result.directory, "payload", "standards", "security.md"), "tampered\n");
  assert.ok((await verifyTrustedRelease(result.directory, publicKeyPem)).some((error) => error.includes("content hash")));
});

test("trusted verification rejects public-key substitution", async () => {
  const output = await mkdtemp(join(tmpdir(), "product-os-trusted-key-"));
  const keys = generateKeyPairSync("ed25519");
  const other = generateKeyPairSync("ed25519");
  const result = await buildTrustedRelease({
    root,
    authorization: validAuthorization,
    outputDirectory: join(output, "0.3.0"),
    privateKeyPem: keys.privateKey.export({ type: "pkcs8", format: "pem" }).toString(),
    publicKeyPem: keys.publicKey.export({ type: "spki", format: "pem" }).toString(),
    createdAt: "2026-08-07T22:30:00.000Z",
  });
  const errors = await verifyTrustedRelease(result.directory, other.publicKey.export({ type: "spki", format: "pem" }).toString());
  assert.ok(errors.some((error) => error.includes("trusted key")));
});
