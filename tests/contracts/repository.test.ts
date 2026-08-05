import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import { isPotentiallySensitive, normalizeTextForHash, validateCanonicalClientEvidence, validateRepository } from "../../tools/validate/repository.js";

const root = resolve(import.meta.dirname, "../..");

test("the repository contract, index, links, and freshness pass", async () => {
  const result = await validateRepository(root, new Date("2026-08-04T12:00:00Z"));
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.warnings, []);
});

test("line endings normalize before hashing", () => {
  assert.equal(normalizeTextForHash("a\r\nb\r"), "a\nb\n");
});

test("Unicode paths do not bypass index completeness", async () => {
  const fixture = await mkdtemp(join(tmpdir(), "norfolk-os-"));
  await mkdir(join(fixture, "docs"), { recursive: true });
  await mkdir(join(fixture, "governance"), { recursive: true });
  await writeFile(join(fixture, "docs/README.md"), "# Index\n");
  await writeFile(join(fixture, "governance/résumé.md"), "---\ntitle: Résumé\nstatus: accepted\ntier: CONTRACT\nowner: Owner\nlastVerified: 2026-08-04\n---\n");
  const result = await validateRepository(fixture, new Date("2026-08-04T12:00:00Z"));
  assert.ok(result.errors.some((error) => error.includes("governance/résumé.md: not indexed")));
});

test("a product-method contract is rejected when the canonical index omits it", async () => {
  const fixture = await mkdtemp(join(tmpdir(), "norfolk-os-product-"));
  await mkdir(join(fixture, "docs"), { recursive: true });
  await mkdir(join(fixture, "product"), { recursive: true });
  await writeFile(join(fixture, "docs/README.md"), "# Index\n");
  await writeFile(join(fixture, "product/discovery.md"), "---\ntitle: Discovery\nstatus: accepted\ntier: CONTRACT\nowner: Product OS Owner\nlastVerified: 2026-08-05\n---\n");
  const result = await validateRepository(fixture, new Date("2026-08-05T12:00:00Z"));
  assert.ok(result.errors.some((error) => error.includes("product/discovery.md: not indexed")));
});

test("canonical client evidence fails closed", () => {
  const errors = validateCanonicalClientEvidence({ disposition: "approved-canonical", rights: "unknown", syntheticReplacement: false, metadataStripped: false, secretScan: "passed", identifierScan: "passed", humanDisclosureReview: false });
  assert.equal(errors.length, 4);
});

test("semantic client and secret markers are detected", () => {
  assert.equal(isPotentiallySensitive("source /Users/alex/client/export.png"), true);
  assert.equal(isPotentiallySensitive("KIT Capital production example"), true);
  assert.equal(isPotentiallySensitive("synthetic company example"), false);
});
