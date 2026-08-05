---
title: Private release distribution
status: accepted
tier: CONTRACT
owner: Security Owner
lastVerified: 2026-08-05
---

# Private release distribution

Kit fetches a version-pinned private GitHub release bundle through a repository-scoped GitHub App or OIDC-derived short-lived identity. It verifies trusted public key, manifest signature, manifest hash, every content hash, repository target, compatibility, and release state before writing. Consumers do not clone or execute Product OS head.

The identity cannot read unrelated repositories or write the default branch. It writes a deterministic adoption branch only, opens a pull request, and records actor, target, bundle, base/head, checks, conflicts, exceptions, and rollback. Logs redact tokens and private URLs. Unknown trust or partial verification stops with no changes.
