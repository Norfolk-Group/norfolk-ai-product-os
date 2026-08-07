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
  assert.equal(await readFile(resolve(root, "handbook/index.html"), "utf8"), first.html);
});
