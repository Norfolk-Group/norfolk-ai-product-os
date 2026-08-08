import assert from "node:assert/strict";
import { createHash, createPublicKey } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const expectedFingerprint = "bbb53e2c1af53b57b02caa19d73bd8bfb1bd779a1317df9acee08fa7e1e8ae58";

test("the reviewed trusted release key is Ed25519 and matches its ceremony fingerprint", async () => {
  const pem = await readFile("trust/product-os-release-public-key.pem", "utf8");
  const key = createPublicKey(pem);
  const fingerprint = createHash("sha256").update(key.export({ type: "spki", format: "der" })).digest("hex");
  const ceremony = await readFile("trust/2026-08-07-key-ceremony.md", "utf8");

  assert.equal(key.asymmetricKeyType, "ed25519");
  assert.equal(fingerprint, expectedFingerprint);
  assert.match(ceremony, new RegExp(expectedFingerprint));
  assert.doesNotMatch(ceremony, /BEGIN PRIVATE KEY|END PRIVATE KEY/);
});
