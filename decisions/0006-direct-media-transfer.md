---
title: Direct governed media transfer
status: accepted
tier: CONTRACT
owner: Platform Owner
date: 2026-08-05
lastVerified: 2026-08-05
---

# 0006 — Direct governed media transfer

## Context

Proxying large objects through application servers adds cost, failure surface, and credential exposure while obscuring resumability and provider state.

## Decision

Large media transfers go directly to R2 or Stream through bounded grants. Application procedures govern intent, confirmation, quarantine, access, cancellation, idempotency, and orphan cleanup. Repositories store manifests and lightweight fixtures, not large masters.

## Consequences

Transfer scales independently from the app server, but correctness now depends on durable intent/confirmation state, repeated authorization checks, lifecycle evidence, and tested failure recovery.
