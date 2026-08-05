---
title: Design system index
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-05
---

# Design system

Design is a first-class Product OS pillar. It governs how product purpose becomes information hierarchy, composition, interaction, language, authentication, responsive behavior, accessible states, and reviewable visual evidence. It is broader than tokens and components, and it does not replace fundamental governance.

## Route by need

| Need | Contract |
|---|---|
| Sequence and agent authority | [Method](method.md) |
| Tokens, typography, spacing, radii, shadows, icons | [Foundations](foundations.md) |
| Focus and scan layouts, hierarchy, shadcn composition | [Composition](composition.md) |
| Reusable patterns and upstream inputs | [Components](components.md) |
| Interaction, process, error, success, and cancel states | [States](states.md) |
| Mobile, tablet, desktop, reflow, and safe areas | [Responsive](responsive.md) |
| Keyboard, screen reader, contrast, motion, and evidence | [Accessibility](accessibility.md) |
| Interface language and conversational posture | [Voice](voice.md) |
| Inheritance, brand, organization themes, preferences | [Themes](themes.md) |
| WorkOS-backed first-party identity experience | [Authentication](authentication.md) |
| Explicit anti-patterns | [Forbidden patterns](forbidden-patterns.md) |
| Reference evidence lifecycle | [References](references.md) |
| Approval, exceptions, and anti-regression | [Approval gates](approval-gates.md) |
| Motion meaning, fidelity, and lineage | [Motion](motion.md) |
| Honest long-process feedback | [Process progress](progress.md) |
| Source hashes and preservation | [Provenance](provenance.md) |
| Responsive evidence matrix | [Viewport matrix](viewport-matrix.md) |
| Comparable visual captures | [Visual test environment](visual-test-environment.md) |

The machine-readable product contract is [`design-contract.schema.json`](../schemas/design-contract.schema.json). Reusable components use [`component-specimen.schema.json`](../schemas/component-specimen.schema.json). Norfolk Kit implements compatible executable components and catalogs; it does not own this doctrine.
