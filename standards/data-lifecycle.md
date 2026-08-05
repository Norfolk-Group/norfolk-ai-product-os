---
title: Data lifecycle
status: accepted
tier: CONTRACT
owner: Data Owner
lastVerified: 2026-08-05
---

# Data lifecycle

Every sensitive artifact class declares classification, owner, system of record, authorized roles, purpose, tenant boundary, collection source, retention rule, legal-hold behavior, deletion procedure, backup expiry, and evidence of deletion. A signed URL expiring removes access through that URL; it does not delete the object.

Retention is enforced from an auditable event such as creation, case closure, contract end, or supersession. Legal hold suspends ordinary deletion without erasing the retention obligation. Deletion covers primary data, derived indexes, caches, previews, queued jobs, and known copies; backup copies expire under a documented lifecycle and are not silently restored after deletion. Evidence identifies scope, actor/automation, policy, provider result, timestamps, exceptions, and backup-expiry boundary without retaining the deleted sensitive content.

R2 keys and grants are tenant-scoped and unguessable. Manifests bind object identity, checksum, classification, owner, provenance, and lifecycle. Cross-tenant copy, public access, indefinite signed URLs, and deletion inferred from UI disappearance are forbidden.
