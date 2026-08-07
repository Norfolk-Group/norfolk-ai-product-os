---
title: Vendor integration
status: accepted
tier: CONTRACT
owner: Architecture Owner
lastVerified: 2026-08-05
---

# Vendor integration

Integrate vendor capability behind a Norfolk-owned procedure, policy, and data contract. Vendor SDK objects, webhooks, error codes, and pricing do not become domain architecture. Adapters normalize identity, idempotency, retries, observability, and removal; raw vendor escape hatches stay bounded and documented.

Readiness evidence includes business requirement, data classification, official current documentation, official skill or MCP check where available, supported diagnostics/command index, minimal probe, security/privacy review, regions and subprocessors, quotas, failure modes, cost basis, exit/export path, owner, and verification date. SDK behavior, service availability, model performance, quotas, and pricing expire as evidence and are rechecked before launch or material commitment.

Webhook ingestion authenticates origin, limits size/rate, stores a durable deduplication identity, acknowledges safely, and processes idempotently. Provider outage, replay, reordering, partial success, account suspension, and migration are tested. A second foundational vendor requires an accepted decision and removal plan.
