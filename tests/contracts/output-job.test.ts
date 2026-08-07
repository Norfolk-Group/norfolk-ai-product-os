import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { validateOutputJob } from "../../tools/validate/outputs.js";

const root = resolve(import.meta.dirname, "../..");
const json = async (path: string) => JSON.parse(await readFile(resolve(root, path), "utf8"));

test("a complete authorized output job is accepted before its signed URL expires", async () => {
  assert.deepEqual(validateOutputJob(await json("tests/fixtures/outputs/valid-job.json"), new Date("2026-08-05T12:00:00Z")), []);
});

test("implicit output-job validation uses the current clock", async () => {
  assert.ok(validateOutputJob(await json("tests/fixtures/outputs/valid-job.json")).some((error) => error.includes("expired")));
});

test("XLSX scope must preserve every filter and selection declared by the request", async () => {
  assert.ok(validateOutputJob(await json("tests/fixtures/outputs/invalid-scope-job.json")).some((error) => error.includes("scope")));
});

test("unauthorized recipient, expired URL, and duplicate retry fail closed", async () => {
  const errors = validateOutputJob(await json("tests/fixtures/outputs/invalid-delivery-job.json"), new Date("2026-08-05T12:00:00Z"));
  assert.ok(errors.some((error) => error.includes("recipient")));
  assert.ok(errors.some((error) => error.includes("expired")));
  assert.ok(errors.some((error) => error.includes("idempotency")));
});
