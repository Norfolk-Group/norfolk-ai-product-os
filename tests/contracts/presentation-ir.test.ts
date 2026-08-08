import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import test from "node:test";

type SchemaError = { instancePath: string; keyword: string };
type Validator = ((value: unknown) => boolean) & { errors?: SchemaError[] | null };
type AjvInstance = { compile: (schema: unknown) => Validator };
type AjvConstructor = new (options?: Record<string, unknown>) => AjvInstance;

const Ajv = createRequire(import.meta.url)("ajv") as AjvConstructor;
const root = resolve(import.meta.dirname, "../..");
const json = async (path: string) => JSON.parse(await readFile(resolve(root, path), "utf8"));

async function fixtureAndValidator() {
  assert.equal(existsSync(resolve(root, "schemas/presentation-ir.schema.json")), true, "presentation IR schema is missing");
  assert.equal(existsSync(resolve(root, "outputs/presentation-ir.example.json")), true, "synthetic presentation IR example is missing");
  const schema = await json("schemas/presentation-ir.schema.json");
  const fixture = await json("outputs/presentation-ir.example.json");
  return {
    fixture,
    validate: new Ajv({ allErrors: true, strict: false, validateFormats: false }).compile(schema),
  };
}

test("the Norfolk presentation IR accepts the governed synthetic example", async () => {
  const { fixture, validate } = await fixtureAndValidator();
  assert.equal(validate(fixture), true, JSON.stringify(validate.errors));
  assert.equal(fixture.owner, "Norfolk AI");
  assert.equal(fixture.contentClassification, "synthetic-only");
  assert.equal(fixture.units, "pt");
});

test("semantic content cannot carry renderer geometry or client provenance", async () => {
  const { fixture, validate } = await fixtureAndValidator();
  const semanticElement = fixture.semantic.slides[0].elements[0];

  const geometricSemantic = structuredClone(fixture);
  geometricSemantic.semantic.slides[0].elements[0] = { ...semanticElement, x: 24 };
  assert.equal(validate(geometricSemantic), false);

  const clientSource = structuredClone(fixture);
  clientSource.semantic.slides[0].elements[0].provenance.sourceKind = "client";
  assert.equal(validate(clientSource), false);
});

test("overflow, governed assets, and accessible reading order fail closed", async () => {
  const { fixture, validate } = await fixtureAndValidator();

  const clipped = structuredClone(fixture);
  clipped.semantic.slides[0].overflow.strategy = "clip";
  assert.equal(validate(clipped), false);

  const ungovernedAsset = structuredClone(fixture);
  ungovernedAsset.assets[0].governance.status = "unknown";
  assert.equal(validate(ungovernedAsset), false);

  const missingReadingOrder = structuredClone(fixture);
  delete missingReadingOrder.semantic.slides[0].accessibility.readingOrder;
  assert.equal(validate(missingReadingOrder), false);
});

test("renderer verification and deterministic output evidence are mandatory", async () => {
  const { fixture, validate } = await fixtureAndValidator();

  const missingCheck = structuredClone(fixture);
  missingCheck.verification.checks = missingCheck.verification.checks.filter(
    (check: { name: string }) => check.name !== "reading-order",
  );
  assert.equal(validate(missingCheck), false);

  const nondeterministic = structuredClone(fixture);
  nondeterministic.determinism.externalFetches = "allowed";
  assert.equal(validate(nondeterministic), false);

  const unhashedOutput = structuredClone(fixture);
  delete unhashedOutput.verification.output.sha256;
  assert.equal(validate(unhashedOutput), false);
});
