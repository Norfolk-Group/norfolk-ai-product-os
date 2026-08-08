import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import test from "node:test";
import { validateCapabilityMap } from "../../tools/validate/standards.js";

const root = resolve(import.meta.dirname, "../..");
const json = async (path: string) => JSON.parse(await readFile(resolve(root, path), "utf8"));
type Validator = ((value: unknown) => boolean) & { errors?: unknown[] | null };
type AjvInstance = { compile: (schema: unknown) => Validator };
type AjvConstructor = new (options?: Record<string, unknown>) => AjvInstance;
const require = createRequire(import.meta.url);
const Ajv = require("ajv") as AjvConstructor;

async function capabilitySchema() {
  return new Ajv({ allErrors: true, strict: false, validateFormats: false })
    .compile(await json("schemas/capability-map.schema.json"));
}

test("every capability shares one authorized procedure and policy across transports", async () => {
  assert.deepEqual(validateCapabilityMap(await json("standards/capability-map.example.json")), []);
});

test("a UI capability without an authorized agent procedure fails", async () => {
  const invalid = await json("tests/fixtures/standards/invalid-agent-parity.json");
  assert.ok(validateCapabilityMap(invalid).some((error) => error.includes("procedure")));
});

test("different authorization or human approval rules across UI and MCP fail", async () => {
  const invalid = await json("tests/fixtures/standards/invalid-auth-parity.json");
  const errors = validateCapabilityMap(invalid);
  assert.ok(errors.some((error) => error.includes("authorization")));
  assert.ok(errors.some((error) => error.includes("approval")));
});

test("a parity exception requires a constraint, named human path, approval, owner, recovery, and review", async () => {
  const map = await json("standards/capability-map.example.json");
  const exception = {
    reasonType: "physical",
    reason: "A static evidence artifact cannot itself execute an outward send.",
    humanProcedure: "Authorized external-message send procedure (COMMS-RUNBOOK-001)",
    implementationGap: false,
    approval: { kind: "class", reference: "APPROVAL-CLASS-EXTERNAL-COMMUNICATION" },
    owner: "Communications owner",
    recovery: "Stop pending delivery where supported and record a corrective follow-up.",
    review: { reviewer: "AI Platform Owner", reviewAt: "2027-08-08" }
  };
  map.capabilities[1].transports[5].exception = exception;

  const validate = await capabilitySchema();
  assert.equal(validate(map), true, JSON.stringify(validate.errors));
  assert.deepEqual(validateCapabilityMap(map), []);

  for (const field of Object.keys(exception)) {
    const incomplete = structuredClone(map);
    delete incomplete.capabilities[1].transports[5].exception[field];
    assert.equal(validate(incomplete), false, `schema accepted missing ${field}`);
    assert.ok(validateCapabilityMap(incomplete).some((error) => error.includes(field)), `semantic validator accepted missing ${field}`);
  }
});

test("adapter inconvenience cannot be disguised as a physical, legal, or security parity exception", async () => {
  for (const reason of [
    "The current adapter is inconvenient and does not expose the required response object.",
    "The integration needs a missing wrapper before this transport can act.",
    "The integration cannot support this action yet.",
    "The implementation is unavailable in this transport."
  ]) {
    const map = await json("standards/capability-map.example.json");
    Object.assign(map.capabilities[1].transports[5].exception, { reasonType: "security", reason });
    assert.ok(validateCapabilityMap(map).some((error) => error.includes("implementation or adapter limitation")), reason);
  }
});

test("a parity exception requires an ISO review date", async () => {
  const map = await json("standards/capability-map.example.json");
  map.capabilities[1].transports[5].exception.review.reviewAt = "not-a-date";
  const validate = await capabilitySchema();
  assert.equal(validate(map), false, "schema accepted an invalid review date");
  assert.ok(validateCapabilityMap(map).some((error) => error.includes("reviewAt")));
});
