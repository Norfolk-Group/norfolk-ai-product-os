---
title: Fundamental governance
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-04
---

# Fundamental governance

## Purpose

The Norfolk AI Product OS is the canonical authority for Norfolk AI product doctrine, standards, decision rationale, governance, and adoption contracts. It exists to make durable product knowledge explicit, reviewable, versioned, and usable by people and agents.

Norfolk AI owns the Product OS and reusable intellectual property. The initial accountable Product OS Owner is Ricardo Cidale.

## Authority and precedence

Within the affected scope, authority follows this order:

1. Explicit human instruction from an authorized owner for the current action.
2. An approved product-local exception.
3. The Product OS version explicitly adopted by that product.
4. The compatible Norfolk Kit version explicitly adopted by that product.
5. Product-local reference material.
6. Generated artifacts.
7. Current code behavior as observational evidence.

A newer Product OS release that a product has not adopted has no authority over that product. An explicit instruction cannot waive Norfolk AI ownership, client confidentiality, legal duties, or an approval held by a different accountable owner unless the instructor has that authority.

When two statements at the same level conflict, prefer the narrower scope, then the more recent accepted decision or standard with an explicit supersession link. If the conflict remains unresolved, stop and ask the Product OS Owner; do not improvise.

## Repository roles

- **Product OS** owns WHAT and WHY: portfolio doctrine, methods, contracts, rationale, governance, and release/adoption rules.
- **Norfolk Kit** owns executable HOW: reference application code, components, integrations, modules, checks, and adoption tooling pinned to a Product OS release.
- **Product repositories** own product and client context, data, implementation, adopted versions, and approved local exceptions.
- **Generated handbook and catalogs** are private, non-editable views of canonical sources.

Kit or a product may reveal a better pattern, but it becomes Norfolk doctrine only through the promotion process. No repository becomes canonical by containing the most mature implementation.

## Knowledge lifecycle

Standards and decisions use `draft`, `proposed`, `accepted`, `deprecated`, and `superseded`. Accepted decisions are historical records: correct them through a new linked decision rather than silent replacement. Binding knowledge must be indexed, owned, tiered, and reviewable under [Knowledge tiers](knowledge-tiers.md).

The Product OS follows a minimal-and-true rule. Remove filler, duplicate memory, and claims unsupported by evidence. Preserve rationale and provenance where deletion would erase why a decision exists.

## Generated views

Canonical content is structured source in this repository. Handbooks, catalogs, and other presentations are generated from it, include their release version and source identity, and are not edited by hand. A generated view cannot add authority absent from its source.

## Change and adoption

All changes use a branch and review. Releases are versioned and machine-readable. Adoption is pinned, compatible, proposal-based, and reversible within its stated limits; it never silently rewrites a consumer. Product learning travels upstream through [Promotion](promotion.md), not direct copying.

## Destructive boundary

Creation, migration, promotion, adoption, equip, tidy, validation, and retirement-readiness work do not authorize deletion. Repository deletion, branch deletion, PR closure, archive removal, history rewriting, and destructive migrations each require a separate proposal naming the exact target, preservation and recoverability evidence, impact, and explicit target-specific approval.

`norfolk-starter` is the first likely repository retirement candidate and `norfolk-manual` the second. That ordering is a reminder, not approval. Both remain untouched until their independent gates are satisfied.

## Amendment

A material change to authority, ownership, precedence, repository roles, or lifecycle requires Product OS Owner approval and a new decision record. Changing this file alone cannot silently overturn an accepted decision.
