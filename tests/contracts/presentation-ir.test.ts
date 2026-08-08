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

async function semanticValidator() {
  const modulePath = "../../tools/validate/presentation.js";
  const module = await import(modulePath).catch(() => null);
  assert.ok(module, "presentation IR semantic validator is missing");
  assert.equal(typeof module.validatePresentationIr, "function");
  return module.validatePresentationIr as (value: unknown) => string[];
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

test("the semantic validator accepts the governed synthetic example", async () => {
  const { fixture } = await fixtureAndValidator();
  assert.deepEqual((await semanticValidator())(fixture), []);
});

test("semantic, render, token, and asset IDs must be unique", async () => {
  const { fixture } = await fixtureAndValidator();
  const validate = await semanticValidator();
  const cases: Array<[string, (value: typeof fixture) => void, string]> = [
    ["semantic slide", (value) => value.semantic.slides.push(structuredClone(value.semantic.slides[0])), "duplicate semantic slide ID"],
    ["semantic element", (value) => value.semantic.slides[0].elements.push(structuredClone(value.semantic.slides[0].elements[0])), "duplicate semantic element ID"],
    ["render slide", (value) => value.render.slides.push(structuredClone(value.render.slides[0])), "duplicate render slide ID"],
    ["render element", (value) => value.render.slides[0].elements.push(structuredClone(value.render.slides[0].elements[0])), "duplicate render element ID"],
    ["theme token", (value) => value.theme.tokens.push(structuredClone(value.theme.tokens[0])), "duplicate theme token ID"],
    ["asset", (value) => value.assets.push(structuredClone(value.assets[0])), "duplicate asset ID"],
  ];

  for (const [name, mutate, expected] of cases) {
    const invalid = structuredClone(fixture);
    mutate(invalid);
    assert.ok(validate(invalid).some((error) => error.includes(expected)), name);
  }
});

test("semantic, render, token, and asset references must resolve", async () => {
  const { fixture } = await fixtureAndValidator();
  const validate = await semanticValidator();
  const cases: Array<[string, (value: typeof fixture) => void, string]> = [
    ["render slide", (value) => { value.render.slides[0].semanticSlideId = "slide.missing"; }, "unknown semantic slide"],
    ["render element", (value) => { value.render.slides[0].elements[0].semanticElementId = "element.missing"; }, "unknown semantic element"],
    ["background token", (value) => { value.render.slides[0].backgroundTokenId = "token.color.missing"; }, "unknown theme token"],
    ["style token", (value) => { value.render.slides[0].elements[0].styleTokenRefs[0] = "token.font.missing"; }, "unknown theme token"],
    ["render asset", (value) => { value.render.slides[0].elements[3].assetId = "asset.missing"; }, "unknown asset"],
    ["semantic asset", (value) => { value.semantic.slides[0].elements[3].content.assetId = "asset.missing"; }, "unknown asset"],
  ];

  for (const [name, mutate, expected] of cases) {
    const invalid = structuredClone(fixture);
    mutate(invalid);
    assert.ok(validate(invalid).some((error) => error.includes(expected)), name);
  }
});

test("render and verification revisions must match the semantic revision", async () => {
  const { fixture } = await fixtureAndValidator();
  const validate = await semanticValidator();

  const staleRender = structuredClone(fixture);
  staleRender.render.sourceSemanticRevisionId = "revision.stale";
  assert.ok(validate(staleRender).some((error) => error.includes("render source revision")));

  const staleVerification = structuredClone(fixture);
  staleVerification.verification.sourceSemanticRevisionId = "revision.stale";
  assert.ok(validate(staleVerification).some((error) => error.includes("verification source revision")));
});

test("reading order exactly covers non-decorative semantic elements", async () => {
  const { fixture } = await fixtureAndValidator();
  const validate = await semanticValidator();

  const omitted = structuredClone(fixture);
  omitted.semantic.slides[0].accessibility.readingOrder.pop();
  assert.ok(validate(omitted).some((error) => error.includes("missing non-decorative element element.metric")));

  const decorative = structuredClone(fixture);
  decorative.semantic.slides[0].accessibility.readingOrder.push("element.marker");
  assert.ok(validate(decorative).some((error) => error.includes("contains decorative element element.marker")));

  const unknown = structuredClone(fixture);
  unknown.semantic.slides[0].accessibility.readingOrder.push("element.missing");
  assert.ok(validate(unknown).some((error) => error.includes("contains unknown element element.missing")));
});

test("truncation requires a disclosure label", async () => {
  const { fixture, validate } = await fixtureAndValidator();
  const truncating = structuredClone(fixture);
  truncating.semantic.slides[0].overflow.strategy = "truncate-with-disclosure";
  assert.equal(validate(truncating), false);

  truncating.semantic.slides[0].overflow.continuationLabel = "Continued in accessible notes";
  assert.equal(validate(truncating), true, JSON.stringify(validate.errors));
});

test("text-only presentations do not require an asset registry entry", async () => {
  const { fixture, validate } = await fixtureAndValidator();
  const textOnly = structuredClone(fixture);
  textOnly.assets = [];
  textOnly.semantic.slides[0].elements = textOnly.semantic.slides[0].elements.filter(
    (element: { id: string }) => element.id !== "element.marker",
  );
  textOnly.render.slides[0].elements = textOnly.render.slides[0].elements.filter(
    (element: { id: string }) => element.id !== "render-element.marker",
  );

  assert.equal(validate(textOnly), true, JSON.stringify(validate.errors));
  assert.deepEqual((await semanticValidator())(textOnly), []);
});
