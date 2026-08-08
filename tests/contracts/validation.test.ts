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

test("the bounded validation records the current source commit and accepted U11 dispositions", async () => {
  const body = await readFile(resolve(root, "validation/h-analytics.md"), "utf8");
  assert.match(body, /Source commit: `eeb05f9563b93f8842d2257eb7054555935f7e44`/);
  for (const proposal of ["PP-U11-ICON-GRAMMAR", "PP-U11-PARITY-EXCEPTIONS"]) {
    assert.match(body, new RegExp(`\\| ${proposal} \\| accepted \\|`), proposal);
  }
  assert.match(body, /decisions\/0007-governed-icon-and-capability-parity-exceptions\.md/);
});

test("the throwaway application verifies adoption, rollback, and exception preservation", async () => {
  const body = await readFile(resolve(root, "validation/throwaway-application.md"), "utf8");
  for (const phrase of ["signature verified", "all content hashes verified", "rollback verified", "local exception preserved", "no repository mutation"]) assert.ok(body.includes(phrase), phrase);
});
