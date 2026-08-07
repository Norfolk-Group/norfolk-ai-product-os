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

async function json(path: string) { return JSON.parse(await readFile(resolve(root, path), "utf8")); }
async function compile(name: string) {
  const ajv = new Ajv({ allErrors: true, strict: false, validateFormats: false });
  return ajv.compile(await json(`schemas/${name}.schema.json`));
}

test("a complete product design contract is accepted", async () => {
  assert.equal((await compile("design-contract"))(await json("tests/fixtures/design/valid-contract.json")), true);
});

test("numeric typography, error behavior, mobile treatment, and forbidden patterns are mandatory", async () => {
  assert.equal((await compile("design-contract"))(await json("tests/fixtures/design/invalid-incomplete-contract.json")), false);
});

test("a product palette cannot masquerade as a universal foundation", async () => {
  assert.equal((await compile("design-contract"))(await json("tests/fixtures/design/invalid-product-palette-as-foundation.json")), false);
});

test("a named-only reference cannot source an accepted rule", async () => {
  const schema = await json("schemas/design-contract.schema.json");
  const validate = (await compile("design-contract"));
  const fixture = await json("tests/fixtures/design/invalid-named-reference-rule.json");
  assert.equal(validate({ ...(await json("tests/fixtures/design/valid-contract.json")), references: [fixture.reference], rules: [fixture.rule] }), false, JSON.stringify(schema));
});

test("a local variation requires a governed variant or exception", async () => {
  const fixture = await json("tests/fixtures/design/invalid-local-variation.json");
  assert.equal((await compile("design-contract"))({ ...(await json("tests/fixtures/design/valid-contract.json")), variations: [fixture] }), false);
});

test("a user preference cannot override client brand identity", async () => {
  const fixture = await json("tests/fixtures/design/invalid-user-brand-override.json");
  const contract = await json("tests/fixtures/design/valid-contract.json");
  contract.inheritance.userPreferences = fixture;
  assert.equal((await compile("design-contract"))(contract), false);
});

test("a shadcn source mismatch blocks acceptance", async () => {
  const fixture = await json("tests/fixtures/design/invalid-shadcn-mismatch.json");
  const contract = { ...(await json("tests/fixtures/design/valid-contract.json")), shadcnInputs: [fixture] };
  assert.equal((await compile("design-contract"))(contract), true, "the structural schema should accept a claimed match");
  const validatorPath = "../../tools/validate/design.js";
  const module = await import(validatorPath).catch(() => null);
  assert.ok(module, "the semantic design validator must exist");
  assert.ok(module.validateDesignContract(contract).some((error: string) => error.includes("hash mismatch")));
});

test("a complete component state contract is accepted", async () => {
  assert.equal((await compile("component-specimen"))(await json("tests/fixtures/design/valid-component.json")), true);
});

test("a component cannot omit focus, loading, error, or reduced-motion metadata", async () => {
  assert.equal((await compile("component-specimen"))(await json("tests/fixtures/design/invalid-component-states.json")), false);
});
