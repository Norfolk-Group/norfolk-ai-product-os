import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { generateCatalog } from "../../tools/generate-catalog/index.js";

const root = resolve(import.meta.dirname, "../..");

test("catalog generation is deterministic, offline, and exposes review controls", async () => {
  const first = await generateCatalog(root);
  const second = await generateCatalog(root);
  assert.equal(first.html, second.html);
  assert.equal(first.sha256, second.sha256);
  for (const label of ["Search", "Theme", "Reduced motion", "Approve", "Reject", "Defer", "Rationale", "Source path"]) assert.match(first.html, new RegExp(label));
  assert.doesNotMatch(first.html, /(?:src|href)=["']https?:|fetch\s*\(/i);
  assert.doesNotMatch(first.html, /validation\/(?:h-analytics|motion-lineage|report-output)\.md|PP-U11-|eeb05f9563b93f8842d2257eb7054555935f7e44/i);
  assert.equal(await readFile(resolve(root, "catalog/generated/index.html"), "utf8"), first.html);
});
