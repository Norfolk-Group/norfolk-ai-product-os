import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { validateCapabilityMap } from "../../tools/validate/standards.js";

const root = resolve(import.meta.dirname, "../..");
const json = async (path: string) => JSON.parse(await readFile(resolve(root, path), "utf8"));

test("every capability shares one authorized procedure and policy across transports", async () => {
  assert.deepEqual(validateCapabilityMap(await json("standards/capability-map.example.json")), []);
});

test("a UI capability without an authorized agent procedure fails", async () => {
  const invalid = await json("tests/fixtures/standards/invalid-agent-parity.json");
  assert.ok(validateCapabilityMap(invalid).some((error) => error.includes("procedure")));
});

test("different authorization or human approval rules across UI and MCP fail", async () => {
  const invalid = await json("tests/fixtures/standards/invalid-auth-parity.json");
  const errors = validateCapabilityMap(invalid);
  assert.ok(errors.some((error) => error.includes("authorization")));
  assert.ok(errors.some((error) => error.includes("approval")));
});
