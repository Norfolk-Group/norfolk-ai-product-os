---
title: Transport-neutral capabilities
status: accepted
tier: CONTRACT
owner: Architecture Owner
date: 2026-08-05
lastVerified: 2026-08-05
---

# 0004 — Transport-neutral capabilities

## Context

Earlier Kit records explored provider-specific managed agents and application transports. Product capabilities must survive changes in model, runtime, and interface without policy drift.

## Decision

Every capability is implemented once as a transport-neutral authorized procedure. UI, tRPC, MCP, copilot, jobs, schedules, and reports are adapters. Model and agent runtime remain configuration. Human-only consequential policy is shared across every adapter.

## Consequences

Parity is testable, transports cannot weaken authorization, and provider replacement does not rewrite domain logic. Adapters may optimize protocol behavior but cannot own business policy.
