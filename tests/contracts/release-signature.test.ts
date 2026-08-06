import assert from "node:assert/strict";
import { generateKeyPairSync, createPublicKey } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { canonicalJson, signManifest, verifyManifest } from "../../tools/release/manifest.js";

const root = resolve(import.meta.dirname, "../..");

test("manifest signing is deterministic over key-sorted canonical JSON", () => {
  assert.equal(canonicalJson({ z: 1, a: { y: 2, b: 3 } }), '{"a":{"b":3,"y":2},"z":1}');
  const keys = generateKeyPairSync("ed25519");
  const bundle = signManifest({ version: "0.3.0-candidate.1", files: [] }, keys.privateKey, "test");
  assert.equal(verifyManifest(bundle, keys.publicKey), true);
  bundle.manifest.version = "0.3.1";
  assert.equal(verifyManifest(bundle, keys.publicKey), false);
});

test("the 0.3 adoption candidate is signed and binds every included file hash", async () => {
  const pkg = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
  const directory = resolve(root, `releases/${pkg.version}`);
  const bundle = JSON.parse(await readFile(resolve(directory, "signed-manifest.json"), "utf8"));
  const key = createPublicKey(await readFile(resolve(directory, "candidate-public-key.pem"), "utf8"));
  assert.equal(verifyManifest(bundle, key), true);
  for (const file of bundle.manifest.files) {
    const body = await readFile(resolve(root, file.path));
    const { sha256 } = await import("../../tools/release/manifest.js");
    assert.equal(sha256(body), file.sha256, file.path);
  }
});
