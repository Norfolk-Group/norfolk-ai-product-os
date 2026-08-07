---
title: Design foundations
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-05
---

# Design foundations

## Universal foundation versus product expression

Norfolk-wide foundations define semantic roles, evidence requirements, accessibility, icon grammar, state completeness, and inheritance rules. They do not impose a single client palette, typeface personality, density, or visual mood on unrelated products. Product-specific values declare `client-brand`, `product`, or `organization-theme` scope; labeling them `foundation` is a contract violation.

## Tokens

Use semantic names tied to purpose: background, foreground, surface, primary action, destructive action, warning, success, muted text, border, input, focus ring, chart series, and data states. Record light/dark/contrast values, supported combinations, contrast evidence, and ownership. Components consume semantic tokens, not literal product colors.

## Typography and numerals

Declare bundled font sources, fallback, sizes, weights, line heights, tracking, and reading measure. Numeric typography is separate: tabular numerals, decimal alignment, currency symbols, negative values, percentages, dates, units, precision, and zero/null behavior are explicit. A visually attractive font that makes financial columns hard to compare is not acceptable.

## Spacing, radius, border, and shadow

Use a named scale with documented jobs rather than one-off values. Hairlines are 1px. Radius expresses component family and hierarchy, not decoration. Shadows are reserved for true elevation such as an overlay; use space, tone, and borders for ordinary grouping.

## Iconography

Lucide is the sole canonical interface library. The default stroke is `1.5`; large feature marks may use `1.25`. Do not render monoline icons below 14px. Custom icons use Lucide's 24×24 grid, round caps/joins, compatible stroke, and review. Style is locked while meaning varies. Use an icon only when it adds information the label does not; fixed navigation may use icons, homogeneous user-named lists generally do not.

Emoji, filled/duotone sets, a second icon library, ad hoc per-row icons, and color-coded icon confetti are forbidden.
