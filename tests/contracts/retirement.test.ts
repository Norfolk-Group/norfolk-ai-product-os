import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { destructiveActionAvailable, validateRetirementDossier } from "../../tools/validate/retirement.js";

const root = resolve(import.meta.dirname, "../..");
const json = async (path: string) => JSON.parse(await readFile(resolve(root, path), "utf8"));

test("Starter and Manual remain not ready and expose no destructive operation", async () => {
  for (const name of ["norfolk-starter", "norfolk-manual"]) {
    const dossier = await json(`retirement/${name}.json`);
    assert.deepEqual(validateRetirementDossier(dossier), []);
    assert.equal(destructiveActionAvailable(dossier), false);
    assert.equal(dossier.readiness, "not-ready");
    assert.equal(dossier.missingApproval, true);
  }
});

test("a ready claim fails when any preservation or recovery category is incomplete", async () => {
  const dossier = await json("retirement/norfolk-starter.json");
  dossier.readiness = "ready-for-exact-approval";
  assert.ok(validateRetirementDossier(dossier).length > 0);
});
