---
title: Authentication experience
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-05
---

# Authentication experience

WorkOS AuthKit supplies identity infrastructure; Norfolk owns the end-to-end product experience. Clerk is not part of the approved stack.

## Required journeys and states

- login and logout;
- invitations and account activation;
- passwordless, recovery, and email verification as configured;
- MFA enrollment, challenge, recovery, and unavailable-factor handling;
- organization choice and switching;
- SSO discovery and routing;
- session expiry, reauthentication, and return to safe intent;
- loading, locked, access denied, and recoverable errors.

## Continuity

Hosted WorkOS surfaces use the approved client/product brand and plain product voice. Transitions explain why the user is moving, preserve allowlisted return intent, and return focus and context safely. The user should not feel deposited in an unrelated vendor product.

## Safety and disclosure

Errors do not reveal whether an unrelated account exists. Denial distinguishes authentication from authorization without exposing policy detail. Consequential organization changes require explicit confirmation and server-side authorization. Session and OAuth integrity controls live in the security contract; design must expose their states without weakening them.

## Responsive and accessible identity

All journeys work by keyboard and screen reader, handle zoom and mobile keyboards, meet target and contrast rules, avoid inaccessible countdown pressure, and offer a recoverable next step.
