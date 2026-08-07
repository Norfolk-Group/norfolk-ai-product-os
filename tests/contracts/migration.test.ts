import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { createHash } from "node:crypto";
import { validateImportedAdr, validateMigrationRegister, validatePromotedContent, validateSupersededDoctrine } from "../../tools/validate/migration.js";

const root = resolve(import.meta.dirname, "../..");
const json = async (path: string) => JSON.parse(await readFile(resolve(root, path), "utf8"));

test("every canonical migration has approved provenance and a current destination", async () => {
  assert.deepEqual(validateMigrationRegister(await json("migration/source-register.json")), []);
});

test("client identity and credential-like values cannot enter promoted content", async () => {
  const fixture = await readFile(resolve(root, "tests/fixtures/migration/invalid-client-promotion.md"), "utf8");
  assert.ok(validatePromotedContent(fixture).length >= 2);
});

test("superseded doctrine cannot appear as a current rule", async () => {
  for (const statement of await json("tests/fixtures/migration/invalid-superseded-doctrine.json")) {
    assert.ok(validateSupersededDoctrine(statement).length > 0, statement);
  }
});

test("imported Kit ADR bodies remain exact and stay outside the current decision sequence", async () => {
  const manifest = await json("migration/imported-adrs.json") as Array<{ importedPath: string; sourceBodySha256: string; sourceDate: string }>;
  assert.equal(manifest.length, 17);
  for (const record of manifest) {
    assert.match(record.importedPath, /^decisions\/imported\/norfolk-kit\//);
    const body = await readFile(resolve(root, record.importedPath), "utf8");
    assert.deepEqual(validateImportedAdr(body, record), []);
    assert.equal(createHash("sha256").update(body).digest("hex"), record.sourceBodySha256);
  }
});

test("the migration disposition records client assets as a blocker, not reusable doctrine", async () => {
  const register = await json("migration/source-register.json") as { sources: Array<Record<string, unknown>> };
  const assets = register.sources.find((source) => source.id === "SRC-KIT-CLIENT-ASSETS");
  assert.equal(assets?.disposition, "leave-behind");
  assert.equal(assets?.releaseBlocker, true);
});
