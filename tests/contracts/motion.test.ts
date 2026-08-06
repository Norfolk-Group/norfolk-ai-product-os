import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import test from "node:test";
import { validateMotionRecord, validateProgressEvents, validateVisualCapture } from "../../tools/validate/motion.js";

type Validator = ((value: unknown) => boolean) & { errors?: unknown[] | null };
type AjvInstance = { compile: (schema: unknown) => Validator };
type AjvConstructor = new (options?: Record<string, unknown>) => AjvInstance;
const Ajv = createRequire(import.meta.url)("ajv") as AjvConstructor;
const root = resolve(import.meta.dirname, "../..");
const json = async (path: string) => JSON.parse(await readFile(resolve(root, path), "utf8"));

async function compile(name: string) {
  const ajv = new Ajv({ allErrors: true, strict: false, validateFormats: false });
  return ajv.compile(await json(`schemas/${name}.schema.json`));
}

test("a complete approved motion lineage can become canonical", async () => {
  const record = await json("tests/fixtures/motion/valid-canonical.json");
  assert.equal((await compile("motion-record"))(record), true);
  assert.deepEqual(validateMotionRecord(record), []);
});

test("motion without complete lineage and approval cannot become canonical", async () => {
  const record = await json("tests/fixtures/motion/invalid-unapproved.json");
  assert.ok(validateMotionRecord(record).some((error) => error.includes("canonical")));
});

test("indeterminate progress cannot fabricate a percentage", () => {
  assert.ok(validateProgressEvents([{ state: "indeterminate", percent: 50, elapsedMs: 4000 }]).some((error) => error.includes("percentage")));
});

test("determinate progress is server-grounded and cannot regress without restart", () => {
  const events = [
    { state: "determinate", percent: 70, source: "server", stageId: "build" },
    { state: "determinate", percent: 30, source: "server", stageId: "build" }
  ];
  assert.ok(validateProgressEvents(events).some((error) => error.includes("regress")));
});

test("a restart establishes the next monotonic progress baseline", () => {
  const events = [
    { state: "determinate", percent: 80, source: "server", stageId: "build" },
    { state: "determinate", percent: 10, source: "server", stageId: "build", restart: true },
    { state: "determinate", percent: 5, source: "server", stageId: "build" },
  ];
  assert.ok(validateProgressEvents(events).some((error) => error.includes("regress")));
});

test("late completion and duplicates do not turn cancellation into normal success", () => {
  const events = [
    { state: "cancelled", eventId: "1" },
    { state: "success", eventId: "2" },
    { state: "late-completion", eventId: "2" }
  ];
  const errors = validateProgressEvents(events);
  assert.ok(errors.some((error) => error.includes("late-completion")));
  assert.ok(errors.some((error) => error.includes("duplicate")));
});

test("duplicate-event records reconcile only an event already observed", () => {
  assert.deepEqual(validateProgressEvents([
    { state: "waiting", eventId: "1" },
    { state: "duplicate-event", eventId: "1" },
  ]), []);
  assert.ok(validateProgressEvents([{ state: "duplicate-event", eventId: "missing" }]).some((error) => error.includes("previous")));
});

test("reduced motion preserves semantic state and completion information", async () => {
  const record = await json("tests/fixtures/motion/valid-canonical.json");
  record.reducedMotion.preservedInformation = [];
  assert.ok(validateMotionRecord(record).some((error) => error.includes("reduced motion")));
});

test("an unpinned or unapproved visual capture is non-comparable", async () => {
  const capture = await json("tests/fixtures/motion/invalid-capture.json");
  assert.ok(validateVisualCapture(capture).length >= 2);
});

test("an immutable copy checksum mismatch stops reconciliation", async () => {
  const record = await json("tests/fixtures/motion/valid-canonical.json");
  record.lineage[0].retrievedSha256 = "0".repeat(64);
  assert.ok(validateMotionRecord(record).some((error) => error.includes("retrieval checksum")));
});
