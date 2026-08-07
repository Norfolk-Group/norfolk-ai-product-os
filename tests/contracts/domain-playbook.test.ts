import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import test from "node:test";

type Validator = ((value: unknown) => boolean) & { errors?: unknown[] | null };
type AjvInstance = { compile: (schema: unknown) => Validator };
type AjvConstructor = new (options?: Record<string, unknown>) => AjvInstance;
const require = createRequire(import.meta.url);
const Ajv = require("ajv") as AjvConstructor;
const root = resolve(import.meta.dirname, "../..");

async function json(path: string) {
  return JSON.parse(await readFile(resolve(root, path), "utf8"));
}

async function validator() {
  const ajv = new Ajv({ allErrors: true, strict: false, validateFormats: false });
  return ajv.compile(await json("schemas/domain-playbook.schema.json"));
}

test("an evidence-backed domain playbook can be accepted", async () => {
  assert.equal((await validator())(await json("tests/fixtures/playbooks/valid-evidence-backed.json")), true);
});

test("an unsupported universal claim cannot become accepted guidance", async () => {
  assert.equal((await validator())(await json("tests/fixtures/playbooks/invalid-universal-claim.json")), false);
});
