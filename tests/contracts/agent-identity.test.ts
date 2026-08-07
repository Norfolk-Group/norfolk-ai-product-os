import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { validateAgentIdentityRegistry } from "../../tools/validate/standards.js";

const root = resolve(import.meta.dirname, "../..");
const registry = async () => JSON.parse(await readFile(resolve(root, "standards/agent-identity.example.json"), "utf8"));

test("the canonical agent registry distinguishes LLM members from deterministic minions", async () => {
  assert.deepEqual(validateAgentIdentityRegistry(await registry()), []);
});

test("a minion cannot call an LLM or exercise judgment", async () => {
  const value = await registry();
  const minion = value.members.find((member: { type: string }) => member.type === "minion");
  minion.usesLlm = true;
  minion.exercisesJudgment = true;
  const errors = validateAgentIdentityRegistry(value);
  assert.ok(errors.some((error) => error.includes("minion") && error.includes("LLM")));
  assert.ok(errors.some((error) => error.includes("minion") && error.includes("judgment")));
});

test("a conversational agent has a female identity and an explicit AI disclosure", async () => {
  const value = await registry();
  const conversational = value.members.find((member: { conversational: boolean }) => member.conversational);
  conversational.presentation.genderIdentity = "male";
  conversational.presentation.explicitAiDisclosure = false;
  const errors = validateAgentIdentityRegistry(value);
  assert.ok(errors.some((error) => error.includes("female")));
  assert.ok(errors.some((error) => error.includes("AI disclosure")));
});

test("a photoreal conversational identity requires three choices and an abstract fallback", async () => {
  const value = await registry();
  const conversational = value.members.find((member: { conversational: boolean }) => member.conversational);
  conversational.presentation.candidateCount = 1;
  conversational.presentation.abstractFallback = false;
  const errors = validateAgentIdentityRegistry(value);
  assert.ok(errors.some((error) => error.includes("three candidates")));
  assert.ok(errors.some((error) => error.includes("abstract fallback")));
});

test("names are unique only within one product scope", async () => {
  const value = await registry();
  const duplicate = { ...value.members[0], id: "duplicate-local" };
  value.members.push(duplicate);
  assert.ok(validateAgentIdentityRegistry(value).some((error) => error.includes("duplicate name")));
  duplicate.productScope = "another-product";
  assert.deepEqual(validateAgentIdentityRegistry(value), []);
});
