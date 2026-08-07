---
title: Shared output principles
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-05
---

# Shared output principles

Every output contract declares purpose, audience, fixed/fluid/paged/grid canvas, typography floor, controlled margins, pagination, overflow, chart semantics, sources, confidentiality, numerical tie-out, accessibility, and asset policy.

One immutable input/calculation snapshot is authoritative for each job: request scope, locale, currency, timezone, rounding, disclosures, generated-at time, calculation/code version, and content hash. Rendering never recalculates independently. Recipient authorization is checked when requested and again when downloaded.

Required golden states are normal, overflow, empty, and unavailable. Fixtures also exercise wide tables, partial/stale data, font substitution, print margins, precision, and charts. Overflow reflows, paginates, scales within an approved floor, wraps, truncates with disclosure, or fails visibly; it never clips silently.

Generated masters above the Git threshold live in versioned R2 objects with manifests and retrieval-tested checksums. Git contains lightweight golden fixtures only. External assets are pinned and licensed; generative assets record model/tool, prompt or transformation provenance, rights, review, and accessibility alternative.
