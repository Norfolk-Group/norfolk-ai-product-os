import assert from "node:assert/strict";
import test from "node:test";
import { validatePromotionCandidate } from "../../tools/release/adoption.js";

test("client identifiers, missing provenance, unknown rights, and no reviewer cannot enter canon", () => {
  const errors = validatePromotionCandidate({ source: "H-Analytics client record", provenance: "", ipClassification: "unknown", reviewer: "", humanDisclosureReview: false, syntheticExamples: false });
  assert.ok(errors.length >= 5);
});

test("a sanitized Norfolk-owned proposal remains a proposal until explicitly accepted", () => {
  assert.deepEqual(validatePromotionCandidate({ source: "synthetic observation", provenance: "commit:abc", ipClassification: "norfolk-owned", reviewer: "Product OS Owner", humanDisclosureReview: true, syntheticExamples: true, state: "Norfolk-review" }), []);
});
