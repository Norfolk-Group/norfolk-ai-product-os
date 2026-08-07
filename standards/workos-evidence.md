---
title: WorkOS implementation evidence
status: accepted
tier: REFERENCE
owner: Security Owner
lastVerified: 2026-08-05
---

# WorkOS implementation evidence

Official WorkOS AuthKit documentation and the installed `@workos-inc/node` `10.9.0` type surface were checked on 2026-08-05. Express uses the backend SDK. Current evidence confirms sealed-session helpers, PKCE authorization URL generation, server-side callback exchange, organization switching through session refresh, logout URL generation, and typed retryable versus terminal refresh outcomes. Production web redirect URIs require HTTPS; staging and production configuration are separate.

This evidence expires when the SDK, session configuration, WorkOS application, or environment changes. Run the official WorkOS CLI diagnostic and an end-to-end staging login before deployment; no live dashboard credentials or redirect settings were available during Product OS construction, so live provider verification remains a deployment gate.
