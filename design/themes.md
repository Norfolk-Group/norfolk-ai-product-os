---
title: Design inheritance and themes
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-05
---

# Design inheritance and themes

Design inheritance is an explicit, reviewable cascade:

```text
Norfolk foundation
  → domain playbook
    → client brand
      → product contract
        → organization-admin theme
          → bounded user preferences
```

Each layer declares its owner, source/version, fields it may set, and fields downstream layers may override. Unknown ownership fails closed.

The supported top-level modes and non-removable Norfolk endorsement are governed by [Brand architecture](brand-architecture.md). Asset creation, approval, and transformation are governed by [Identity and media assets](asset-experience.md).

## Ownership

- Product OS Owner governs Norfolk foundations and accepted domain playbooks.
- The client or authorized brand owner governs client identity.
- The product owner governs product composition and product-scoped tokens.
- Super Admin governs global product name, primary app logo, product animation assignments, and final organization-brand activation.
- Organization administrators may choose approved variants or propose identity changes only where the product contract delegates that ability.
- Users choose only supported appearance, contrast, density, and motion preferences.

A user cannot redefine logo, brand color, type identity, legal copy, product structure, or component contract. An organization theme cannot silently contradict the client brand or accessibility requirements.

## Theme contract

Record semantic token values, typography, density, supported light/dark/contrast variants, charts, authentication surfaces, emails/outputs affected, accessibility evidence, and fallback. Theme switching preserves state and avoids a flash of the wrong brand or appearance.

## Variation

A local difference is either an approved variant or an exception with a record ID. Untracked overrides and “temporary” CSS values are drift, not a theme system.
