import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import test from "node:test";
import fg from "fast-glob";

type SchemaError = { instancePath: string; params: Record<string, unknown> };
type Validator = ((value: unknown) => boolean) & { errors?: SchemaError[] | null };
type AjvInstance = { compile: (schema: unknown) => Validator };
type AjvConstructor = new (options?: Record<string, unknown>) => AjvInstance;

const require = createRequire(import.meta.url);
const Ajv = require("ajv") as AjvConstructor;

const root = resolve(import.meta.dirname, "../..");

function compile(value: unknown) {
  const ajv = new Ajv({ allErrors: true, strict: false, validateFormats: false });
  return ajv.compile(value);
}

async function schema(name: string) {
  return JSON.parse(await readFile(resolve(root, `schemas/${name}.schema.json`), "utf8"));
}

test("standard metadata accepts current contract metadata", async () => {
  const validate = compile(await schema("standard-metadata"));
  assert.equal(validate({ title: "Design", status: "accepted", tier: "CONTRACT", owner: "Product OS Owner", lastVerified: "2026-08-04" }), true);
});

test("standard metadata rejects missing owner and invalid tier", async () => {
  const validate = compile(await schema("standard-metadata"));
  assert.equal(validate({ title: "Design", status: "accepted", tier: "CANON", lastVerified: "2026-08-04" }), false);
  assert.ok(validate.errors?.some((error) => error.instancePath === "/tier" || error.params.missingProperty === "owner"));
});

test("release manifest requires private visibility and content hashes", async () => {
  const validate = compile(await schema("product-os-release"));
  const valid = { version: "0.1.0", status: "candidate", sourceCommit: "a".repeat(40), manifestSha256: "b".repeat(64), standards: ["governance/fundamental-governance.md"], createdAt: "2026-08-04T12:00:00Z", visibility: "private", signedBy: "trusted-release-key", minimumKitVersion: "0.1.0" };
  assert.equal(validate(valid), true);
  assert.equal(validate({ ...valid, visibility: "public" }), false);
  const { signedBy: _signedBy, ...unsigned } = valid;
  assert.equal(validate(unsigned), false);
  assert.equal(validate({ ...valid, minimumKitVersion: "latest" }), false);
});

test("exception requires accountable review and migration consequence", async () => {
  const validate = compile(await schema("exception"));
  const incomplete = { id: "EX-0001", state: "approved", owner: "Product owner" };
  assert.equal(validate(incomplete), false);
});

test("promotion proposal cannot omit sanitization review", async () => {
  const validate = compile(await schema("promotion-proposal"));
  const proposal = { id: "PP-0001", state: "sanitization-review", source: "product", provenance: "observed workflow", ipClassification: "licensed-for-reuse", sensitivity: "client-safe", evidence: ["synthetic observation"], confidence: "high", impact: "reduces repeated work", reviewer: "Product OS Owner" };
  assert.equal(validate(proposal), false);
});

test("adoption lock requires pinned Product OS and Kit versions", async () => {
  const validate = compile(await schema("adoption-lock"));
  assert.equal(validate({ productOSVersion: "0.1.0", kitVersion: "0.1.0", state: "adopted", sourceManifestSha256: "c".repeat(64), exceptions: [] }), true);
  assert.equal(validate({ productOSVersion: "head", kitVersion: "latest", state: "adopted", sourceManifestSha256: "c".repeat(64), exceptions: [] }), false);
});

test("capability map schema rejects context-free UI-only capabilities", async () => {
  const validate = compile(await schema("capability-map"));
  assert.equal(validate({ capabilities: [{ id: "document.create", procedure: "documents.create", consequential: false, transports: [{ name: "ui", procedure: "documents.create", authorizationPolicy: "document-write", approvalPolicy: "none" }] }] }), false);
});

test("every published schema compiles", async () => {
  const schemaFiles = await fg("schemas/*.schema.json", { cwd: root, onlyFiles: true });
  assert.ok(schemaFiles.length > 0);
  for (const path of schemaFiles) {
    const value = JSON.parse(await readFile(resolve(root, path), "utf8"));
    assert.doesNotThrow(() => compile(value), path);
  }
});
