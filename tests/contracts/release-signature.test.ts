import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import test from "node:test";
import { canonicalJson, signManifest, verifyManifest } from "../../tools/release/manifest.js";

test("manifest signing is deterministic over key-sorted canonical JSON", () => {
  assert.equal(canonicalJson({ z: 1, a: { y: 2, b: 3 } }), '{"a":{"b":3,"y":2},"z":1}');
  const keys = generateKeyPairSync("ed25519");
  const bundle = signManifest({ version: "0.3.0-candidate.1", files: [] }, keys.privateKey, "test");
  assert.equal(verifyManifest(bundle, keys.publicKey), true);
  bundle.manifest.version = "0.3.1";
  assert.equal(verifyManifest(bundle, keys.publicKey), false);
});
