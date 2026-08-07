---
title: Visual test environment
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-05
---

# Visual test environment

Comparable visual evidence pins browser build, runtime, font files, viewport, device scale, orientation, locale, timezone, clock, random seed, animation state, pixel threshold, and evidence retention. Missing fonts, a live clock, uncontrolled randomness, or an unpinned browser makes a capture non-comparable.

A changed baseline requires an approved design-contract change or explicit baseline approval. CI presents the before/after diff and blocks acceptance until the accountable decision is recorded; it never updates baselines merely because a screenshot changed.
