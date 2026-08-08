import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { generateHandbook } from "../../tools/generate-handbook/index.js";

const root = resolve(import.meta.dirname, "../..");

test("handbook generation is deterministic, private, self-contained, and traceable", async () => {
  const first = await generateHandbook(root);
  const second = await generateHandbook(root);
  assert.equal(first.html, second.html);
  assert.equal(first.sha256, second.sha256);
  assert.match(first.html, /Private Norfolk AI standard/);
  assert.match(first.html, /source-sha256/);
  assert.doesNotMatch(first.html, /(?:src|href)=["']https?:|fetch\s*\(/i);
  assert.doesNotMatch(first.html, /validation\/(?:h-analytics|motion-lineage|report-output)\.md|PP-U11-|eeb05f9563b93f8842d2257eb7054555935f7e44/i);
  assert.doesNotMatch(first.html, /KIT Capital|H-Analytics|H\+ Analytics|H\+ family|RebeccaAdvancedOrbit|AnalystCube|Figma Make|_replit-export/i);
  for (const blockedLineage of [
    "H-Analytics preserves the best known complete production behavior",
    "Original local Figma, Replit, H-Analytics, and Kit sources",
    "Figma Make, Replit exports, H-Analytics production behavior, and Kit copies",
    "Treating Figma, Replit, H-Analytics, or Kit motion",
  ]) assert.doesNotMatch(first.html, new RegExp(blockedLineage), blockedLineage);
  assert.equal(await readFile(resolve(root, "handbook/index.html"), "utf8"), first.html);
});
