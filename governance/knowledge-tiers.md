---
title: Knowledge tiers
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-04
---

# Knowledge tiers

## Tiers

| Tier | Meaning | Effect |
|---|---|---|
| CONTRACT | A binding rule for the scope and released version that contains it | Conformance is required unless an approved exception applies |
| REFERENCE | Evidence, explanation, example, or prior art | Informs judgment but cannot create a binding rule |

Generated artifacts are views, not a third authority tier. Plans are proposals or execution records and do not become CONTRACT merely by being approved for work.

## Required metadata

Every canonical document declares, in frontmatter or an adjacent machine-readable record:

- `title`
- `status`: `draft`, `proposed`, `accepted`, `deprecated`, or `superseded`
- `tier`: `CONTRACT` or `REFERENCE`
- `owner`: an accountable role or named individual
- `lastVerified`: ISO date for the last evidence or policy verification

Where applicable it also declares source provenance, superseded and superseding records, release inclusion, compatibility effect, sensitivity, and reviewer.

## Freshness

CONTRACT material receives an explicit freshness review at least every 90 days or before a release claims it as newly verified, whichever occurs first. Age is a visible signal, not automatic invalidation: an accepted standard remains accepted until deprecated or superseded, but stale claims cannot be presented as freshly verified. Time-sensitive vendor details require current official-source evidence before implementation.

REFERENCE material records when and how it was observed. A named but unexamined reference cannot support a promoted rule.

## Index and links

Canonical documents must be reachable from [the documentation index](../docs/README.md). Links use repository-relative targets. Missing index entries, owners, tiers, source records, or supersession links block release once automated gates are available; until then reviewers check them manually.

## Supersession

Do not rewrite accepted rationale to make history appear cleaner. A superseding record names the prior record, explains what changed, states compatibility consequences, and links forward and backward. Deprecated material remains readable and clearly labeled until retention policy permits removal.

## Avoiding duplicate memory

Binding rules have one canonical home. Agent files, Kit implementation notes, product docs, and generated handbook pages link to that source rather than copying it. A concise summary may orient a reader, but it must name the authoritative document and cannot introduce new obligations.
