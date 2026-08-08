# Product OS release evidence and design-decision closure

**Goal:** Bring the `0.3.0-candidate.4` readiness record up to the verified repository/provider state and close the three remaining U11 proposals without importing client identity or publishing a release.

**Architecture:** Canonical contracts and ADRs own accepted rules. Bounded validation records retain sanitized evidence and exact source commits. Provider results are recorded as redacted, dated evidence. Generated handbook/catalog views are rebuilt from those canonical sources.

## Global constraints

- Norfolk AI Product OS remains canonical; Norfolk Kit remains the executable reference.
- `Norfolk-Group/H-Analytics` is read-only validation evidence. Inspect private source through GitHub MCP, pin the inspected commit, and never change that repository.
- Do not promote client/product names, palettes, identities, animation names, personas, financial fields, paths, URLs, or assets into canonical contracts, schemas, examples, or generated views.
- Lucide remains the Norfolk/Kit default. A product-local alternative may exist only through an explicit design-contract exception proving a coherent single-library grammar, accessibility, ownership, migration boundary, and review.
- Capability parity exceptions require a physical, legal, or security constraint, a named human procedure, an approval record/class, ownership, recovery, and review. Adapter inconvenience is not a valid exception.
- Presentation IR must be Norfolk-owned, vendor-neutral, semantic before geometric, deterministic, accessible, provenance-bound, and demonstrated only with synthetic examples.
- H-Analytics motion remains product-local evidence. Promote reusable architecture and quality rules only; do not select a visual motion master without pinned comparison, rights approval, and immutable preservation.
- Record WorkOS and R2 success without credentials or secret-shaped values. Do not claim that a provider diagnostic is an application login test or that R2 diagnostic readiness preserves any source master.
- Do not create a release authorization, publish a release, revoke credentials, delete repositories, close PRs, or mutate client repositories.
- Use explicit file staging. Run typecheck, tests, validation, and deterministic generation checks before publishing the draft PR.

## Task 1: Reconcile trusted-release and provider readiness evidence

Update the canonical readiness record to reflect the merged trusted-release implementation, reviewed Ed25519 public key ceremony, configured Doppler OIDC path, and successful post-merge WorkOS and R2 diagnostics on 2026-08-08. Cite redacted GitHub run identifiers or URLs, distinguish structural WorkOS readiness from each application's end-to-end login gate, keep the WorkOS diagnostic-key rotation deadline of 2026-08-14, and keep motion/source-master R2 preservation explicitly pending. Add or update an indexed provider-readiness reference if that is the clearest non-secret evidence surface. Add tests if necessary to prevent stale contradictions from returning.

## Task 2: Resolve icon grammar and capability-parity proposals

Use GitHub MCP to inspect the current private H-Analytics commit and the bounded files supporting its coherent product-local icon system and parity map. Record only sanitized findings and the exact commit. Accept `PP-U11-ICON-GRAMMAR` by retaining Lucide as the Norfolk/Kit default while defining the governed product-local exception above. Accept `PP-U11-PARITY-EXCEPTIONS` by making the Global constraints enforceable in prose, schemas, examples, and tests. Update the bounded validation record so both proposal IDs have an explicit accepted disposition rather than remaining open.

## Task 3: Resolve the presentation/deck IR proposal

Use GitHub MCP to inspect the current private H-Analytics slide-contract evidence. Create a Norfolk-owned synthetic presentation-IR contract and machine-readable schema/example where appropriate. The contract must separate semantic content from render geometry, support stable IDs, units, themes/tokens, assets, provenance, accessibility/reading order, overflow behavior, renderer verification, and deterministic output. No client fields, brands, slot names, templates, or assets may enter canonical content. Mark `PP-U11-DECK-IR` accepted in the bounded validation record and connect the contract from the output index/PPTX contract with focused tests.

## Task 4: Reconcile motion/design validation and final candidate readiness

Use GitHub MCP to recheck the current H-Analytics motion/progress governance and registry evidence. Update the bounded motion/design records with the pinned commit and an explicit separation between accepted reusable architecture and the still-deferred visual-master choice. Reconcile `validation/release-readiness.md` so the three U11 decisions are closed, provider readiness is current, and remaining publication gates are truthful: application-level WorkOS login, source-master R2 preservation where required, official Norfolk identity deferral, release-specific authorization, and explicit publication approval. Because these accepted contracts postdate immutable `0.3.0-candidate.4`, preserve that candidate as history and require a newly signed candidate after this PR merges; never imply that candidate.4 contains the new decisions. Rebuild generated handbook/catalog outputs and ensure no blocked client evidence is included.

## Verification

- `pnpm typecheck`
- `pnpm test`
- `pnpm validate`
- `pnpm generate`
- `git diff --exit-code -- handbook catalog release-manifests/0.3.0-candidate.4.json`
- repository-wide credential/client-boundary validation remains green
