import { execFileSync, spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { validateReleaseAuthorization, type ReleaseAuthorization } from "./authorization.js";

export interface ReleasePreflightState {
  authorization: ReleaseAuthorization;
  ref: string;
  headCommit: string;
  parentCommit: string;
  changedPaths: string[];
  candidateTagCommit: string;
  candidateRelease: Record<string, unknown>;
  targetTagExists: boolean;
  targetReleaseExists: boolean;
}

export function validateReleasePreflight(state: ReleasePreflightState): string[] {
  const errors = validateReleaseAuthorization(state.authorization);
  const expectedPath = `release-authorizations/${state.authorization.releaseVersion}.json`;
  if (state.ref !== "refs/heads/main") errors.push("release must run from refs/heads/main");
  if (state.parentCommit !== state.authorization.releaseWorkflowCommit) errors.push("authorization commit must directly follow the reviewed workflow commit");
  if (state.changedPaths.length !== 1 || state.changedPaths[0] !== expectedPath) errors.push(`authorization commit must change only ${expectedPath}`);
  if (state.candidateTagCommit !== state.authorization.candidateSourceCommit) errors.push("candidate source tag moved from its authorized commit");
  if (state.candidateRelease.version !== state.authorization.candidateVersion || state.candidateRelease.status !== "candidate" || state.candidateRelease.sourceCommit !== state.authorization.candidateSourceCommit || state.candidateRelease.manifestSha256 !== state.authorization.candidateManifestSha256) errors.push("candidate metadata does not match authorization");
  if (state.targetTagExists || state.targetReleaseExists) errors.push(`release ${state.authorization.releaseVersion} already exists`);
  return errors;
}

function git(root: string, args: string[]): string { return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim(); }

export async function discoverReleasePreflight(root: string, authorizationPath: string): Promise<ReleasePreflightState> {
  const authorization = JSON.parse(await readFile(resolve(root, authorizationPath), "utf8")) as ReleaseAuthorization;
  const headCommit = git(root, ["rev-parse", "HEAD"]);
  const tagResult = spawnSync("git", ["rev-parse", "--verify", `refs/tags/${authorization.releaseVersion}`], { cwd: root, encoding: "utf8" });
  const releaseResult = spawnSync("gh", ["release", "view", authorization.releaseVersion, "--repo", "Norfolk-Group/norfolk-ai-product-os"], { cwd: root, encoding: "utf8" });
  const candidateReleaseText = git(root, ["show", `internal-candidate-source/${authorization.candidateVersion}:releases/${authorization.candidateVersion}/release.json`]);
  return {
    authorization,
    ref: process.env.GITHUB_REF ?? `refs/heads/${git(root, ["branch", "--show-current"])}`,
    headCommit,
    parentCommit: git(root, ["rev-parse", "HEAD^"]),
    changedPaths: git(root, ["diff-tree", "--no-commit-id", "--name-only", "-r", "HEAD"]).split("\n").filter(Boolean),
    candidateTagCommit: git(root, ["rev-parse", `internal-candidate-source/${authorization.candidateVersion}^{commit}`]),
    candidateRelease: JSON.parse(candidateReleaseText),
    targetTagExists: tagResult.status === 0,
    targetReleaseExists: releaseResult.status === 0,
  };
}
