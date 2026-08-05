---
title: WorkOS is the production identity foundation
status: accepted
tier: CONTRACT
owner: Security Owner
date: 2026-08-05
lastVerified: 2026-08-05
---

# 0005 — WorkOS is the production identity foundation

## Context

Legacy Norfolk repositories contain Clerk and other authentication approaches. The current Product OS and runnable Kit use WorkOS AuthKit with a product-owned first-party experience.

## Decision

WorkOS is the sole production identity default. Clerk is unsupported current doctrine. Synthetic headers and identities are nonproduction test mechanisms only. A second production identity system requires a superseding accepted decision, threat analysis, migration, and removal plan.

## Consequences

Identity is consistent across products while authorization remains Norfolk-owned and shared across UI and agent paths.
