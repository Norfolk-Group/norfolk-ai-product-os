import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { generateCatalog } from "../../tools/generate-catalog/index.js";
import { generateHandbook } from "../../tools/generate-handbook/index.js";

const root = resolve(import.meta.dirname, "../..");

test("generated views distinguish unreleased source from the immutable prior candidate", async () => {
  const pkg = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
  const release = JSON.parse(await readFile(resolve(root, `releases/${pkg.version}/release.json`), "utf8"));
  assert.equal(release.version, pkg.version);
  for (const html of [(await generateHandbook(root)).html, (await generateCatalog(root)).html]) {
    assert.match(html, new RegExp(`unreleased canonical source after immutable ${pkg.version.replaceAll(".", "\\.")}`));
    assert.match(html, /new signed candidate required/);
    assert.doesNotMatch(html, new RegExp(`Product OS ${pkg.version.replaceAll(".", "\\.")}(?:\\s|·)`));
  }
});
