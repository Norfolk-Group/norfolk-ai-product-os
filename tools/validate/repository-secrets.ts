import { execFile, execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { promisify } from "node:util";
import { scanSecrets } from "./standards.js";

const run = promisify(execFile);
const plantedNegativeFixtures = new Set([
  "tests/contracts/secrets.test.ts",
  "tests/fixtures/migration/invalid-client-promotion.md",
]);

function isText(value: Buffer): boolean {
  return !value.subarray(0, 8_192).includes(0);
}

export async function scanRepositorySecrets(root: string, options: { history?: "--all" } = {}): Promise<string[]> {
  const errors: string[] = [];
  const tracked = await run("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], { cwd: root, encoding: "buffer" });
  for (const path of tracked.stdout.toString("utf8").split("\0").filter(Boolean)) {
    if (plantedNegativeFixtures.has(path)) continue;
    const body = await readFile(resolve(root, path));
    if (!isText(body)) continue;
    for (const error of scanSecrets(body.toString("utf8"), path.includes("fixture") ? "fixture" : path.includes("manifest") ? "manifest" : path.startsWith("handbook/") ? "handbook" : "source")) {
      errors.push(`${path}: ${error}`);
    }
  }
  if (options.history === "--all") {
    const objects = await run("git", ["rev-list", "--objects", "--all"], { cwd: root, maxBuffer: 64 * 1024 * 1024 });
    const seen = new Set<string>();
    for (const line of objects.stdout.split("\n")) {
      const separator = line.indexOf(" ");
      if (separator < 1) continue;
      const object = line.slice(0, separator);
      const path = line.slice(separator + 1);
      if (!path || plantedNegativeFixtures.has(path) || seen.has(object)) continue;
      seen.add(object);
      let body: Buffer;
      try {
        body = execFileSync("git", ["cat-file", "-p", object], {
          cwd: root,
          maxBuffer: 64 * 1024 * 1024,
        });
      } catch {
        continue;
      }
      if (!isText(body)) continue;
      if (scanSecrets(body.toString("utf8"), "source").length > 0) errors.push(`history:${path}: credential material detected in repository history`);
    }
  }
  return errors;
}
