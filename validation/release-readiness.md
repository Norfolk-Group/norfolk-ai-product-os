# Candidate release readiness

Candidate `0.3.0-candidate.4` is the current review candidate. Candidates `0.3.0-candidate.1` through `0.3.0-candidate.3` remain preserved as immutable history. Product OS PR #1 and Kit PR #1 are merged and their GitHub quality workflows passed. The trusted private-release implementation, reviewed Ed25519 public-key ceremony, and protected Doppler OIDC path are merged. None of the candidates is publishable yet.

Passed locally:

- all Product OS contracts, schemas, links, semantic validators, generated views, signature, and content hashes;
- full Norfolk Kit lint, typecheck, unit/integration tests, production build/start, Storybook, generated artifacts, and desktop/tablet/mobile browser checks;
- synthetic compatible adoption, conflict handling, client-boundary rejection, rollback, and exception retention;
- bounded read-only client product/design, motion/progress, and fixed-output evidence review;
- verified main-history preservation bundles for Starter and Manual.

## Verified release and provider evidence — 2026-08-08

- Post-merge repository quality passed in [GitHub Actions run `31246900501`](https://github.com/Norfolk-Group/norfolk-ai-product-os/actions/runs/31246900501).
- The trusted release identity is the reviewed Ed25519 public key at `trust/product-os-release-public-key.pem`; its non-secret ceremony record is `trust/2026-08-07-key-ceremony.md`. The protected release and provider-diagnostic workflows obtain their configured release material through Doppler OIDC rather than a static Doppler token.
- Structural WorkOS staging readiness passed in [GitHub Actions run `31246933868`](https://github.com/Norfolk-Group/norfolk-ai-product-os/actions/runs/31246933868). This is redacted diagnostic evidence of the configured provider path; it is not an application's end-to-end login result. Each adopting application must still prove its own staging login, callback, sealed session, organization selection where applicable, logout, and safe return intent before deployment. The dedicated WorkOS diagnostic key must be rotated before `2026-08-14`.
- R2 readiness passed in [GitHub Actions run `31246933854`](https://github.com/Norfolk-Group/norfolk-ai-product-os/actions/runs/31246933854). This is redacted diagnostic evidence for scoped temporary access and does not move, replace, or preserve motion or other client/brand source masters. Their R2 source-master preservation remains pending a separate inventory, preservation decision, and authorization.

See [provider readiness evidence](provider-readiness.md) for the non-secret, provider-specific record.

Review corrections in candidate `0.3.0-candidate.2`:

- destructive repository actions remain unavailable until the complete preservation and recovery dossier passes;
- authentication return paths reject traversal and encoded bypasses;
- compatibility is derived from the governed matrix, adoption paths cannot escape the repository, and promotion acceptance enforces rights and sanitization together;
- candidate content is rebuilt from the declared source commit, versions are immutable, and release metadata requires a concrete signed candidate;
- repository-wide current-tree and history scanning blocks credential material without recording secret values;
- progress restart and duplicate-event state transitions are explicit and monotonic;
- capability maps enforce complete adapter parity, context, recovery, and governed exceptions.

Brand and identity governance added in candidate `0.3.0-candidate.3`:

- Norfolk-master and client-master brand modes, with neutral placeholders until Norfolk AI's official visual identity is approved;
- mandatory, subtle, linked “Powered by Norfolk AI” attribution across interactive and exported surfaces;
- Super Admin governance of global product identity and recoverable, reference-aware asset lifecycle controls;
- three-candidate treatment and regeneration workflows for logos, photos, and identity-faithful professional portraits, with initials fallback;
- private-by-default media, approved sharing, provider no-training requirements, and truth-preserving property imagery;
- protected animation identities and reusable quality architecture promoted from the pinned H+ Analytics implementation without copying its product-exclusive names or visual identity;
- explicit Orchestrator, Agent, Specialist, and deterministic non-LLM Minion semantics, culturally governed naming, and disclosed abstract or synthetic-human conversational presentation.

Repository-state reconciliation in candidate `0.3.0-candidate.4`:

- records that Starter was deleted outside the governed retirement workflow;
- preserves the pre-deletion dossier and its incomplete preservation, consumer, metadata, branch, and recovery evidence without retroactive approval;
- keeps Manual protected behind its independent preservation, parity, recovery, and exact-approval gates.

Open publication gates:

- a release-specific authorization record and explicit permission to publish remain mandatory after the implementation merges;
- each adopting application's end-to-end WorkOS staging login remains mandatory despite the successful structural diagnostic; the dedicated diagnostic key must be rotated before `2026-08-14`;
- R2 source-master preservation for motion and other client/brand masters remains pending a separately authorized inventory, immutable versioned target, retrieval verification, and no-source-mutation proof;
- official Norfolk AI logo, colors, and typography are explicitly deferred to the future Claude Design engagement; neutral semantic placeholders make this deferral non-blocking for candidate merge;
- resolution or explicit deferral of `PP-U11-ICON-GRAMMAR`, `PP-U11-PARITY-EXCEPTIONS`, and `PP-U11-DECK-IR`;
- complete retirement preservation/restoration and consumer evidence are not release blockers for Product OS, but they block repository deletion.

[Product OS PR #1](https://github.com/Norfolk-Group/norfolk-ai-product-os/pull/1) merged at `692b94a3878cc3505f5ce95582ca1a91b3516da7`; [Kit PR #1](https://github.com/Norfolk-Group/norfolk-kit/pull/1) merged at `848d8e71dca8cc1de72a123b6444f8fe5e08af70`; the trusted private-release implementation merged at `f4cfd925856ec1cdb1441e4016e0554f22bb3afa`. No release has been published. Starter's externally completed deletion remains recorded as incomplete evidence, and Manual deletion remains blocked pending complete preservation, recovery, consumers, and exact approval.
