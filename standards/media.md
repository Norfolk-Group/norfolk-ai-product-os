---
title: Media transfer and processing
status: accepted
tier: CONTRACT
owner: Platform Owner
lastVerified: 2026-08-05
---

# Media transfer and processing

Clients transfer large media directly to R2 or Stream using a short-lived, single-purpose, tenant-scoped grant constrained by object key, size, content type, checksum where supported, and expiry. Application servers issue intent and grants; they do not proxy bytes. Authorization is checked at intent, confirmation, and every later access.

Confirmation is durable and idempotent. It verifies provider identity, expected object, size/type/checksum, tenant, current authorization, and one accepted intent before promoting quarantine to usable state. Duplicate or late confirmations return the existing outcome. Concurrent metadata updates use versioning or compare-and-set. Interrupted/resumable upload, cancellation, expired grant, provider failure, confirmation failure, authorization change, and signed-URL leakage all have explicit recovery paths.

Unconfirmed objects remain quarantined. A scheduled, observable cleanup removes expired intents and orphaned objects after the recovery window and records evidence. Malware/content scanning and media processing occur before general access where risk requires them. Download grants are short-lived, audience-bound where possible, never logged, and revocable through object or policy state—not presumed safe because the URL eventually expires.
