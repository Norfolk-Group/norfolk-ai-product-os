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

test("the presentation IR proposal is accepted without opening publication or client reuse", async () => {
  const evidence = await readFile(resolve(root, "validation/report-output.md"), "utf8");
  assert.match(evidence, /Source commit: `eeb05f9563b93f8842d2257eb7054555935f7e44`/);
  assert.match(evidence, /\| PP-U11-DECK-IR \| accepted \|/);
  assert.match(evidence, /outputs\/presentation-ir\.md/);
  assert.match(evidence, /Publication: blocked/i);

  const outputIndex = await readFile(resolve(root, "outputs/README.md"), "utf8");
  const pptx = await readFile(resolve(root, "outputs/pptx.md"), "utf8");
  assert.match(outputIndex, /\[Presentation IR\]\(presentation-ir\.md\)/);
  assert.match(pptx, /\[presentation IR\]\(presentation-ir\.md\)/i);

  const readiness = await readFile(resolve(root, "validation/release-readiness.md"), "utf8");
  assert.doesNotMatch(readiness, /resolution or explicit deferral[^\n]+PP-U11-DECK-IR/);
});

test("the throwaway application verifies adoption, rollback, and exception preservation", async () => {
  const body = await readFile(resolve(root, "validation/throwaway-application.md"), "utf8");
  for (const phrase of ["signature verified", "all content hashes verified", "rollback verified", "local exception preserved", "no repository mutation"]) assert.ok(body.includes(phrase), phrase);
});
