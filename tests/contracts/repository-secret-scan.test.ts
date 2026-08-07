import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import test from "node:test";
import { scanRepositorySecrets } from "../../tools/validate/repository-secrets.js";

const run = promisify(execFile);

async function repository() {
  const root = await mkdtemp(join(tmpdir(), "norfolk-secrets-"));
  await mkdir(join(root, "tools"), { recursive: true });
  await run("git", ["init", "-q"], { cwd: root });
  await run("git", ["config", "user.email", "test@norfolk.invalid"], { cwd: root });
  await run("git", ["config", "user.name", "Norfolk Test"], { cwd: root });
  return root;
}

test("repository scan covers tracked source files", async () => {
  const root = await repository();
  const planted = ["sk", "live", "1234567890abcdef"].join("_");
  await writeFile(join(root, "tools/config.ts"), `export const key = '${planted}';\n`);
  await run("git", ["add", "tools/config.ts"], { cwd: root });
  await run("git", ["commit", "-qm", "add source"], { cwd: root });
  assert.ok((await scanRepositorySecrets(root)).some((error) => error.includes("tools/config.ts")));
});

test("repository scan catches credentials removed later in the branch history", async () => {
  const root = await repository();
  const planted = `${["SECRET", "KEY"].join("_")}=abcdefghijklmnop\n`;
  await writeFile(join(root, "config.txt"), planted);
  await run("git", ["add", "config.txt"], { cwd: root });
  await run("git", ["commit", "-qm", "introduce secret"], { cwd: root });
  await writeFile(join(root, "config.txt"), "SECRET_KEY=redacted\n");
  await run("git", ["add", "config.txt"], { cwd: root });
  await run("git", ["commit", "-qm", "remove secret"], { cwd: root });
  assert.ok((await scanRepositorySecrets(root, { history: "--all" })).some((error) => error.includes("history")));
});
