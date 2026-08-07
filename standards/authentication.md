---
title: Authentication architecture
status: accepted
tier: CONTRACT
owner: Security Owner
lastVerified: 2026-08-05
---

# Authentication architecture

The backend-driven Express integration uses `@workos-inc/node`: the server creates the authorization URL, binds state/nonce/PKCE and safe return intent to a short-lived single-use transaction, exchanges the callback code, and stores only WorkOS sealed session data in a Secure, HttpOnly, SameSite cookie. Backend and SPA integration shapes are not mixed.

Each product declares exactly one entry mode, `open` or `invite-only`. Invite-only routes never expose open registration; open mode does not manufacture invitation requirements. The callback accepts only the configured exact origin/path, consumes its transaction once, rejects stale/reused state, rotates the application session, and maps every WorkOS outcome to a documented first-party state.

Session loading validates or refreshes sealed state server-side. Transient refresh failures retain the existing session for a bounded retry; terminal failures clear it and lead to reauthentication. Organization switching refreshes for the requested organization only after current membership and product authorization checks. Logout deletes the app cookie and ends the WorkOS session. Product authorization is evaluated after identity on every capability.

Current provider behavior is verified against official WorkOS documentation and SDK `10.9.0` on 2026-08-05; recheck before implementation upgrades.
