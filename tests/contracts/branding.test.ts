import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { validateBrandProfile, validateMediaAssetWorkflow } from "../../tools/validate/design.js";

const root = resolve(import.meta.dirname, "../..");
const json = async (path: string) => JSON.parse(await readFile(resolve(root, path), "utf8"));

test("the canonical brand profile supports Norfolk and derived client identity without weakening the foundation", async () => {
  assert.deepEqual(validateBrandProfile(await json("design/brand-profile.example.json")), []);
});

test("Norfolk endorsement cannot be removed from a client-branded product", async () => {
  const profile = await json("design/brand-profile.example.json");
  profile.endorsement.removable = true;
  assert.ok(validateBrandProfile(profile).some((error) => error.includes("cannot be removable")));
});

test("official Norfolk visual assets remain deferred to Claude Design", async () => {
  const profile = await json("design/brand-profile.example.json");
  profile.norfolkMaster.visualAuthority = "invented-local-palette";
  assert.ok(validateBrandProfile(profile).some((error) => error.includes("Claude Design")));
});

test("the governed media workflow preserves originals, creates three choices, and fails closed on privacy", async () => {
  assert.deepEqual(validateMediaAssetWorkflow(await json("standards/media-asset-workflow.example.json")), []);
});

test("a portrait workflow cannot train on people or silently activate a generated likeness", async () => {
  const workflow = await json("standards/media-asset-workflow.example.json");
  workflow.portraits.modelTrainingAllowed = true;
  workflow.portraits.explicitSelectionRequired = false;
  const errors = validateMediaAssetWorkflow(workflow);
  assert.ok(errors.some((error) => error.includes("model training")));
  assert.ok(errors.some((error) => error.includes("explicit selection")));
});

test("property imagery cannot fabricate physical conditions", async () => {
  const workflow = await json("standards/media-asset-workflow.example.json");
  workflow.propertyImages.factualChangesAllowed = true;
  assert.ok(validateMediaAssetWorkflow(workflow).some((error) => error.includes("factual")));
});
