# Trusted private Product OS release design

Date: 2026-08-07

Owner: Product OS Owner

Status: approved design, implementation pending

Scope: trusted private Product OS release readiness, WorkOS/R2 diagnostics, and Manual disposition evidence

## Outcome

Norfolk AI can turn an immutable Product OS candidate into a private release only through a manually initiated, fail-closed workflow on protected `main`. The workflow proves candidate identity and repository state, requires a committed release authorization, obtains secrets through short-lived Doppler OIDC access, signs the canonical release manifest, validates the complete bundle, and creates a private GitHub release. It never publishes automatically after merge.

This design fits the current GitHub Team plan. It does not rely on private-repository environment reviewers or private artifact attestations, which the current plan does not provide. Those features may be added after a future GitHub Enterprise upgrade without weakening the controls below.

## Current evidence and constraints

- `main` is protected, requires linear history and conversation resolution, enforces protection for administrators, and blocks force pushes and deletion.
- The repository currently has no Actions environment, secret names, or variable names configured for release, WorkOS, R2, or Doppler.
- Candidate `0.3.0-candidate.4` is integrity-signed but explicitly untrusted for publication.
- Immutable internal tags retain each candidate source commit despite the repository's required squash-merge policy.
- WorkOS staging and production are distinct; live dashboard configuration and end-to-end staging login have not been verified.
- R2 supports short-lived, action- and path-scoped temporary credentials derived from a protected parent credential.
- Doppler service-account OIDC avoids a durable Doppler token but requires a compatible Doppler subscription and a configured service identity.
- Official Norfolk visual assets remain explicitly deferred; neutral semantic placeholders make that deferral non-blocking.

## Trust model

The release is trusted only when all of these independent facts are true:

1. The workflow runs from `refs/heads/main` at the authorization commit. That commit changes only the named authorization record, and its first parent is the reviewed release-workflow commit named by the record.
2. A committed authorization record names the release version, candidate version, candidate source commit, candidate manifest hash, reviewed release-workflow commit, approver, approval time, and exact publication scope.
3. The candidate source commit is retained by its expected immutable internal tag.
4. The candidate signature and every candidate content hash verify before transformation.
5. Repository tests, typecheck, semantic validation, generation determinism, secret/history scan, and clean-tree checks pass in the workflow.
6. GitHub OIDC authenticates to one release-scoped Doppler service-account identity.
7. Doppler returns only the release signing material and the provider credentials needed for the selected diagnostic or publication stage.
8. The trusted Ed25519 public key committed in the repository verifies the new signature.
9. The release version and GitHub release/tag do not already exist.
10. The generated release bundle reproduces from the declared candidate source commit and contains no unmanifested file.

Unknown configuration, missing evidence, mismatched identity, unavailable provider, existing version, or partial output stops before GitHub release creation.

## Components

### Release authorization record

Each publication requires `release-authorizations/<version>.json`, validated by a new schema and semantic validator. It is immutable after merge. It contains no credentials and cannot use a candidate version as the public release version.

The authorization record is the durable human approval compatible with the current single-seat GitHub Team plan. Its `releaseWorkflowCommit` is known before the authorization PR and avoids a circular attempt to predict the PR's squash-merge commit. A manual workflow dispatch is necessary but insufficient; the workflow must match every authorization field exactly, verify that the authorization commit's first parent is `releaseWorkflowCommit`, and reject any additional file change in the authorization commit.

### Trusted release builder

A Node/TypeScript builder accepts an authorization record and an injected Ed25519 private key. It:

- reads candidate metadata from the candidate directory;
- reconstructs all governed files from the candidate source commit;
- changes only release-specific metadata: public version, `released` status, creation time, authorization identity, and trusted key ID;
- writes a new manifest, signed manifest, release metadata, public key fingerprint, checksum file, and complete private bundle into a temporary output directory;
- verifies its own signature, manifest hash, file hashes, source tag, and bundle membership before returning success;
- refuses to write into committed candidate directories or overwrite any output.

The builder never logs private-key material, provider credentials, signed URLs, or raw secrets.

### GitHub Actions workflow

`trusted-private-release.yml` uses `workflow_dispatch` and requires the release version plus exact confirmation text. It has two jobs:

1. **Preflight:** read-only permissions, full-history checkout, authorization and candidate validation, dependency installation, full repository verification, source-tag verification, and existing-release rejection.
2. **Release:** depends on preflight, references the main-only `product-os-release` environment, requests `id-token: write`, exchanges GitHub OIDC for short-lived Doppler access, builds and verifies the trusted bundle, uploads a workflow artifact for inspection, then creates the private GitHub release and immutable release tag only after all prior steps pass.

Concurrency permits one Product OS publication at a time and never cancels an active publication. The workflow uses the GitHub-provided short-lived repository token only for the final release write.

### Doppler identity and secret surface

The GitHub environment stores only non-secret identifiers:

- `DOPPLER_SERVICE_IDENTITY_ID`
- `DOPPLER_RELEASE_PROJECT`
- `DOPPLER_RELEASE_CONFIG`

Doppler owns:

- `PRODUCT_OS_RELEASE_PRIVATE_KEY_PEM`
- `PRODUCT_OS_RELEASE_KEY_ID`
- WorkOS staging values needed by diagnostics
- R2 parent access material and account/bucket identifiers

The Doppler identity is constrained to the immutable Norfolk organization/repository identity, the release workflow, the `product-os-release` environment, and `main`. The workflow requests only the selected config. A failure to obtain OIDC credentials is a blocking result, never a reason to fall back to an unscoped token.

### WorkOS readiness

WorkOS is a deployment gate, not a Product OS release-signing dependency. The readiness path:

1. validates required variable presence without printing values;
2. installs or invokes the official WorkOS CLI in an isolated job;
3. runs `workos doctor` against staging;
4. verifies SDK, connectivity, redirect URI, dashboard configuration, and integration patterns;
5. records a redacted diagnostic result;
6. requires a separate end-to-end staging login covering login, callback, sealed session, organization selection where applicable, logout, and safe return intent.

Production credentials are never used to prove staging readiness. A successful structural preflight does not substitute for the live login.

### R2 readiness

R2 readiness uses a parent credential only inside the protected job to issue temporary credentials. The derived credentials are limited by:

- the intended bucket;
- a release- or evidence-specific prefix;
- the minimum required object actions;
- a short lifetime;
- no bucket administration or unrelated object access.

The diagnostic writes a uniquely named test object, verifies checksum and metadata, reads it back, deletes it, confirms absence, and records only redacted object identity and provider results. It does not upload existing client or brand masters. A later preservation migration requires its own inventory and authorization.

## Release data flow

1. A reviewed PR adds one authorization record tied to a candidate and the already-merged release-workflow commit.
2. After merge, the owner manually dispatches the workflow from `main` with exact confirmation.
3. Preflight verifies repository, authorization, source tag, candidate, and absence of the target release.
4. The protected release job obtains a GitHub OIDC token and exchanges it for temporary Doppler access.
5. The builder reconstructs and signs the release in a temporary directory.
6. Independent verification reopens the output and validates identity, signature, hashes, membership, and authorization.
7. GitHub stores the inspected workflow artifact.
8. The job creates the private GitHub release and immutable release tag, attaching the bundle, checksums, manifest, signature, public key, and authorization record.
9. Post-create verification downloads the release assets through GitHub, repeats signature and checksum validation, and marks the job successful only if the remote copy matches.

If release creation succeeds but post-create verification fails, the workflow reports an incident and blocks adoption. It does not overwrite, delete, or silently recreate the release.

## Error handling and recovery

- Every validation error identifies the failed gate without printing secret values.
- Temporary output uses a new isolated directory and is never reused.
- No step mutates candidate directories, source tags, or canonical source files.
- Existing release versions, tags, or authorization records fail closed.
- Retry after a pre-publication failure is safe because no GitHub release exists.
- Retry after GitHub release creation is forbidden; reconciliation must inspect the immutable remote assets and either accept them with evidence or issue a new version through a new authorization.
- WorkOS and R2 diagnostics produce redacted evidence and never change production configuration.

## Testing strategy

Tests are written before implementation and prove:

- missing, malformed, stale, or mismatched authorization is rejected;
- candidate versions cannot be used as released versions;
- source-tag mismatch and unreachable source commits are rejected;
- existing release/tag refusal occurs before signing;
- an untrusted candidate key cannot become the trusted release key;
- signature, manifest, content, bundle-membership, and public-key fingerprint tampering is detected;
- private keys and provider credentials cannot appear in generated artifacts or logs;
- rebuilding with the same authorized inputs is deterministic except for explicitly fixed release metadata;
- candidate directories remain unchanged;
- workflow permissions, environment, branch, concurrency, confirmation, and OIDC requirements are structurally enforced;
- WorkOS and R2 diagnostics fail closed when their required identifiers or credentials are absent;
- R2 temporary scope cannot address another prefix or bucket;
- post-create verification distinguishes a complete remote release from a partial or mismatched one.

The normal Product OS test, typecheck, validation, generation, and secret/history scan remain required.

## Manual disposition

Private GitHub MCP inspection at `b397f6e3d5e00d2be9ee608356f892daaca8dcd2` shows that `norfolk-manual` is not a functioning rendered handbook. Its README describes an intended renderer, but the repository contains a July 2026 Kit payload, generic unpopulated document skeletons, setup/launcher tooling, and duplicated H+ animation code. An unmerged `deletions/animation-library` branch already removes the animation library. No unique current doctrine was found that is not superseded or represented in Product OS, Kit, or H+ evidence.

Recommended disposition: delete only after a complete preservation and recovery dossier. Before requesting deletion approval, preserve and verify:

- `main`, `test/kit-guard-proof`, and `deletions/animation-library`;
- tags, pull-request and issue metadata, workflow history, repository settings, rules, environments, webhooks, deploy keys, secret names, releases, and dependency/consumer evidence;
- a restorable bundle and safe-target restoration test;
- durable pointers showing Product OS is canonical and Kit is executable.

No Manual mutation, archive, or deletion belongs to the trusted-release implementation PR.

## Delivery boundaries

This implementation phase may add code, tests, schemas, documentation, a draft workflow, and a GitHub environment restricted to `main`. It may run redacted diagnostics that cannot mutate production.

It may not:

- generate or expose production secret values;
- create a GitHub release or public tag;
- publish candidate `0.3.0-candidate.4`;
- configure WorkOS production or upload client/brand masters to R2;
- archive or delete `norfolk-manual`;
- weaken branch protection, repository ownership, or existing release gates.

Release publication and Manual deletion each remain separate exact approvals.
