# Trusted Private Product OS Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fail-closed, GitHub Team-compatible path that can validate and sign an authorized private Product OS release while separately diagnosing WorkOS and R2 readiness and preserving the Manual audit evidence.

**Architecture:** A committed authorization record binds one immutable candidate to one reviewed release-workflow commit. Pure TypeScript validators and builders enforce the trust contract; thin CLI adapters discover Git and GitHub state. Manual GitHub Actions workflows use protected `main`, a main-only environment, Doppler OIDC, temporary R2 credentials, and explicit confirmation. No workflow is run and no release is published in this implementation PR.

**Tech Stack:** Node.js 24, TypeScript 5.9, Node test runner, Ajv, YAML 2.9.0, aws4fetch 1.0.20, GitHub Actions, Doppler OIDC, WorkOS CLI 0.21.0, Cloudflare R2 temporary credentials API.

## Global Constraints

- Work only on `feat/trusted-release-readiness`; never write directly to `main`.
- Candidate `0.3.0-candidate.4` remains immutable and unpublished.
- No code, test, fixture, log, artifact, or commit may contain a real private key, provider credential, signed URL, or client identifier.
- Every new behavior follows red-green-refactor and exercises real local behavior; only external network calls may be injected.
- The trusted builder writes only to a new caller-provided temporary directory and never mutates `releases/`.
- Release publication requires a later exact approval and a separate authorization record PR.
- `norfolk-manual` remains untouched; this plan records evidence and missing preservation gates only.
- Official Norfolk visual assets remain deferred and are not a release-readiness blocker.
- GitHub Team private repositories cannot enforce environment reviewers or private artifact attestations; do not reference either as an active control.

## File map

- `schemas/release-authorization.schema.json`: structural contract for human release authorization.
- `release-authorizations/README.md`: immutable-record lifecycle and review instructions; no live authorization is created here.
- `tools/release/authorization.ts`: semantic authorization validation.
- `tools/release/preflight.ts`: Git/GitHub state preflight with an injectable release lookup boundary.
- `tools/release/trusted.ts`: deterministic trusted release directory builder and verifier.
- `tools/release/build-trusted.ts`: CLI adapter for the builder.
- `tools/release/run-preflight.ts`: CLI adapter for repository and GitHub discovery.
- `tools/readiness/workos.ts`: redacted WorkOS structural/doctor result handling.
- `tools/readiness/r2.ts`: temporary credential acquisition and scoped object diagnostic.
- `tools/readiness/run-workos.ts`, `tools/readiness/run-r2.ts`: provider CLI adapters.
- `tools/validate/workflows.ts`: semantic validation for release and readiness workflow YAML.
- `.github/workflows/trusted-private-release.yml`: manual private publication workflow, intentionally unusable until trust material is configured.
- `.github/workflows/provider-readiness.yml`: manual WorkOS/R2 diagnostic workflow.
- `tests/contracts/trusted-release.test.ts`: authorization, preflight, builder, tamper, and immutability behavior.
- `tests/contracts/provider-readiness.test.ts`: WorkOS and R2 fail-closed behavior.
- `tests/contracts/workflows.test.ts`: parsed workflow security behavior.
- `validation/norfolk-manual.md`: pinned private MCP audit.
- `retirement/norfolk-manual.{md,json}`: preservation and deletion-readiness evidence.
- `validation/release-readiness.md`: merged foundation state and exact remaining configuration gates.
- `trust/README.md`: key ceremony and committed-public-key requirements; no key generated in this plan.

---

### Task 1: Release authorization contract

**Files:**
- Create: `schemas/release-authorization.schema.json`
- Create: `release-authorizations/README.md`
- Create: `tools/release/authorization.ts`
- Create: `tests/contracts/trusted-release.test.ts`
- Modify: `tests/schemas/schema-validation.test.ts`
- Modify: `tools/validate/index.ts`
- Modify: `docs/README.md`

**Interfaces:**
- Produces: `ReleaseAuthorization` and `validateReleaseAuthorization(value: unknown): string[]`.
- `ReleaseAuthorization` fields are `schemaVersion`, `releaseVersion`, `candidateVersion`, `candidateSourceCommit`, `candidateManifestSha256`, `releaseWorkflowCommit`, `approver`, `approvedAt`, `scope`, `confirmation`, `trustedKeyId`.
- Later tasks consume the validated record without adding defaults.

- [ ] **Step 1: Write the failing authorization tests**

Add these cases to `tests/contracts/trusted-release.test.ts`:

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { validateReleaseAuthorization } from "../../tools/release/authorization.js";

const validAuthorization = {
  schemaVersion: 1,
  releaseVersion: "0.3.0",
  candidateVersion: "0.3.0-candidate.4",
  candidateSourceCommit: "b".repeat(40),
  candidateManifestSha256: "6".repeat(64),
  releaseWorkflowCommit: "a".repeat(40),
  approver: "ricardo-cidale-personal",
  approvedAt: "2026-08-07T22:00:00.000Z",
  scope: "private-github-release",
  confirmation: "publish-private-release",
  trustedKeyId: "norfolk-product-os-release-2026-01",
};

test("a complete private release authorization is accepted", () => {
  assert.deepEqual(validateReleaseAuthorization(validAuthorization), []);
});

test("a candidate cannot authorize itself as a published version", () => {
  assert.ok(validateReleaseAuthorization({ ...validAuthorization, releaseVersion: "0.3.0-candidate.4" }).length > 0);
});

test("authorization fails closed on ambiguous scope, confirmation, commit, or hash", () => {
  const invalid = { ...validAuthorization, scope: "public", confirmation: "yes", releaseWorkflowCommit: "main", candidateManifestSha256: "unknown" };
  assert.ok(validateReleaseAuthorization(invalid).length >= 4);
});
```

- [ ] **Step 2: Run the test and confirm RED**

Run: `node --import tsx --test tests/contracts/trusted-release.test.ts`

Expected: FAIL because `tools/release/authorization.ts` does not exist.

- [ ] **Step 3: Implement the minimal authorization validator and schema**

Create the exported interface and validate exact literals, release SemVer `^0\\.\\d+\\.\\d+$`, candidate pattern `^0\\.\\d+\\.\\d+-candidate\\.\\d+$`, 40-character lowercase Git SHAs, 64-character lowercase SHA-256 values, a valid ISO timestamp, non-empty approver/key ID, and exact scope/confirmation values. The JSON Schema must enforce the same fields with `additionalProperties: false`.

Add the schema to the existing schema-compilation test and validate every JSON file under `release-authorizations/` except no record is created in this task. Index `release-authorizations/README.md` in `docs/README.md` without marking it as an accepted authorization.

- [ ] **Step 4: Run focused and schema tests and confirm GREEN**

Run: `node --import tsx --test tests/contracts/trusted-release.test.ts tests/schemas/schema-validation.test.ts`

Expected: all authorization cases and all published schema compilation cases pass.

- [ ] **Step 5: Commit Task 1**

```bash
git add schemas/release-authorization.schema.json release-authorizations/README.md tools/release/authorization.ts tests/contracts/trusted-release.test.ts tests/schemas/schema-validation.test.ts tools/validate/index.ts docs/README.md
git commit -m "feat(release): govern private publication authorization"
```

### Task 2: Repository preflight

**Files:**
- Create: `tools/release/preflight.ts`
- Create: `tools/release/run-preflight.ts`
- Modify: `tests/contracts/trusted-release.test.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `ReleaseAuthorization` and `validateReleaseAuthorization` from Task 1.
- Produces: `ReleasePreflightState`, `validateReleasePreflight(state: ReleasePreflightState): string[]`, and `discoverReleasePreflight(root: string, authorizationPath: string): Promise<ReleasePreflightState>`.
- `ReleasePreflightState` includes `authorization`, `ref`, `headCommit`, `parentCommit`, `changedPaths`, `candidateTagCommit`, `candidateRelease`, `targetTagExists`, and `targetReleaseExists`.

- [ ] **Step 1: Add failing preflight behavior tests**

```ts
test("preflight accepts an authorization-only main commit over the reviewed workflow commit", () => {
  const state = {
    authorization: validAuthorization,
    ref: "refs/heads/main",
    headCommit: "c".repeat(40),
    parentCommit: validAuthorization.releaseWorkflowCommit,
    changedPaths: ["release-authorizations/0.3.0.json"],
    candidateTagCommit: validAuthorization.candidateSourceCommit,
    candidateRelease: { version: validAuthorization.candidateVersion, sourceCommit: validAuthorization.candidateSourceCommit, manifestSha256: validAuthorization.candidateManifestSha256, status: "candidate" },
    targetTagExists: false,
    targetReleaseExists: false,
  };
  assert.deepEqual(validateReleasePreflight(state), []);
});

test("preflight rejects another changed file, an existing version, or a moved candidate tag", () => {
  const errors = validateReleasePreflight({ ...validState, changedPaths: ["release-authorizations/0.3.0.json", "standards/security.md"], candidateTagCommit: "d".repeat(40), targetReleaseExists: true });
  assert.ok(errors.some((error) => error.includes("authorization commit")));
  assert.ok(errors.some((error) => error.includes("candidate source tag")));
  assert.ok(errors.some((error) => error.includes("already exists")));
});
```

- [ ] **Step 2: Run and confirm RED**

Run: `node --import tsx --test tests/contracts/trusted-release.test.ts`

Expected: FAIL because preflight exports are missing.

- [ ] **Step 3: Implement preflight core and CLI adapter**

`validateReleasePreflight` must be pure. `discoverReleasePreflight` may call `git rev-parse`, `git diff-tree`, and `gh release view`; it must capture exit codes without echoing command environments. It resolves `internal-candidate-source/<candidateVersion>` and reads the committed candidate `release.json`. Reject detached refs, branches other than `main`, non-authorization changes, wrong parent, wrong source tag, mismatched candidate metadata, or an existing release/tag.

Add `release:preflight` to `package.json` as `tsx tools/release/run-preflight.ts`.

- [ ] **Step 4: Run focused tests and confirm GREEN**

Run: `node --import tsx --test tests/contracts/trusted-release.test.ts`

Expected: authorization and preflight cases pass.

- [ ] **Step 5: Commit Task 2**

```bash
git add tools/release/preflight.ts tools/release/run-preflight.ts tests/contracts/trusted-release.test.ts package.json
git commit -m "feat(release): fail closed before trusted signing"
```

### Task 3: Trusted release builder and verifier

**Files:**
- Create: `tools/release/trusted.ts`
- Create: `tools/release/build-trusted.ts`
- Create: `trust/README.md`
- Modify: `tests/contracts/trusted-release.test.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: validated authorization and candidate metadata.
- Produces: `buildTrustedRelease(options: TrustedReleaseOptions): Promise<TrustedReleaseResult>` and `verifyTrustedRelease(directory: string, publicKeyPem: string): Promise<string[]>`.
- `TrustedReleaseOptions` contains `root`, `authorization`, `outputDirectory`, `privateKeyPem`, `publicKeyPem`, and `createdAt`.
- `TrustedReleaseResult` contains `directory`, `manifestSha256`, `publicKeySha256`, and sorted `assetPaths`.

- [ ] **Step 1: Add failing builder, tamper, and immutability tests**

Generate Ed25519 keys in test memory with `generateKeyPairSync("ed25519")`; never write the private key outside the temporary test directory.

```ts
test("trusted build signs reconstructed candidate content without mutating candidates", async () => {
  const before = await hashDirectory(resolve(root, "releases", validAuthorization.candidateVersion));
  const result = await buildTrustedRelease({ root, authorization: validAuthorization, outputDirectory, privateKeyPem, publicKeyPem, createdAt: "2026-08-07T22:30:00.000Z" });
  assert.deepEqual(await verifyTrustedRelease(result.directory, publicKeyPem), []);
  assert.equal(await hashDirectory(resolve(root, "releases", validAuthorization.candidateVersion)), before);
});

test("trusted verification detects payload, signature, and public-key substitution", async () => {
  await writeFile(join(result.directory, "payload", "standards", "security.md"), "tampered\n");
  assert.ok((await verifyTrustedRelease(result.directory, publicKeyPem)).some((error) => error.includes("content hash")));
  assert.ok((await verifyTrustedRelease(cleanDirectory, otherPublicKeyPem)).some((error) => error.includes("trusted key")));
});
```

- [ ] **Step 2: Run and confirm RED**

Run: `node --import tsx --test tests/contracts/trusted-release.test.ts`

Expected: FAIL because the trusted builder and verifier do not exist.

- [ ] **Step 3: Implement deterministic directory construction**

Reuse `canonicalJson`, `sha256`, `signManifest`, and `verifyManifest` from `tools/release/manifest.ts`. Reconstruct every candidate-manifest path with `git show <sourceCommit>:<path>` into `payload/<path>`. Write:

- `manifest.json` with released version/status, candidate provenance, authorization hash, public-key hash, source commit, fixed creation time, and sorted file records;
- `signed-manifest.json` using the authorization key ID;
- `release.json` with private visibility and release/candidate identities;
- `release-authorization.json` as the exact canonical record;
- `trusted-public-key.pem` matching the committed future key;
- `checksums.sha256` with sorted hashes for every file except itself.

Refuse an existing output path, candidate status other than `candidate`, candidate-key reuse, key-ID mismatch, public/private key mismatch, non-empty verification result, or any path traversal. Add `release:trusted` to `package.json`.

`trust/README.md` must state that `trust/product-os-release-public-key.pem` is added only through a reviewed key ceremony and that absence intentionally blocks publication.

- [ ] **Step 4: Run focused tests and confirm GREEN**

Run: `node --import tsx --test tests/contracts/trusted-release.test.ts`

Expected: all authorization, preflight, build, verification, tamper, and immutability cases pass.

- [ ] **Step 5: Commit Task 3**

```bash
git add tools/release/trusted.ts tools/release/build-trusted.ts trust/README.md tests/contracts/trusted-release.test.ts package.json
git commit -m "feat(release): build and verify trusted private bundles"
```

### Task 4: Provider readiness diagnostics

**Files:**
- Create: `tools/readiness/workos.ts`
- Create: `tools/readiness/r2.ts`
- Create: `tools/readiness/run-workos.ts`
- Create: `tools/readiness/run-r2.ts`
- Create: `tests/contracts/provider-readiness.test.ts`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Produces: `validateWorkOSReadinessEnvironment(environment: NodeJS.ProcessEnv): string[]`.
- Produces: `redactDiagnosticOutput(value: string): string`.
- Produces: `requestTemporaryR2Credentials(input: R2CredentialRequest, fetcher?: typeof fetch): Promise<R2TemporaryCredentials>`.
- Produces: `runR2Diagnostic(input: R2DiagnosticInput): Promise<R2DiagnosticEvidence>` where external fetch is injected only at the HTTP boundary.

- [ ] **Step 1: Add failing WorkOS and R2 tests**

```ts
test("WorkOS readiness requires staging values and redacts credential-shaped output", () => {
  assert.deepEqual(validateWorkOSReadinessEnvironment({}), ["missing WORKOS_API_KEY", "missing WORKOS_CLIENT_ID", "missing WORKOS_REDIRECT_URI", "WORKOS_ENVIRONMENT must be staging"]);
  assert.equal(redactDiagnosticOutput("api key sk_test_secret and code=abc123"), "api key [REDACTED] and code=[REDACTED]");
});

test("R2 requests fifteen-minute read-write credentials for one diagnostic prefix", async () => {
  const observed: unknown[] = [];
  const credentials = await requestTemporaryR2Credentials(validR2Request, async (_url, init) => {
    observed.push(JSON.parse(String(init?.body)));
    return new Response(JSON.stringify({ success: true, errors: [], messages: [], result: { accessKeyId: "temporary", secretAccessKey: "secret", sessionToken: "session" } }), { status: 200 });
  });
  assert.deepEqual(observed, [{ bucket: "norfolk-product-os", parentAccessKeyId: "parent", permission: "object-read-write", ttlSeconds: 900, paths: { prefixPaths: ["diagnostics/product-os/"] } }]);
  assert.equal(credentials.sessionToken, "session");
});

test("R2 diagnostic refuses a key outside its authorized prefix", async () => {
  await assert.rejects(() => runR2Diagnostic({ ...validDiagnostic, objectKey: "other/object.txt" }), /authorized diagnostic prefix/);
});
```

- [ ] **Step 2: Run and confirm RED**

Run: `node --import tsx --test tests/contracts/provider-readiness.test.ts`

Expected: FAIL because readiness modules do not exist.

- [ ] **Step 3: Implement minimal diagnostic modules**

Add exact dev dependencies `aws4fetch@1.0.20`; use built-in `fetch` for the Cloudflare temporary credential endpoint and `AwsClient` only for S3-compatible object requests. The R2 diagnostic must PUT a generated small payload, HEAD it, GET and compare SHA-256, DELETE it, then require a missing result. Evidence contains provider status, bucket hash, object-key hash, checksum, start/end times, and deletion confirmation—never the raw bucket, key, endpoint, or credentials.

The WorkOS adapter validates staging-only environment, runs `npx --yes workos@0.21.0 doctor`, captures output, redacts tokens/codes/cookies/URLs with query values, and writes only a redacted JSON result. It must not run `workos install`, `seed`, or any CRUD command.

Add `readiness:workos` and `readiness:r2` package scripts.

- [ ] **Step 4: Run focused tests and confirm GREEN**

Run: `node --import tsx --test tests/contracts/provider-readiness.test.ts`

Expected: all missing-configuration, redaction, temporary-scope, prefix, checksum, and deletion cases pass.

- [ ] **Step 5: Commit Task 4**

```bash
git add tools/readiness/workos.ts tools/readiness/r2.ts tools/readiness/run-workos.ts tools/readiness/run-r2.ts tests/contracts/provider-readiness.test.ts package.json pnpm-lock.yaml
git commit -m "feat(readiness): diagnose WorkOS and scoped R2 access"
```

### Task 5: Workflow security contracts and draft workflows

**Files:**
- Create: `.github/workflows/trusted-private-release.yml`
- Create: `.github/workflows/provider-readiness.yml`
- Create: `tools/validate/workflows.ts`
- Create: `tests/contracts/workflows.test.ts`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `tools/validate/index.ts`
- Modify: `.github/workflows/quality.yml`

**Interfaces:**
- Produces: `validateTrustedReleaseWorkflow(value: unknown): string[]`.
- Produces: `validateProviderReadinessWorkflow(value: unknown): string[]`.
- Tests parse YAML with `YAML.parse` and validate runtime policy rather than matching source lines.

- [ ] **Step 1: Add failing parsed-workflow tests**

```ts
test("trusted release workflow enforces manual main-only OIDC publication", async () => {
  const workflow = YAML.parse(await readFile(resolve(root, ".github/workflows/trusted-private-release.yml"), "utf8"));
  assert.deepEqual(validateTrustedReleaseWorkflow(workflow), []);
});

test("release workflow validator rejects write permission before the protected release job", () => {
  const invalid = structuredClone(validWorkflow);
  invalid.jobs.preflight.permissions.contents = "write";
  assert.ok(validateTrustedReleaseWorkflow(invalid).some((error) => error.includes("preflight must be read-only")));
});
```

- [ ] **Step 2: Run and confirm RED**

Run: `node --import tsx --test tests/contracts/workflows.test.ts`

Expected: FAIL because workflows and validators do not exist.

- [ ] **Step 3: Implement validators and workflows**

Add exact dev dependency `yaml@2.9.0`. The trusted workflow must:

- expose only `workflow_dispatch` with `release_version`, `authorization_path`, and exact confirmation inputs;
- set `concurrency.group: product-os-private-release` and `cancel-in-progress: false`;
- run preflight with `contents: read`, full-history checkout, Node 24, pnpm 11.15.1, full verification, authorization preflight, and no secrets;
- run release only after preflight, on `refs/heads/main`, in `product-os-release`, with `contents: write` and `id-token: write` only;
- use `dopplerhq/secrets-fetch-action@v2.0.0` with OIDC and the three environment variables from the design;
- fail if `trust/product-os-release-public-key.pem` is absent;
- build into `mktemp -d`, verify, create a deterministic GNU tar archive, upload it with `actions/upload-artifact@v7`, and create the GitHub release with `gh release create` only after validation;
- download the just-created assets to a second temporary directory and re-verify them;
- never delete or overwrite a release on failure.

The provider workflow uses the same environment/OIDC boundary, offers explicit `workos` or `r2` diagnostic selection, and never has `contents: write`.

Update `quality.yml` to current action majors `actions/checkout@v7`, `actions/setup-node@v7`, and `pnpm/action-setup@v6`, and make `tools/validate/index.ts` validate both workflows. Workflow tests must prove permission, environment, confirmation, OIDC, concurrency, branch, and dependency ordering.

- [ ] **Step 4: Run focused and repository validation and confirm GREEN**

Run: `node --import tsx --test tests/contracts/workflows.test.ts && pnpm validate`

Expected: both workflows pass semantic validation; permission mutations fail in tests.

- [ ] **Step 5: Commit Task 5**

```bash
git add .github/workflows/trusted-private-release.yml .github/workflows/provider-readiness.yml .github/workflows/quality.yml tools/validate/workflows.ts tests/contracts/workflows.test.ts tools/validate/index.ts package.json pnpm-lock.yaml
git commit -m "ci(release): gate private publication through OIDC"
```

### Task 6: Manual audit and readiness evidence

**Files:**
- Create: `validation/norfolk-manual.md`
- Modify: `retirement/norfolk-manual.md`
- Modify: `retirement/norfolk-manual.json`
- Modify: `validation/release-readiness.md`
- Modify: `migration/source-register.md`
- Modify: `docs/README.md`
- Modify: `tests/contracts/retirement.test.ts`

**Interfaces:**
- Consumes the pinned MCP evidence already recorded in the approved design.
- Produces no destructive action. The dossier remains `not-ready` and `missingApproval: true`.

- [ ] **Step 1: Add the failing retirement-evidence test**

```ts
test("Manual records every observed branch and remains blocked on restoration and consumers", async () => {
  const dossier = await json("retirement/norfolk-manual.json");
  assert.deepEqual(dossier.branches.githubMcpObserved.sort(), ["deletions/animation-library", "main", "test/kit-guard-proof"]);
  assert.equal(dossier.recoveryTest.safeTargetRestore, false);
  assert.equal(dossier.consumers.complete, false);
  assert.equal(destructiveActionAvailable(dossier), false);
});
```

- [ ] **Step 2: Run and confirm RED**

Run: `node --import tsx --test tests/contracts/retirement.test.ts`

Expected: FAIL because the current dossier does not contain all three observed branches.

- [ ] **Step 3: Record the pinned audit without promoting stale content**

`validation/norfolk-manual.md` must record repository metadata, source commit `b397f6e3d5e00d2be9ee608356f892daaca8dcd2`, three branches, the aspirational renderer README, skeleton CONTRACT files, duplicated July Kit payload, H+ animation coupling, and the deletion branch's exact purpose. State that no unique current doctrine was found and that the evidence is Norfolk-only.

Update the dossier's missing items to require all-ref bundle, metadata/settings export, dependency/consumer proof, safe-target restoration, and successor links. Keep deletion unavailable. Update release readiness to say Product OS and Kit PRs merged, trusted release code is under review, WorkOS/R2 variables are absent, and Manual remains blocked. Index the evidence.

- [ ] **Step 4: Run retirement and validation tests and confirm GREEN**

Run: `node --import tsx --test tests/contracts/retirement.test.ts tests/contracts/validation.test.ts && pnpm validate`

Expected: evidence validates, Manual remains not ready, and no destructive action is exposed.

- [ ] **Step 5: Commit Task 6**

```bash
git add validation/norfolk-manual.md retirement/norfolk-manual.md retirement/norfolk-manual.json validation/release-readiness.md migration/source-register.md docs/README.md tests/contracts/retirement.test.ts
git commit -m "docs(retirement): complete Manual content audit"
```

### Task 7: GitHub environment configuration and full verification

**Files:**
- Modify only if generated output changes: `handbook/index.html`, `catalog/generated/index.html`
- External non-secret configuration: GitHub environment `product-os-release` with custom deployment branch policy `main`.

**Interfaces:**
- Consumes the workflows from Task 5.
- Produces a main-only environment with no secrets and no variables; absence keeps both workflows fail-closed.

- [ ] **Step 1: Create the empty protected environment**

Run:

```bash
gh api --method PUT repos/Norfolk-Group/norfolk-ai-product-os/environments/product-os-release \
  -f wait_timer=0 -F prevent_self_review=false \
  -F 'deployment_branch_policy[protected_branches]=false' \
  -F 'deployment_branch_policy[custom_branch_policies]=true'
gh api --method POST repos/Norfolk-Group/norfolk-ai-product-os/environments/product-os-release/deployment-branch-policies -f name=main -f type=branch
```

If the branch policy already exists, fetch it and verify its exact `main` pattern rather than retrying mutation. Do not add guessed Doppler variables or any secret.

- [ ] **Step 2: Verify external configuration without secret values**

Run:

```bash
gh api repos/Norfolk-Group/norfolk-ai-product-os/environments/product-os-release
gh api repos/Norfolk-Group/norfolk-ai-product-os/environments/product-os-release/deployment-branch-policies
gh variable list --env product-os-release --repo Norfolk-Group/norfolk-ai-product-os
gh secret list --env product-os-release --repo Norfolk-Group/norfolk-ai-product-os
```

Expected: environment exists, only `main` is allowed, and variable/secret lists are empty.

- [ ] **Step 3: Run complete local verification**

Run:

```bash
pnpm test
pnpm typecheck
pnpm validate
pnpm generate
git diff --check
git status --short --branch
```

Expected: all tests pass, 0 type or validation errors, generation is deterministic, no whitespace errors, and only intended generated files remain modified.

- [ ] **Step 4: Commit deterministic generated output if changed**

```bash
git add handbook/index.html catalog/generated/index.html
git diff --cached --quiet || git commit -m "docs: refresh release-readiness views"
```

- [ ] **Step 5: Re-run complete verification after the final commit**

Run the same commands from Step 3 and require a clean worktree.

### Task 8: Publish the implementation branch for review

**Files:** none beyond prior tasks.

**Interfaces:**
- Produces a draft PR only; it does not run the manual release or provider workflows.

- [ ] **Step 1: Inspect scope and commit history**

Run: `git status --short --branch && git log --oneline origin/main..HEAD && git diff --stat origin/main...HEAD`

Expected: clean branch with only the design, plan, tested implementation, workflows, evidence, and generated views.

- [ ] **Step 2: Push without force**

Run: `git push -u origin feat/trusted-release-readiness`

Expected: remote branch advances normally.

- [ ] **Step 3: Open a draft PR**

The PR body must state:

- what the release workflow enforces;
- that GitHub Team limitations are handled explicitly;
- exact local test counts and validation result;
- that `product-os-release` exists but contains no variables or secrets;
- that Doppler identity, signing key ceremony, WorkOS staging login, and R2 parent credential remain configuration gates;
- that no release was published and Manual was neither changed nor deleted.

- [ ] **Step 4: Wait for GitHub quality checks**

Run: `gh pr checks --watch --fail-fast`

Expected: all branch checks pass. Keep the PR draft; merging is a separate user decision.

- [ ] **Step 5: Report exact next approvals**

Report the PR URL and request only these future decisions when their prerequisites exist:

1. approve/merge the trusted-release implementation PR;
2. configure Doppler OIDC identifiers and complete the signing-key ceremony in a separate reviewed change;
3. run WorkOS staging and R2 diagnostics;
4. create and approve `release-authorizations/0.3.0.json`;
5. explicitly authorize private release publication;
6. after complete Manual preservation/recovery evidence, separately authorize or reject deletion of `Norfolk-Group/norfolk-manual`.
