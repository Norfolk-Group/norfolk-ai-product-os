import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { destructiveActionAvailable, validateRetirementDossier } from "../../tools/validate/retirement.js";

const root = resolve(import.meta.dirname, "../..");
const json = async (path: string) => JSON.parse(await readFile(resolve(root, path), "utf8"));

test("the historical Starter dossier and current Manual dossier expose no destructive operation", async () => {
  for (const name of ["norfolk-starter", "norfolk-manual"]) {
    const dossier = await json(`retirement/${name}.json`);
    assert.deepEqual(validateRetirementDossier(dossier), []);
    assert.equal(destructiveActionAvailable(dossier), false);
    assert.equal(dossier.readiness, "not-ready");
    assert.equal(dossier.missingApproval, true);
  }
});

test("Starter deletion is recorded without rewriting its incomplete pre-deletion evidence", async () => {
  const dossier = await json("retirement/norfolk-starter.json");
  assert.equal(dossier.observedState, "deleted-outside-governed-workflow");
  assert.equal(dossier.preservation.complete, false);
  assert.equal(dossier.recoveryTest.complete, false);
  assert.equal(dossier.missingApproval, true);
});

test("a ready claim fails when any preservation or recovery category is incomplete", async () => {
  const dossier = await json("retirement/norfolk-starter.json");
  dossier.readiness = "ready-for-exact-approval";
  assert.ok(validateRetirementDossier(dossier).length > 0);
});

test("approval cannot expose a destructive action while the dossier is incomplete", async () => {
  const dossier = await json("retirement/norfolk-starter.json");
  dossier.readiness = "approved";
  dossier.missingApproval = false;
  assert.ok(validateRetirementDossier(dossier).length > 0);
  assert.equal(destructiveActionAvailable(dossier), false);
});

test("Manual records every observed branch and remains blocked on restoration and consumers", async () => {
  const dossier = await json("retirement/norfolk-manual.json");
  assert.deepEqual(dossier.branches.githubMcpObserved.sort(), ["deletions/animation-library", "main", "test/kit-guard-proof"]);
  assert.equal(dossier.recoveryTest.safeTargetRestore, false);
  assert.equal(dossier.consumers.complete, false);
  assert.equal(destructiveActionAvailable(dossier), false);
});
