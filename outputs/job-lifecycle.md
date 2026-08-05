---
title: Output job lifecycle
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-05
---

# Output job lifecycle

States are queued, running, indeterminate, determinate, cancelling, cancelled, failed, retrying, completed, available-to-download, downloaded, and expired. Determinate progress is grounded in server stages; indeterminate work shows elapsed time without a percentage.

Every job has an idempotency key and attempt number. A retry resumes or replaces the attributable attempt without duplicate generation or delivery. Cancellation remains requested until acknowledged. Completed output after cancellation is a late-completion event and is not delivered automatically.

Signed URLs are short-lived, audience-bound, revocable, and never logged. Download rechecks current authorization and confidentiality. Expired or revoked jobs present an explicit regeneration path. Jobs retain the authoritative snapshot and audit record according to the data-lifecycle contract.
