---
title: Design composition
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-05
---

# Design composition

## Compose from accessible primitives

Prefer reviewed shadcn/ui components and their underlying accessible primitives when they satisfy the job. Compose and theme them; do not create an arbitrary local alternative because it is quicker. A deviation records the unmet need, source, accessibility consequences, and governed variation or exception.

## Choose density from the job

- **Focus surfaces**—composer, form, single record, explanation—use one clear hero, bounded width, generous space, and a reading measure near 65 characters. Extra viewport becomes margin; controls do not stretch merely because space exists.
- **Scan surfaces**—table, queue, dashboard, ledger—use the available width, stable row/column grids, tabular numerals, aligned metadata, and state encoded in form as well as words. Density comes from removing needless chrome, not shrinking type below comfortable reading.

Applying a scan layout to a focused task creates noise. Applying a focus layout to a dense operational surface wastes attention.

## Hierarchy

Use one primary action or input per focused surface. Fixed top-level navigation may use meaningful icons; nested navigation becomes quieter. Group headings and rules usually outperform nested cards and boxes. Counts sit beside what they count. Labels remain neutral; a small semantic mark may carry state without turning the page into confetti.

## Conversational surfaces

The composer is the hero. Attachments, role/mode, model configuration, and voice controls live within or immediately adjacent to it. Suggestions are quiet, concrete actions rather than competing cards. User-facing choices describe roles or jobs; model vendor configuration stays underneath.
