import assert from "node:assert/strict";
import test from "node:test";
import { scanSecrets, validateSecretControl } from "../../tools/validate/standards.js";

test("credential material fails in source, logs, fixtures, manifests, and generated handbooks", () => {
  for (const location of ["source", "log", "fixture", "manifest", "handbook"] as const) {
    const errors = scanSecrets(`WORKOS_API_KEY=sk_live_1234567890abcdef`, location);
    assert.ok(errors.length > 0, location);
  }
});

test("secret controls require a rotation owner, tested rotation path, and emergency revocation", () => {
  assert.ok(validateSecretControl({ owner: "Platform", rotationTestedAt: null, emergencyRevocation: false }).length >= 2);
  assert.deepEqual(validateSecretControl({ owner: "Platform", rotationTestedAt: "2026-08-05", emergencyRevocation: true }), []);
});
