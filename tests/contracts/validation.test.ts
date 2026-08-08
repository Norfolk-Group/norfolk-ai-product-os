import assert from "node:assert/strict";
import { existsSync } from "node:fs";
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

test("exact source inventories and audit history live only in publication-blocked validation evidence", async () => {
  for (const name of ["motion-source-inventory.md", "norfolk-ai-product-os-conversation-audit.md"]) {
    const validationPath = resolve(root, `validation/${name}`);
    assert.equal(existsSync(validationPath), true, validationPath);
    assert.equal(existsSync(resolve(root, `outputs/${name}`)), false, name);
    assert.match(await readFile(validationPath, "utf8"), /Publication:\s*\*\*blocked\*\*/i, name);
  }

  const readiness = await readFile(resolve(root, "validation/release-readiness.md"), "utf8");
  assert.match(readiness, /Publication:\s*\*\*blocked\*\*/i);
});

test("the bounded validation records the current source commit and accepted U11 dispositions", async () => {
  const body = await readFile(resolve(root, "validation/h-analytics.md"), "utf8");
  assert.match(body, /Source commit: `eeb05f9563b93f8842d2257eb7054555935f7e44`/);
  for (const proposal of ["PP-U11-ICON-GRAMMAR", "PP-U11-PARITY-EXCEPTIONS"]) {
    assert.match(body, new RegExp(`\\| ${proposal} \\| accepted \\|`), proposal);
  }
  assert.match(body, /decisions\/0007-governed-icon-and-capability-parity-exceptions\.md/);
});

test("motion evidence accepts reusable governance without selecting a visual master", async () => {
  const evidence = await readFile(resolve(root, "validation/motion-lineage.md"), "utf8");
  assert.match(evidence, /Source commit: `eeb05f9563b93f8842d2257eb7054555935f7e44`/);
  assert.match(evidence, /reusable architecture[^\n]+accepted/i);
  assert.match(evidence, /PP-U11-MOTION-MASTER[^\n]+deferred/i);
  for (const gate of ["pinned visual comparison", "reuse-rights approval", "immutable R2 preservation"]) {
    assert.match(evidence, new RegExp(gate, "i"), gate);
  }
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

test("release readiness closes all accepted U11 proposals after immutable candidate.4", async () => {
  const readiness = await readFile(resolve(root, "validation/release-readiness.md"), "utf8");
  for (const proposal of ["PP-U11-ICON-GRAMMAR", "PP-U11-PARITY-EXCEPTIONS", "PP-U11-DECK-IR"]) {
    assert.match(readiness, new RegExp(`\\| ${proposal} \\| accepted \\|`), proposal);
  }
  assert.match(readiness, /0\.3\.0-candidate\.4[^\n]+immutable history/i);
  assert.match(readiness, /accepted contracts[^\n]+postdate[^\n]+0\.3\.0-candidate\.4/i);
  assert.match(readiness, /new signed candidate[^\n]+after this (?:change|PR) merges/i);
  assert.doesNotMatch(readiness, /Candidate `0\.3\.0-candidate\.4` is the current review candidate/);
});

test("release readiness retains every truthful publication gate", async () => {
  const readiness = await readFile(resolve(root, "validation/release-readiness.md"), "utf8");
  for (const gate of [
    /application-level[^\n]+WorkOS[^\n]+login/i,
    /source-master[^\n]+R2[^\n]+preservation/i,
    /official Norfolk AI[^\n]+identity[^\n]+deferred/i,
    /release-specific authorization/i,
    /explicit publication approval/i,
  ]) assert.match(readiness, gate);
});

test("the throwaway application verifies adoption, rollback, and exception preservation", async () => {
  const body = await readFile(resolve(root, "validation/throwaway-application.md"), "utf8");
  for (const phrase of ["signature verified", "all content hashes verified", "rollback verified", "local exception preserved", "no repository mutation"]) assert.ok(body.includes(phrase), phrase);
});
