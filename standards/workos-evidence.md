---
title: WorkOS implementation evidence
status: accepted
tier: REFERENCE
owner: Security Owner
lastVerified: 2026-08-08
---

# WorkOS implementation evidence

Official WorkOS AuthKit documentation and the installed `@workos-inc/node` `10.9.0` type surface were checked on 2026-08-05. Express uses the backend SDK. Current evidence confirms sealed-session helpers, PKCE authorization URL generation, server-side callback exchange, organization switching through session refresh, logout URL generation, and typed retryable versus terminal refresh outcomes. Production web redirect URIs require HTTPS; staging and production configuration are separate.

The protected staging diagnostic passed on 2026-08-08 in [GitHub Actions run `31246933868`](https://github.com/Norfolk-Group/norfolk-ai-product-os/actions/runs/31246933868), confirming API reachability, matching credentials, the registered Product OS callback, and `@workos-inc/node` `10.9.0` through the official WorkOS doctor. Its redacted evidence establishes structural provider readiness only. The dedicated diagnostic key is short-lived and must be rotated before its 2026-08-14 expiry. An end-to-end staging login remains a separate deployment gate for each adopting application because this canonical repository does not host a user-facing authentication flow.

This evidence expires when the SDK, session configuration, WorkOS application, redirect configuration, or environment changes.
