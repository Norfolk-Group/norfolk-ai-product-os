import assert from "node:assert/strict";
import test from "node:test";
import { planManagedFile, validateAdoptionPreflight, validateRollback } from "../../tools/release/adoption.js";

test("unchanged managed files update and locally edited files become conflicts", () => {
  assert.equal(planManagedFile({ installedHash: "old", currentHash: "old", incomingHash: "new" }).action, "update");
  assert.equal(planManagedFile({ installedHash: "old", currentHash: "edited", incomingHash: "new" }).action, "conflict");
});

test("incompatible Product OS and Kit versions stop before mutation", () => {
  const errors = validateAdoptionPreflight({ productOSVersion: "0.3.0", kitVersion: "0.1.0", compatible: false, bundlePinned: true, signatureValid: true, hashesValid: true, branchWriteOnly: true, identityScope: "repository", environmentApproval: true, payload: [], allowedSensitivities: ["client-safe"] });
  assert.ok(errors.some((error) => error.includes("incompatible")));
});

test("untrusted bundle, broad identity, direct default-branch write, and missing approval all fail", () => {
  const errors = validateAdoptionPreflight({ productOSVersion: "0.3.0", kitVersion: "0.3.0", compatible: true, bundlePinned: false, signatureValid: false, hashesValid: false, branchWriteOnly: false, identityScope: "organization", environmentApproval: false, payload: [], allowedSensitivities: ["client-safe"] });
  assert.ok(errors.length >= 6);
});

test("unknown or client organizations cannot receive Norfolk-only material", () => {
  const errors = validateAdoptionPreflight({ productOSVersion: "0.3.0", kitVersion: "0.3.0", compatible: true, bundlePinned: true, signatureValid: true, hashesValid: true, branchWriteOnly: true, identityScope: "repository", environmentApproval: true, payload: [{ path: "brand/norfolk/logo.svg", sensitivity: "norfolk-only", action: "add" }], allowedSensitivities: ["client-safe"] });
  assert.ok(errors.some((error) => error.includes("norfolk-only")));
});

test("normal adoption separates deletions into an unexecuted destructive proposal", () => {
  const errors = validateAdoptionPreflight({ productOSVersion: "0.3.0", kitVersion: "0.3.0", compatible: true, bundlePinned: true, signatureValid: true, hashesValid: true, branchWriteOnly: true, identityScope: "repository", environmentApproval: true, payload: [{ path: "old.md", sensitivity: "client-safe", action: "delete" }], allowedSensitivities: ["client-safe"] });
  assert.ok(errors.some((error) => error.includes("destructive proposal")));
});

test("normal rollback refuses an incompatible schema contraction", () => {
  assert.ok(validateRollback({ codeConfigOnly: false, expandContractCompatible: false, recoveryPlanApproved: false }).some((error) => error.includes("recovery plan")));
  assert.deepEqual(validateRollback({ codeConfigOnly: true, expandContractCompatible: true, recoveryPlanApproved: false }), []);
});
