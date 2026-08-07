---
title: Adoption rollback
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-05
---

# Adoption rollback

Normal rollback restores code and configuration while old and new versions remain compatible within an expand-and-contract database window. It records from/to commits, lock versions, managed-file hashes, preserved local exceptions, validation, and reason. It never rolls back central Product OS or other applications.

If adopted work contracted schema, transformed/deleted data irreversibly, sent external effects, or crossed a provider boundary, normal rollback refuses. Recovery requires a separate target-specific human-approved plan with backup/restore evidence, affected data, downtime, reconciliation, and success/abort criteria.
