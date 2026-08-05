---
title: Process progress
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-05
---

# Process progress

Progress must be honest. Required states are idle, waiting, indeterminate, determinate, paused, disconnected, retrying, timeout, cancellation-requested, cancelled, late-completion, duplicate-event, failure, and success.

- Indeterminate work shows activity and elapsed time, never a fabricated percent.
- Determinate progress comes from measured server stages or units. It cannot regress unless a declared restart begins a new attempt.
- Jobs exceeding five seconds expose a compact persistent progress surface; blocking work may use a modal only when interaction truly cannot continue.
- Cancellation is a request until the server confirms it. A later completion is recorded as late completion and never presented as ordinary success.
- Duplicate and out-of-order events are recorded and reconciled by event identity and server order.
- Reduced motion removes nonessential transforms while retaining text, state, elapsed time, error, and completion information.
