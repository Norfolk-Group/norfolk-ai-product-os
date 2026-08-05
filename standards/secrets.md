---
title: Secrets management
status: accepted
tier: CONTRACT
owner: Security Owner
lastVerified: 2026-08-05
---

# Secrets management

Doppler injects secrets at runtime through separate development, test, staging, and production configurations and environment-scoped workload identities. Repositories contain documented variable names and safe examples, never values. Prefer short-lived, least-privilege identities over durable keys; separate build, deploy, migration, runtime, support, and release privileges.

Every secret has an owner, permitted environments and consumers, rotation cadence, last tested rotation, emergency revocation path, and dependent-service inventory. Rotation is rehearsed without downtime where the service permits it. Break-glass retrieval is approved, time-bounded, attributed, audited, and followed by rotation when exposure cannot be disproved.

CI scans source, history introduced by the change, logs, fixtures, manifests, generated handbooks/catalogs, and release artifacts. Telemetry redacts authorization headers, cookies, credentials, signed URLs, query secrets, and sensitive payload fields before emission. Detection blocks release, revokes or rotates the credential first, preserves safe forensic evidence, and removes the value from every derivative; merely deleting the current file is not remediation.
