import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import test from "node:test";
import { buildCandidate } from "../../tools/release/build-candidate.js";
import { sha256 } from "../../tools/release/manifest.js";

const run = promisify(execFile);

async function fixtureRepository() {
  const root = await mkdtemp(join(tmpdir(), "norfolk-candidate-"));
  await mkdir(join(root, "design"), { recursive: true });
  await writeFile(join(root, "design/example.md"), "source revision\n");
  await run("git", ["init", "-q"], { cwd: root });
  await run("git", ["config", "user.email", "test@norfolk.invalid"], { cwd: root });
  await run("git", ["config", "user.name", "Norfolk Test"], { cwd: root });
  await run("git", ["add", "design/example.md"], { cwd: root });
  await run("git", ["commit", "-qm", "fixture source"], { cwd: root });
  const sourceCommit = (await run("git", ["rev-parse", "HEAD"], { cwd: root })).stdout.trim();
  return { root, sourceCommit };
}

test("candidate content is reconstructed from its declared source commit", async () => {
  const { root, sourceCommit } = await fixtureRepository();
  await writeFile(join(root, "design/example.md"), "uncommitted mutation\n");
  const result = await buildCandidate({ root, version: "0.3.0-candidate.9", createdAt: "2026-08-06T12:00:00.000Z", sourceCommit });
  const manifest = JSON.parse(await readFile(result.manifestPath, "utf8"));
  assert.equal(manifest.sourceCommit, sourceCommit);
  assert.equal(manifest.files[0].sha256, sha256("source revision\n"));
});

test("candidate versions are immutable once written", async () => {
  const { root, sourceCommit } = await fixtureRepository();
  const options = { root, version: "0.3.0-candidate.9", createdAt: "2026-08-06T12:00:00.000Z", sourceCommit };
  await buildCandidate(options);
  await assert.rejects(buildCandidate(options), /already exists/);
});
