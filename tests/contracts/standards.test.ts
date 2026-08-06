import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import {
  validateDatabaseOperation,
  validateCapabilityMap,
  validatePreferredStack,
  validateVendorEvidence,
} from "../../tools/validate/standards.js";

const root = resolve(import.meta.dirname, "../..");
const json = async (path: string) => JSON.parse(await readFile(resolve(root, path), "utf8"));

test("every preferred stack choice records rationale, rejected alternative, reversal trigger, owner, and verification date", async () => {
  assert.deepEqual(validatePreferredStack(await json("standards/preferred-stack.json")), []);
});

test("a second foundational dependency requires an approved decision", async () => {
  const invalid = await json("tests/fixtures/standards/invalid-second-foundation.json");
  assert.ok(validatePreferredStack(invalid).some((error) => error.includes("approved decision")));
});

test("destructive database work fails closed outside a self-stamped local database", () => {
  for (const fixture of [
    { destructive: true, target: "production", selfStamp: "production" },
    { destructive: true, target: "staging", selfStamp: "staging" },
    { destructive: true, target: "local", selfStamp: "unknown" },
  ]) assert.ok(validateDatabaseOperation(fixture).length > 0);
  assert.deepEqual(validateDatabaseOperation({ destructive: true, target: "local", selfStamp: "local-development" }), []);
});

test("time-sensitive vendor readiness requires official current evidence and diagnostics", async () => {
  assert.ok(validateVendorEvidence(await json("tests/fixtures/standards/invalid-vendor-evidence.json")).length >= 3);
});

test("capability maps require complete context, recovery, and adapter dispositions", () => {
  const errors = validateCapabilityMap({ capabilities: [{ id: "document.create", procedure: "documents.create", consequential: false, transports: [{ name: "ui", procedure: "documents.create", authorizationPolicy: "document-write", approvalPolicy: "none" }] }] });
  for (const field of ["userVocabulary", "callers", "contextAvailability", "completionSignal", "recovery", "mcp", "copilot", "jobs", "reports", "schedules"]) {
    assert.ok(errors.some((error) => error.includes(field)), field);
  }
});
