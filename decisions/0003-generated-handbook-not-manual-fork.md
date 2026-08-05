---
title: Generated handbook, not a Manual fork
status: accepted
tier: CONTRACT
owner: Product OS Owner
date: 2026-08-04
lastVerified: 2026-08-04
---

# 0003 — Generated handbook, not a Manual fork

## Context

`norfolk-manual` became a copied snapshot of Kit payload rather than an independent body of standards. A separately edited handbook duplicates authority and drifts from source. The useful idea is a readable presentation layer, not another canonical repository.

## Decision

Canonical content remains structured source in Product OS. Private handbook and catalog views are generated from that source, carry release version, source hashes, and freshness, and are never edited independently. Product OS and Kit generate distinct views from their own real sources: Product OS presents doctrine; Kit presents executable components and behavior.

## Consequences

- There is one editable source for each binding rule.
- A generated view cannot invent or override doctrine.
- Generated views inherit private repository access during the `0.x` series unless a later decision establishes authenticated hosting.
- `norfolk-manual` is a likely retirement candidate after its unique-content and link checks, preservation bundle, generated-handbook parity, and a separate exact approval.
- This decision does not authorize merging or closing its PRs, deleting its branches, archiving it, or deleting the repository.
