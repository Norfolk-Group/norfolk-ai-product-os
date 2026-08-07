---
title: Authentication security
status: accepted
tier: CONTRACT
owner: Security Owner
lastVerified: 2026-08-05
---

# Authentication security

OAuth transactions bind cryptographically random state, nonce, PKCE verifier/challenge, exact callback origin, entry mode, invitation/organization intent, and integrity-protected application-relative return intent. Transactions expire quickly, are single-use, and are consumed atomically before exchange. Absolute, scheme-relative, encoded, cross-origin, backslash, control-character, and privileged return targets are rejected.

Production cookies are Secure, HttpOnly, SameSite Lax or stricter, explicitly scoped, encrypted/sealed with an environment-specific password, rotated on login, refresh, organization/role/security change, and removed on logout or terminal failure. Mutations use CSRF defenses. Provider events verify signatures, timestamp tolerance, deduplication, and replay. Login, callback, recovery, invitation, and verification paths have actor/IP-aware rate limits.

Logs record event class, result, actor/session surrogate, organization, trace, and policy version; they redact codes, tokens, cookies, state, nonce, verifier, secrets, signed URLs, and sensitive identity attributes. Identity errors do not reveal unrelated account existence.
