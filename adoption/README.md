---
title: Adoption system
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-05
---

# Adoption system

Adoption is a reviewable proposal, never synchronization. A product pins an immutable private Product OS release and compatible Kit version, verifies signature and hashes, calculates conflicts and exceptions without mutation, then creates a deterministic branch and pull request through a repository-scoped short-lived identity. The product owner may adopt, defer, or reject.

Equip adds approved payload. Tidy reorganizes without deletions. Promotion sends sanitized evidence upstream. Retirement and every deletion remain separately approved destructive workflows. No successful operation implies permission for another.

The lifecycle is `available` → `proposed` → `adopted`, `deferred`, or `rejected`; adopted releases may become `rollback-requested` or `rolled-back`. Partial runs checkpoint safely and resume only after re-verifying repository head, bundle, compatibility, identity, and approvals.
