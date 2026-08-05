import assert from "node:assert/strict";
import test from "node:test";
import { isSafeReturnIntent, validateAuthSecurity } from "../../tools/validate/auth.js";

test("return intent is application-relative, allowlisted, and rejects encoded bypasses", () => {
  assert.equal(isSafeReturnIntent("/reports/weekly", ["/reports", "/home"]), true);
  for (const value of ["https://evil.example/x", "//evil.example", "/%2f%2fevil.example", "%2F%2Fevil.example", "/admin/secrets", "javascript:alert(1)"]) {
    assert.equal(isSafeReturnIntent(value, ["/reports", "/home"]), false, value);
  }
});

test("OAuth, cookies, sessions, CSRF, replay, rate limits, and redaction fail closed", () => {
  const errors = validateAuthSecurity({ stateBound: false, nonceBound: false, pkce: false, exactCallbackOrigin: false, cookie: {}, sessionRotation: false, revocation: false, csrf: false, replayProtection: false, rateLimits: false, redactedLogs: false });
  assert.ok(errors.length >= 10);
});
