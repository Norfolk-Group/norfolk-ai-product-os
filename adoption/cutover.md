---
title: Authority cutover
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-05
---

# Authority cutover

Cutover is two phase. First, retain prior authority text while the complete candidate, compatibility, Kit link change, adoption tooling, rollback, and validation are prepared. Second, publish the immutable trusted release, apply the prepared Kit link update on a review branch, verify it, and record cutover state.

If the Kit update fails, restore its prior text and keep the previous released authority active. A candidate or unadopted release cannot silently govern applications. Duplicate editable doctrine is removed only through a later reviewed change; source history remains preserved.
