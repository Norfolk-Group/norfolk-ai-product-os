---
title: Application architecture
status: accepted
tier: CONTRACT
owner: Architecture Owner
lastVerified: 2026-08-05
---

# Application architecture

Implement a capability once as a transport-neutral authorized application procedure. UI, tRPC, MCP, copilot, report jobs, schedules, and future adapters call that procedure; no adapter reimplements authorization or business rules. Product state lives in shared services and changes are observable by every surface.

Procedures accept actor, organization/tenant, validated intent, idempotency context, and trace context. They return structured outcomes rich enough to verify, retry, explain, and recover. Authorization is centralized and defaults to denial. Legal, payment, destructive, external-communication, production mutation, and other named consequential classes use the same human-only policy across transports.

Agent tools expose composable primitives with clear errors and rich results. They support complete lifecycle operations, including undo or governed deletion where the UI supports them. Dynamic external APIs use discovery plus generic access when full parity is intended. Prompts decide judgment and composition; code enforces identity, authorization, approvals, data invariants, rate limits, idempotency, and irreversible boundaries.

Every capability map records user vocabulary, procedure, callers, authorization, approval, context availability, completion signal, and recovery. A transport exception must name a physical, legal, or security constraint; a named human procedure; an approval record or class; an owner; recovery; and dated review. Adapter inconvenience and “we did not build the tool” are gaps, not exceptions.
