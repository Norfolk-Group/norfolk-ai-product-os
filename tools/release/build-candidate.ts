import { execFileSync } from "node:child_process";
import { generateKeyPairSync } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { canonicalJson, sha256, signManifest, type ReleaseFile } from "./manifest.js";
import { isReleaseInputPath } from "./inputs.js";

type BuildCandidateOptions = { root: string; version: string; createdAt: string; sourceCommit: string };
type BuildCandidateResult = { directory: string; manifestPath: string; manifestSha256: string };

function gitText(root: string, args: string[]): string {
  return execFileSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
}

export async function buildCandidate(options: BuildCandidateOptions): Promise<BuildCandidateResult> {
  const { root, version, createdAt, sourceCommit } = options;
  gitText(root, ["cat-file", "-e", `${sourceCommit}^{commit}`]);
  const paths = gitText(root, ["ls-tree", "-r", "--name-only", sourceCommit]).split("\n").filter(isReleaseInputPath).sort();
  const files: ReleaseFile[] = paths.map((path) => ({
    path,
    sha256: sha256(execFileSync("git", ["show", `${sourceCommit}:${path}`], { cwd: root, maxBuffer: 64 * 1024 * 1024 })),
    sensitivity: "norfolk-only",
  }));
  const manifest = { schemaVersion: 1, version, status: "candidate", visibility: "private", sourceCommit, createdAt, minimumKitVersion: "0.1.0", files };
  const manifestSha256 = sha256(canonicalJson(manifest));
  const { privateKey, publicKey } = generateKeyPairSync("ed25519");
  const keyId = `local-candidate-${manifestSha256.slice(0, 16)}`;
  const bundle = signManifest(manifest, privateKey, keyId);
  const releases = resolve(root, "releases");
  const directory = resolve(releases, version);
  await mkdir(releases, { recursive: true });
  try { await mkdir(directory); } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") throw new Error(`release ${version} already exists and is immutable`);
    throw error;
  }
  const manifestPath = resolve(directory, "manifest.json");
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  await writeFile(resolve(directory, "signed-manifest.json"), `${JSON.stringify(bundle, null, 2)}\n`);
  await writeFile(resolve(directory, "candidate-public-key.pem"), publicKey.export({ type: "spki", format: "pem" }));
  await writeFile(resolve(directory, "release.json"), `${JSON.stringify({ version, status: "candidate", sourceCommit, manifestSha256, standards: paths.filter((path) => path.startsWith("standards/") && path.endsWith(".md")), createdAt, visibility: "private", signedBy: keyId, minimumKitVersion: "0.1.0" }, null, 2)}\n`);
  return { directory, manifestPath, manifestSha256 };
}

async function main(): Promise<void> {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
  const pkg = JSON.parse(await readFile(resolve(root, "package.json"), "utf8")) as { version: string };
  const sourceCommit = process.env.PRODUCT_OS_SOURCE_COMMIT ?? gitText(root, ["rev-parse", "HEAD"]).trim();
  const createdAt = process.env.PRODUCT_OS_RELEASE_CREATED_AT ?? new Date().toISOString();
  const result = await buildCandidate({ root, version: pkg.version, createdAt, sourceCommit });
  console.log(`built ${pkg.version} manifest ${result.manifestSha256}; local candidate key is integrity-only and not trusted for publication`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
