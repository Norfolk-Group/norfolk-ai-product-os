import assert from "node:assert/strict";
import test from "node:test";
import { planManagedFile, validateAdoptionPreflight, validateRollback } from "../../tools/release/adoption.js";

const compatibility = [{ productOS: "0.3.0-candidate.1", kit: ">=0.1.0 <0.2.0", status: "candidate" }];
const safe = { productOSVersion: "0.3.0-candidate.1", kitVersion: "0.1.0", compatibility, bundlePinned: true, signatureValid: true, hashesValid: true, branchWriteOnly: true, identityScope: "repository", environmentApproval: true, payload: [], allowedSensitivities: ["client-safe"] };

test("unchanged managed files update and locally edited files become conflicts", () => {
  assert.equal(planManagedFile({ installedHash: "old", currentHash: "old", incomingHash: "new" }).action, "update");
  assert.equal(planManagedFile({ installedHash: "old", currentHash: "edited", incomingHash: "new" }).action, "conflict");
});

test("incompatible Product OS and Kit versions stop before mutation", () => {
  const errors = validateAdoptionPreflight({ ...safe, productOSVersion: "99.0.0", kitVersion: "0.0.1", compatible: true } as never);
  assert.ok(errors.some((error) => error.includes("incompatible")));
});

test("untrusted bundle, broad identity, direct default-branch write, and missing approval all fail", () => {
  const errors = validateAdoptionPreflight({ ...safe, bundlePinned: false, signatureValid: false, hashesValid: false, branchWriteOnly: false, identityScope: "organization", environmentApproval: false });
  assert.ok(errors.length >= 6);
});

test("unknown or client organizations cannot receive Norfolk-only material", () => {
  const errors = validateAdoptionPreflight({ ...safe, payload: [{ path: "brand/norfolk/logo.svg", sensitivity: "norfolk-only", action: "add" }] });
  assert.ok(errors.some((error) => error.includes("norfolk-only")));
});

test("normal adoption separates deletions into an unexecuted destructive proposal", () => {
  const errors = validateAdoptionPreflight({ ...safe, payload: [{ path: "old.md", sensitivity: "client-safe", action: "delete" }] });
  assert.ok(errors.some((error) => error.includes("destructive proposal")));
});

test("adoption rejects paths that escape the repository", () => {
  for (const path of ["../../outside.txt", "/tmp/outside.txt", "..\\outside.txt"]) {
    assert.ok(validateAdoptionPreflight({ ...safe, payload: [{ path, sensitivity: "client-safe", action: "add" }] }).some((error) => error.includes("unsafe path")), path);
  }
});

test("normal rollback refuses an incompatible schema contraction", () => {
  assert.ok(validateRollback({ codeConfigOnly: false, expandContractCompatible: false, recoveryPlanApproved: false }).some((error) => error.includes("recovery plan")));
  assert.deepEqual(validateRollback({ codeConfigOnly: true, expandContractCompatible: true, recoveryPlanApproved: false }), []);
});
