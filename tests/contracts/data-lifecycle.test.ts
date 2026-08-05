import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { validateDataLifecycle, validateMediaTransfer } from "../../tools/validate/standards.js";

const root = resolve(import.meta.dirname, "../..");
const json = async (path: string) => JSON.parse(await readFile(resolve(root, path), "utf8"));

test("sensitive artifacts declare system of record, roles, retention, hold, deletion, backup expiry, and evidence", async () => {
  assert.deepEqual(validateDataLifecycle(await json("standards/data-lifecycle.example.json")), []);
});

test("signed URL expiry alone is not deletion evidence", async () => {
  const errors = validateDataLifecycle(await json("tests/fixtures/standards/invalid-retention-boundary.json"));
  assert.ok(errors.some((error) => error.includes("deletion evidence")));
  assert.ok(errors.some((error) => error.includes("backup expiry")));
});

test("direct media transfer requires bounded grants, durable confirmation, quarantine, and orphan cleanup", async () => {
  const errors = validateMediaTransfer(await json("tests/fixtures/standards/invalid-media-transfer.json"));
  for (const phrase of ["direct", "grant", "confirmation", "quarantine", "orphan"]) {
    assert.ok(errors.some((error) => error.includes(phrase)), phrase);
  }
});
