import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import test from "node:test";
import { validateDesignContract } from "../../tools/validate/design.js";

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

test("a coherent product-local icon library is accepted only with an approved design exception", async () => {
  const contract = await json("tests/fixtures/design/valid-contract.json");
  contract.foundations.iconography = await json("design/iconography.product-local-exception.example.json");

  const validate = await compile("design-contract");
  assert.equal(validate(contract), true, JSON.stringify(validate.errors));
});

test("a product-local icon exception carries the complete governed exception record", async () => {
  const contract = await json("tests/fixtures/design/valid-contract.json");
  contract.foundations.iconography = await json("design/iconography.product-local-exception.example.json");
  Object.assign(contract.foundations.iconography.exception, {
    product: "Synthetic product",
    standard: "design/foundations.md#iconography",
    scope: "Existing user-facing surfaces in the synthetic product",
    rationale: "Preserve an established coherent grammar during bounded adoption.",
    risk: "The local grammar may drift from the Norfolk default.",
    compensatingControls: ["One import boundary and review-owned mapping."],
    evidence: ["Synthetic accessibility review EVIDENCE-4242"],
    approvedAt: "2026-08-08T12:00:00Z",
    migrationConsequence: "Map icons to Lucide before the exception is resolved."
  });
  const validate = await compile("design-contract");
  assert.equal(validate(contract), true, JSON.stringify(validate.errors));
});

test("a product-local icon exception fails when any governance proof is absent", async () => {
  const base = await json("tests/fixtures/design/valid-contract.json");
  const iconography = await json("design/iconography.product-local-exception.example.json");
  const exception = iconography.exception;
  const validate = await compile("design-contract");

  for (const field of Object.keys(exception)) {
    const incomplete = structuredClone(base);
    const proof = structuredClone(exception) as Record<string, unknown>;
    delete proof[field];
    incomplete.foundations.iconography = { ...iconography, exception: proof };
    assert.equal(validate(incomplete), false, `missing ${field}`);
  }

  const undocumented = structuredClone(base);
  undocumented.foundations.iconography = { library: "Synthetic Mono", minimumSizePx: 16 };
  assert.equal(validate(undocumented), false, "an alternative library without an exception must fail");
});

test("a product-local icon exception requires an ISO review date", async () => {
  const contract = await json("tests/fixtures/design/valid-contract.json");
  contract.foundations.iconography = await json("design/iconography.product-local-exception.example.json");
  contract.foundations.iconography.exception.reviewAt = "not-a-date";
  assert.equal((await compile("design-contract"))(contract), false);
});

test("Lucide aliases cannot bypass the canonical stroke contract", async () => {
  const validate = await compile("design-contract");
  for (const library of ["lucide", "LUCIDE", "Lucide ", "Lucide/icons", "Lucide React", "lucide-react", "@lucide/lab", "@Lucide/icons"]) {
    const contract = await json("tests/fixtures/design/valid-contract.json");
    contract.foundations.iconography = await json("design/iconography.product-local-exception.example.json");
    contract.foundations.iconography.library = library;
    assert.equal(validate(contract), false, library);
  }
});

test("a product-local icon exception rejects impossible dates and malformed approval timestamps", async () => {
  for (const [field, value] of [
    ["reviewAt", "2027-02-31"],
    ["reviewAt", "2026-08-08garbage"],
    ["approvedAt", "2027-02-31T12:00:00Z"],
    ["approvedAt", "2026-08-08Tgarbage"]
  ]) {
    const contract = await json("tests/fixtures/design/valid-contract.json");
    contract.foundations.iconography = await json("design/iconography.product-local-exception.example.json");
    contract.foundations.iconography.exception[field] = value;
    assert.ok(validateDesignContract(contract).some((error) => error.includes(field)), `${field}: ${value}`);
  }

  const malformed = await json("tests/fixtures/design/valid-contract.json");
  malformed.foundations.iconography = await json("design/iconography.product-local-exception.example.json");
  malformed.foundations.iconography.exception.approvedAt = "2026-08-08Tgarbage";
  assert.equal((await compile("design-contract"))(malformed), false, "schema accepted malformed approvedAt");
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
