---
title: Tidy workflow
status: accepted
tier: CONTRACT
owner: Architecture Owner
lastVerified: 2026-08-05
---

# Tidy workflow

Tidy reorganizes already authorized content through moves and reference updates. It does not add a new capability, change doctrine, delete content, close pull requests, or retire repositories. Equip and Tidy cannot operate on overlapping targets concurrently.

The plan records old/new paths, content hashes, references, ownership, sensitivity, conflicts, and rollback. Renames preserve history where Git permits. Anything proposed for removal is emitted as a separate, unexecuted destructive proposal requiring exact approval.
