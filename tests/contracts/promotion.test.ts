import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import test from "node:test";
import { validatePromotionCandidate } from "../../tools/release/adoption.js";

const root = resolve(import.meta.dirname, "../..");
const Ajv = createRequire(import.meta.url)("ajv");

test("client identifiers, missing provenance, unknown rights, and no reviewer cannot enter canon", () => {
  const errors = validatePromotionCandidate({ source: "H-Analytics client record", provenance: "", ipClassification: "unknown", reviewer: "", humanDisclosureReview: false, syntheticExamples: false });
  assert.ok(errors.length >= 5);
});

test("a sanitized Norfolk-owned proposal remains a proposal until explicitly accepted", () => {
  assert.deepEqual(validatePromotionCandidate({ source: "synthetic observation", provenance: "commit:abc", ipClassification: "norfolk-owned", sensitivity: "norfolk-only", reviewer: "Product OS Owner", sanitization: { humanDisclosureReview: true, syntheticExamples: true, metadataStripped: true }, evidence: ["synthetic fixture"], state: "Norfolk-review" }), []);
});

test("an accepted promotion passes structural and semantic gates together", async () => {
  const schema = JSON.parse(await readFile(resolve(root, "schemas/promotion-proposal.schema.json"), "utf8"));
  const validate = new Ajv({ allErrors: true, strict: false }).compile(schema);
  const proposal = { id: "PP-0001", state: "accepted", source: "synthetic observation", provenance: "commit:abc", ipClassification: "norfolk-owned", sensitivity: "norfolk-only", sanitization: { syntheticExamples: true, metadataStripped: true, humanDisclosureReview: true }, evidence: ["synthetic fixture"], confidence: "high", impact: "removes repeated work", reviewer: "Product OS Owner" };
  assert.equal(validate(proposal), true);
  assert.deepEqual(validatePromotionCandidate(proposal), []);
});

test("accepted promotions reject restricted rights and incomplete sanitization", async () => {
  const schema = JSON.parse(await readFile(resolve(root, "schemas/promotion-proposal.schema.json"), "utf8"));
  const validate = new Ajv({ allErrors: true, strict: false }).compile(schema);
  const proposal = { id: "PP-0002", state: "accepted", source: "synthetic observation", provenance: "commit:abc", ipClassification: "client-restricted", sensitivity: "client-restricted", sanitization: { syntheticExamples: false, metadataStripped: false, humanDisclosureReview: false }, evidence: ["synthetic fixture"], confidence: "high", impact: "removes repeated work", reviewer: "Product OS Owner" };
  assert.equal(validate(proposal), false);
  assert.ok(validatePromotionCandidate(proposal).length >= 4);
});
