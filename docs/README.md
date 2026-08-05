# Product OS documentation index

This is the canonical router. A document is not discoverable merely because it exists; each canonical document must be indexed here or from an indexed section page.

## Governance kernel

| Document | Tier | Owner | Purpose |
|---|---|---|---|
| [Fundamental governance](../governance/fundamental-governance.md) | CONTRACT | Product OS Owner | Authority, precedence, repository roles, lifecycle, and amendment |
| [Knowledge tiers](../governance/knowledge-tiers.md) | CONTRACT | Product OS Owner | CONTRACT and REFERENCE metadata, freshness, and supersession |
| [Approvals](../governance/approvals.md) | CONTRACT | Product OS Owner | Approval roles and consequential-action boundaries |
| [Exceptions](../governance/exceptions.md) | CONTRACT | Product OS Owner | Bounded departures from adopted contracts |
| [Promotion](../governance/promotion.md) | CONTRACT | Product OS Owner | Proposal-based learning from products and external sources |
| [Client boundaries](../governance/client-boundaries.md) | CONTRACT | Product OS Owner | Norfolk ownership, client isolation, sanitization, and disclosure |
| [Repository security](../governance/repository-security.md) | CONTRACT | Product OS Owner | Repository trust, automation identity, release, and audit controls |

## Decisions

Accepted decisions are append-only history. A later decision may supersede one, but must preserve and link the earlier record.

- [0001 — Product OS is canonical](../decisions/0001-product-os-is-canonical.md)
- [0002 — Product OS, Kit, and product roles](../decisions/0002-product-os-kit-and-product-roles.md)
- [0003 — Generated handbook, not a Manual fork](../decisions/0003-generated-handbook-not-manual-fork.md)

## Work plans

- [Plan index and conventions](plans/README.md)

## Reading by need

- To determine which statement wins, start with [Fundamental governance](../governance/fundamental-governance.md#authority-and-precedence).
- To introduce or change a binding rule, read [Knowledge tiers](../governance/knowledge-tiers.md) and create a decision record when rationale or compatibility changes materially.
- To use client-derived evidence, complete [Client boundaries](../governance/client-boundaries.md) before [Promotion](../governance/promotion.md).
- To prepare a release or automation, apply [Repository security](../governance/repository-security.md) and [Approvals](../governance/approvals.md).

Generated handbook and catalog views will be added in later implementation units. They will be private outputs generated from these sources, never parallel editable doctrine.
