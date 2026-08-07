---
title: Authentication experience contract template
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-05
---

# Authentication experience contract

Declare product/client brand source, entry mode, allowed return prefixes, WorkOS application/environment, exact callback, and organization model. For every required state record owner (`kit`, `workos-hosted`, or `external-idp`), copy owner, controllable branding, user explanation, next/recovery action, return continuity, loading/slow-network behavior, keyboard/screen-reader behavior, mobile behavior, and reduced-motion treatment.

Required states include login/logout; open entry; invitation valid/expired/revoked/used; email verification; MFA enrollment/challenge/recovery; organization selection/switching; SSO-required; no authorized organization; recovery; locked/disabled; access denial; session expiry/reauthentication; callback failure/retry; and safe return to intent.
