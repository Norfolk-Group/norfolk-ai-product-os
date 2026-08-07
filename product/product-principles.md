---
title: Product principles
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-05
---

# Product principles

## Begin with the product, not the interface

Norfolk AI first establishes why a product exists, who uses it, who pays for it, which decisions it improves, what value it creates, how success is measured, and which trust, domain, risk, data, and integration constraints shape it. Code and visual style are downstream expressions of those answers.

The operating sequence is:

1. approved product profile and goals;
2. observation-only evidence collection;
3. complete application inventory, or an explicit record that no application exists;
4. interpretation and information-architecture proposal;
5. approved route, menu, role, permission, and workflow model;
6. evidence-linked recommendations;
7. design contract, architecture, and implementation.

No later artifact may manufacture evidence that an earlier gate did not produce.

## Keep epistemic categories separate

- **Fact:** directly observed, with a reproducible locator or named source.
- **Interpretation:** what multiple facts may mean; labeled as analysis and permitted to be uncertain.
- **Recommendation:** a proposed change linked to observations and a product goal, with confidence, impact, effort, risk, alternatives, ownership, and review state.
- **Approval:** an accountable human decision. Agent output is never approval.

Mixing recommendation language into an observation corrupts the evidence base and blocks the workflow.

## Respect existing and greenfield products

An existing application is inventoried before it is judged. A greenfield product records `uiState: none` and `noExistingUiRecorded: true`; it proceeds from product goals without inventing routes, screens, components, user behavior, or “current-state” evidence.

## Invalidate downstream work honestly

A material change to purpose, users, payer, value, success measures, roles, permissions, or inventory invalidates dependent IA, recommendations, and design contracts. The workflow returns to the earliest affected gate and preserves the prior record as history. A later artifact cannot silently patch around a changed premise.

## Client evidence does not become identity

A product such as H-Analytics may validate or challenge the method through a bounded, sanitized evidence slice. It remains a product repository, not the source of Norfolk AI identity or automatic canon. Promotion follows [client boundaries](../governance/client-boundaries.md) and [promotion](../governance/promotion.md).
