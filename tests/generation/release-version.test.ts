import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { generateCatalog } from "../../tools/generate-catalog/index.js";
import { generateHandbook } from "../../tools/generate-handbook/index.js";

const root = resolve(import.meta.dirname, "../..");

test("generated views identify the current signed candidate version", async () => {
  const pkg = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
  const release = JSON.parse(await readFile(resolve(root, `releases/${pkg.version}/release.json`), "utf8"));
  assert.equal(release.version, pkg.version);
  assert.match((await generateHandbook(root)).html, new RegExp(`Product OS ${pkg.version.replaceAll(".", "\\.")}`));
  assert.match((await generateCatalog(root)).html, new RegExp(`Product OS ${pkg.version.replaceAll(".", "\\.")}`));
});
