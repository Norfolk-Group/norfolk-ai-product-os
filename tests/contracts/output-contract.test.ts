import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import test from "node:test";
import { validateFinancialTieOut, validateOutputContract, validateSpreadsheetCell } from "../../tools/validate/outputs.js";

type Validator = ((value: unknown) => boolean) & { errors?: unknown[] | null };
type AjvInstance = { compile: (schema: unknown) => Validator };
type AjvConstructor = new (options?: Record<string, unknown>) => AjvInstance;
const Ajv = createRequire(import.meta.url)("ajv") as AjvConstructor;
const root = resolve(import.meta.dirname, "../..");
const json = async (path: string) => JSON.parse(await readFile(resolve(root, path), "utf8"));
async function validator() { return new Ajv({ allErrors: true, strict: false, validateFormats: false }).compile(await json("schemas/output-contract.schema.json")); }

test("all output families declare normal, overflow, empty, and unavailable golden states", async () => {
  const matrix = await json("tests/fixtures/outputs/golden-matrix.json");
  assert.deepEqual(Object.keys(matrix).sort(), ["chart", "docx", "email", "investor", "pdf", "pptx", "print", "xlsx"]);
  for (const states of Object.values(matrix) as string[][]) assert.deepEqual(states, ["normal", "overflow", "empty", "unavailable"]);
});

test("PDF typography floor and controlled margins are mandatory", async () => {
  const value = await json("tests/fixtures/outputs/invalid-pdf.json");
  assert.equal((await validator())(value), false);
});

test("charts require units, source, date basis, and accessible alternative", async () => {
  assert.ok(validateOutputContract(await json("tests/fixtures/outputs/invalid-chart.json")).length >= 4);
});

test("investor numbers must tie to the authoritative calculation snapshot", async () => {
  const fixture = await json("tests/fixtures/outputs/invalid-financial-tieout.json");
  assert.ok(validateFinancialTieOut(fixture.rendered, fixture.authoritative).length > 0);
});

test("spreadsheet formula injection is rejected or escaped", () => {
  for (const value of ["=HYPERLINK(\"bad\")", "+cmd", "-1+2", "@SUM(A1:A2)"]) assert.ok(validateSpreadsheetCell(value).length > 0);
  assert.deepEqual(validateSpreadsheetCell("Net revenue"), []);
});

test("large generated masters require a versioned R2 manifest", async () => {
  const value = await json("tests/fixtures/outputs/invalid-large-asset.json");
  assert.ok(validateOutputContract(value).some((error) => error.includes("R2")));
});
