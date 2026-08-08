import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import YAML from "yaml";
import { validateProviderReadinessWorkflow, validateTrustedReleaseWorkflow } from "../../tools/validate/workflows.js";

const root = resolve(import.meta.dirname, "../..");

test("trusted release workflow enforces manual main-only OIDC publication", async () => {
  const workflow = YAML.parse(await readFile(resolve(root, ".github/workflows/trusted-private-release.yml"), "utf8"));
  assert.deepEqual(validateTrustedReleaseWorkflow(workflow), []);
});

test("release workflow validator rejects write permission before protected release", async () => {
  const workflow = YAML.parse(await readFile(resolve(root, ".github/workflows/trusted-private-release.yml"), "utf8"));
  workflow.jobs.preflight.permissions.contents = "write";
  assert.ok(validateTrustedReleaseWorkflow(workflow).some((error) => error.includes("preflight must be read-only")));
});

test("release workflow validator rejects direct shell interpolation of dispatch inputs", async () => {
  const workflow = YAML.parse(await readFile(resolve(root, ".github/workflows/trusted-private-release.yml"), "utf8"));
  workflow.jobs.preflight.steps.push({ run: 'echo "${{ inputs.release_version }}"' });
  assert.ok(validateTrustedReleaseWorkflow(workflow).some((error) => error.includes("through environment variables")));
});

test("provider workflow cannot publish contents", async () => {
  const workflow = YAML.parse(await readFile(resolve(root, ".github/workflows/provider-readiness.yml"), "utf8"));
  assert.deepEqual(validateProviderReadinessWorkflow(workflow), []);
  workflow.jobs.diagnostic.permissions.contents = "write";
  assert.ok(validateProviderReadinessWorkflow(workflow).some((error) => error.includes("must not write contents")));
});
