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
  return ajv.compile(await json("schemas/application-inventory.schema.json"));
}

test("a traceable existing product can reach the design-contract gate", async () => {
  assert.equal((await validator())(await json("tests/fixtures/product-method/valid-existing.json")), true);
});

test("an observation cannot contain a recommendation", async () => {
  assert.equal((await validator())(await json("tests/fixtures/product-method/invalid-category-mix.json")), false);
});

test("a recommendation requires evidence, a goal, confidence, impact, and effort", async () => {
  assert.equal((await validator())(await json("tests/fixtures/product-method/invalid-recommendation.json")), false);
});

test("a gated route requires permission ownership", async () => {
  assert.equal((await validator())(await json("tests/fixtures/product-method/invalid-gated-route.json")), false);
});

test("a product with no UI records the fact without inventing observations", async () => {
  assert.equal((await validator())(await json("tests/fixtures/product-method/valid-greenfield.json")), true);
});

test("a greenfield record rejects invented current-state evidence", async () => {
  assert.equal((await validator())(await json("tests/fixtures/product-method/invalid-greenfield-evidence.json")), false);
});

test("an existing inventory item requires an observation link", async () => {
  assert.equal((await validator())(await json("tests/fixtures/product-method/invalid-untraceable-inventory.json")), false);
});

test("design-contract status requires approved information architecture", async () => {
  assert.equal((await validator())(await json("tests/fixtures/product-method/invalid-design-before-ia.json")), false);
});
