# Candidate release readiness

Candidate `0.3.0-candidate.4` and candidates `0.3.0-candidate.1` through `0.3.0-candidate.3` remain preserved as immutable history. The accepted contracts for the three U11 proposal closures postdate `0.3.0-candidate.4`, so that candidate does not contain them and cannot absorb them. Product OS PR #1 and Kit PR #1 are merged and their GitHub quality workflows passed. The trusted private-release implementation, reviewed Ed25519 public-key ceremony, and protected Doppler OIDC path are merged. A new signed candidate must be created after this PR merges; no existing candidate is publishable.

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

## U11 proposal closure — 2026-08-08

| Proposal | Disposition | Canonical outcome |
|---|---|---|
| PP-U11-ICON-GRAMMAR | accepted | Lucide remains the Norfolk/Kit default; a product-local alternative requires the governed design-contract exception. |
| PP-U11-PARITY-EXCEPTIONS | accepted | Only physical, legal, or security constraints can support a governed capability-parity exception; adapter inconvenience remains a gap. |
| PP-U11-DECK-IR | accepted | The independent Norfolk-owned [presentation IR](../outputs/presentation-ir.md) is vendor-neutral and synthetic-only. |

All three closures govern current source after `0.3.0-candidate.4`; they do not rewrite that candidate. Their bounded product evidence remains publication-blocked and contributes no client fields, brands, slots, templates, assets, identity, or motion visuals. `PP-U11-MOTION-MASTER` is separate and remains explicitly deferred under the pinned-comparison, reuse-rights, and immutable-preservation gates.

Open publication gates and deferrals:

- after this PR merges, create and sign a new candidate from the merged source; `0.3.0-candidate.4` remains immutable history and is not eligible for these changes;
- a release-specific authorization record bound to that exact new candidate and separate explicit publication approval remain mandatory;
- application-level end-to-end WorkOS staging login remains mandatory for each adopting product despite the successful structural diagnostic: login, callback, sealed session, organization selection where applicable, logout, and safe return intent; the dedicated diagnostic key must be rotated before `2026-08-14`;
- source-master R2 preservation remains required where motion or other client/brand masters must be retained: separately authorized inventory, Norfolk AI-controlled immutable versioned target, independent retrieval and checksum verification, and no source mutation;
- official Norfolk AI identity remains explicitly deferred to the future Claude Design engagement; neutral semantic placeholders keep the deferral non-blocking, while any official logo, colors, typography, or visual master still require their own approval;
- `PP-U11-MOTION-MASTER` remains deferred until pinned visual comparison, reuse-rights approval, and immutable R2 preservation are complete; reusable motion architecture remains accepted without that visual choice;
- complete retirement preservation/restoration and consumer evidence are not release blockers for Product OS, but they block repository deletion.

[Product OS PR #1](https://github.com/Norfolk-Group/norfolk-ai-product-os/pull/1) merged at `692b94a3878cc3505f5ce95582ca1a91b3516da7`; [Kit PR #1](https://github.com/Norfolk-Group/norfolk-kit/pull/1) merged at `848d8e71dca8cc1de72a123b6444f8fe5e08af70`; the trusted private-release implementation merged at `f4cfd925856ec1cdb1441e4016e0554f22bb3afa`. No release has been published. Starter's externally completed deletion remains recorded as incomplete evidence, and Manual deletion remains blocked pending complete preservation, recovery, consumers, and exact approval.
