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

## Product method

These contracts keep product purpose, observed evidence, structure, and recommendations separate before design begins.

| Document | Tier | Owner | Purpose |
|---|---|---|---|
| [Product principles](../product/product-principles.md) | CONTRACT | Product OS Owner | Product-first sequence, epistemic categories, greenfield handling, and invalidation |
| [Discovery](../product/discovery.md) | CONTRACT | Product OS Owner | Required product profile, evidence, and exit gate |
| [Observation](../product/observation.md) | CONTRACT | Product OS Owner | Evidence-only first pass and greenfield rule |
| [Application inventory](../product/application-inventory.md) | CONTRACT | Product OS Owner | Required current-state coverage and traceability |
| [Information architecture](../product/information-architecture.md) | CONTRACT | Product OS Owner | Route, menu, workflow, role, permission, and approval gate |
| [Recommendations](../product/recommendations.md) | CONTRACT | Product OS Owner | Evidence-linked proposal, prioritization, approval, and expiry |
| [Domain playbooks](../playbooks/README.md) | CONTRACT | Product OS Owner | Evidence-backed domain adaptation without client leakage |

## Product templates

- [Product profile](../templates/product-profile.md)
- [Observation log](../templates/observation-log.md)
- [Application inventory](../templates/application-inventory.md)
- [Information architecture](../templates/information-architecture.md)
- [Recommendation](../templates/recommendation.md)
- [Domain playbook](../templates/domain-playbook.md)

## Design system

[Design system index](../design/README.md) routes the major design pillar. Every page below is a CONTRACT owned by the Product OS Owner.

- [Method](../design/method.md)
- [Foundations](../design/foundations.md)
- [Composition](../design/composition.md)
- [Components](../design/components.md)
- [States](../design/states.md)
- [Responsive](../design/responsive.md)
- [Accessibility](../design/accessibility.md)
- [Voice](../design/voice.md)
- [Themes and inheritance](../design/themes.md)
- [Authentication experience](../design/authentication.md)
- [Forbidden patterns](../design/forbidden-patterns.md)
- [References](../design/references.md)
- [Approval gates](../design/approval-gates.md)
- [Motion](../design/motion.md)
- [Process progress](../design/progress.md)
- [Design provenance](../design/provenance.md)
- [Viewport matrix](../design/viewport-matrix.md)
- [Visual test environment](../design/visual-test-environment.md)
- [Design contract template](../templates/design-contract.md)
- [Design reference template](../templates/design-reference.md)
- [Motion record template](../templates/motion-record.md)

## Living review views

- [Living visual catalogs](../catalog/README.md)
- [Catalog review experience](../catalog/review-experience.md)
- Generated private handbook: `handbook/index.html`
- Generated abstract catalog: `catalog/generated/index.html`

## Migration and provenance

- [Migration source register](../migration/source-register.md)
- [Content dispositions](../migration/content-dispositions.md)
- [Superseded material](../migration/superseded-material.md)
- [Imported ADR provenance](../migration/adr-provenance.md)

## Work plans

- [Plan index and conventions](plans/README.md)

## Reading by need

- To determine which statement wins, start with [Fundamental governance](../governance/fundamental-governance.md#authority-and-precedence).
- To introduce or change a binding rule, read [Knowledge tiers](../governance/knowledge-tiers.md) and create a decision record when rationale or compatibility changes materially.
- To use client-derived evidence, complete [Client boundaries](../governance/client-boundaries.md) before [Promotion](../governance/promotion.md).
- To prepare a release or automation, apply [Repository security](../governance/repository-security.md) and [Approvals](../governance/approvals.md).
- To begin or redesign a product, complete [Discovery](../product/discovery.md), [Observation](../product/observation.md), [Application inventory](../product/application-inventory.md), and [Information architecture](../product/information-architecture.md) before creating a design contract.

Generated handbook and catalog views are private outputs generated from these sources, never parallel editable doctrine.
