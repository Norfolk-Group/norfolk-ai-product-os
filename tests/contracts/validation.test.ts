import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { validateValidationArtifact } from "../../tools/validate/retirement.js";

const root = resolve(import.meta.dirname, "../..");

test("all client-derived validation slices are pinned, non-public, and proposal-only", async () => {
  for (const name of ["h-analytics.md", "motion-lineage.md", "report-output.md"]) {
    const body = await readFile(resolve(root, `validation/${name}`), "utf8");
    assert.deepEqual(validateValidationArtifact(body), [], name);
  }
});

test("the throwaway application verifies adoption, rollback, and exception preservation", async () => {
  const body = await readFile(resolve(root, "validation/throwaway-application.md"), "utf8");
  for (const phrase of ["signature verified", "all content hashes verified", "rollback verified", "local exception preserved", "no repository mutation"]) assert.ok(body.includes(phrase), phrase);
});
