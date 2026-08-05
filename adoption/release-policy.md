---
title: Release policy
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-05
---

# Release policy

Canonical releases are immutable private bundles containing manifest, standards, schemas, handbook/catalog, compatibility, provenance, and checksums. A trusted release environment signs the canonical serialization through a protected branch, required owners/checks, short-lived identity, actor attribution, and explicit environment approval. Candidate signatures from untrusted local keys prove integrity only and cannot authorize publication.

Patch releases clarify or repair without changing obligations. Minor `0.x` releases add or materially change contracts and require opt-in adoption. Removal, incompatible schema, or authority change records migration and may require the next minor while pre-1.0. Released manifests are never edited; correction is a new version. Deprecated and unsupported states name support end and migration.

`0.3.0-candidate.1` is an internal adoption candidate, not a published release. U11 may publish only after validation and trusted signing approval.
