---
title: Design states
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-05
---

# Design states

For every reusable component or pattern, record default, hover, focus, active, disabled, loading, error, empty, success, and cancel. A state may be non-applicable only with a reason.

## Interaction states

Hover never carries information unavailable to touch or keyboard users. Focus is visible and distinct from hover. Active communicates current engagement or selection. Disabled explains why when that knowledge is useful and is not used to hide authorization policy.

## Data and process states

- Loading preserves layout and describes what is happening when it exceeds a brief threshold.
- Empty distinguishes “no records exist,” “filters found none,” “not authorized,” and “not loaded.”
- Error names what failed and the next safe action; technical detail stays available without replacing plain language.
- Success confirms the actual outcome near the action.
- Cancel distinguishes available, requested, confirmed, too-late, and completed-after-request behavior.

Long work records idle, waiting, indeterminate, determinate, paused/disconnected, retrying, timeout, cancellation-requested, cancelled, late completion, duplicate event, failure, and success where applicable. Percentages appear only when grounded in measured work or real stages; elapsed time is honest.

## State transitions

Transitions preserve semantic truth under retries, duplicate events, stale responses, navigation, and reconnect. A visual reset cannot erase a completed server-side action. Consequential actions use the named human-only approval policy shared with the capability layer.
