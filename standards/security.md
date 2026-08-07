---
title: Security and authorization
status: accepted
tier: CONTRACT
owner: Security Owner
lastVerified: 2026-08-05
---

# Security and authorization

WorkOS establishes production identity; the application owns the first-party journey and authorization. Synthetic identities or headers are test-only and must fail closed in production. Session cookies are Secure, HttpOnly, narrowly scoped, rotated after privilege changes, and invalidated on logout, compromise, and material account change. Return intent is allowlisted and integrity protected. OAuth transactions bind state, nonce, PKCE, organization intent, and expiry. Mutations require CSRF protection where cookies authorize them, replay protection, rate limits, and redacted security-event logging.

Authorization evaluates actor, tenant, resource, action, relationship, and current policy in the shared procedure—not in UI visibility or transport middleware alone. Tenant identifiers from clients are untrusted. Agent, UI, job, and API paths receive identical decisions. A human approval is an attributable, time-bounded grant for a specific proposed effect; an agent cannot approve its own action or transform a rejected proposal into a different transport.

Security events record actor, effective identity, organization, action, resource class, decision, policy version, approval reference, trace, and time without tokens, credentials, raw sensitive payloads, or signed URLs. Break-glass access is time-bounded, separately authorized, fully audited, reviewed afterward, and never a normal support workflow.
