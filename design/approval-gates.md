---
title: Design approval gates
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-05
---

# Design approval gates

## Gate 1 — prerequisites

Product profile, observation, inventory, and IA are current. IA status is approved and its approval ID appears in the design contract. Missing or invalidated prerequisites block acceptance.

## Gate 2 — contract completeness

The contract covers foundations, numeric typography, density, composition, components, responsive behavior, accessibility, voice, themes, authentication, state behavior, motion, feedback, references, shadcn inputs, variations, and forbidden patterns. Every component records all applicable states and reasons for non-applicability.

## Gate 3 — evidence

Representative desktop, tablet, and mobile views show supported themes, material routes, authentication, long content, loading, error, empty, success, cancellation, and reduced motion. Before/after evidence identifies the product/user goal rather than relying on taste.

## Gate 4 — decision

An accountable human chooses `approve`, `reject`, or `defer` and records rationale. Baseline changes are visible; neither an agent nor a generated catalog approves itself. Consequential access, brand, legal, financial, security, or outward-facing changes use the appropriate additional owner.

## Implementation and drift

Approved work lands incrementally with tests and synchronized contract updates. A proposed implementation that violates the adopted cascade, state matrix, accessibility, source pin, or exception record blocks. Better patterns become upstream promotion proposals; they do not silently establish precedent in one product.

## Invalidation

Changed product purpose, roles, permissions, inventory, IA, brand ownership, or material accessibility evidence returns the contract to the affected earlier gate. Preserve the old approval record and mark it superseded or invalidated rather than rewriting history.
