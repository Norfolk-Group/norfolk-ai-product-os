import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { validateAuthExperience } from "../../tools/validate/auth.js";

const root = resolve(import.meta.dirname, "../..");
const json = async (path: string) => JSON.parse(await readFile(resolve(root, path), "utf8"));

test("the first-party auth contract covers every required journey and owner", async () => {
  assert.deepEqual(validateAuthExperience(await json("tests/fixtures/auth/valid-experience.json")), []);
});

test("open and invite-only modes cannot leak into one another", async () => {
  assert.ok(validateAuthExperience(await json("tests/fixtures/auth/invalid-entry-mode.json")).some((error) => error.includes("entry mode")));
});

test("every state has keyboard, screen-reader, slow-network, recovery, and reduced-motion behavior", async () => {
  assert.ok(validateAuthExperience(await json("tests/fixtures/auth/invalid-incomplete-state.json")).length >= 4);
});
