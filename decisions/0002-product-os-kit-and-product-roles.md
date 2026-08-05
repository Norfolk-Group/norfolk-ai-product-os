---
title: Product OS, Kit, and product roles
status: accepted
tier: CONTRACT
owner: Product OS Owner
date: 2026-08-04
lastVerified: 2026-08-04
---

# 0002 — Product OS, Kit, and product roles

## Context

Doctrine, implementation, and product-specific judgment change at different rates and have different owners. Combining them causes stale standards, copied client identity, and silent propagation of central mistakes.

## Decision

- Product OS owns reusable WHAT and WHY.
- Norfolk Kit owns executable HOW and pins a compatible Product OS release.
- Product repositories own their context, data, implementation, adopted Product OS and Kit versions, and approved exceptions.
- Learning flows upstream only through a provenance-rich, sanitized, Norfolk-approved proposal.
- Adoption flows downstream only as a pinned, compatible, reviewable proposal with conflicts, exceptions, and rollback information visible.

## Consequences

Kit remains the executable starter/reference and is not a deletion candidate. A mature product implementation may validate or challenge a standard without becoming an upstream dependency. Applications are not silently rewritten, and their approved exceptions survive later adoption attempts.

The initial Product OS release can establish canonical authority before Kit makes an executable-conformance claim. Compatibility must be declared and verified rather than inferred from repository proximity.
