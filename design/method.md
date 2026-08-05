---
title: Design method
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-05
---

# Design method

## Prerequisites

No design contract is accepted until the product profile, observation record, application inventory, and information architecture are current and the IA carries an accountable approval ID. Design exploration may test feasibility earlier; it cannot silently change routes, roles, permissions, product purpose, or implementation commitments.

## Discover before inventing

For an existing product, extract the actual language first: semantic colors, typography and numerals, density, spacing, radii, borders, shadows, iconography, controls, tables, navigation, charts, states, responsive behavior, accessibility, motion, feedback, authentication, outputs, and voice. Record which patterns are consistent, isolated, duplicated, inaccessible, or unexplained.

The proposed contract then states what is retained, replaced, introduced, deprecated, or preserved as an exception—and why. A greenfield product begins from the approved product and domain contracts, never from invented “existing” evidence.

## Contract sequence

1. Confirm product and IA prerequisites.
2. Extract existing brand, theme, component, interaction, and output evidence.
3. Apply the inheritance cascade in [Themes](themes.md).
4. Complete every field in the [design contract template](../templates/design-contract.md).
5. Validate component state, responsive, accessibility, source, and deviation records.
6. Produce visual evidence for representative routes, states, themes, and viewports.
7. Record approve, reject, or defer with rationale.
8. Implement incrementally in Kit or the product; propose reusable learning upstream.

## Design-agent authority

A design agent reads the adopted Product OS version, approved product profile, domain playbook, client brand, product design contract, theme, inventory, IA, and exceptions before proposing change. It identifies violations and options; it never silently restyles, changes brand ownership, broadens a user preference, replaces an accepted pattern, or approves its own recommendation.
