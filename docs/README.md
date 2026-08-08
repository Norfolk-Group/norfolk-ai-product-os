# Product OS documentation index

This is the canonical router. A document is not discoverable merely because it exists; each canonical document must be indexed here or from an indexed section page.

Release engineering references: [authorization lifecycle](../release-authorizations/README.md), [trusted private release design](superpowers/specs/2026-08-07-trusted-private-release-design.md), and [implementation plan](superpowers/plans/2026-08-07-trusted-private-release.md).

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
- [0004 — Transport-neutral capabilities](../decisions/0004-transport-neutral-capabilities.md)
- [0005 — WorkOS is the production identity foundation](../decisions/0005-workos-production-identity.md)
- [0006 — Direct governed media transfer](../decisions/0006-direct-media-transfer.md)
- [0007 — Governed icon and capability-parity exceptions](../decisions/0007-governed-icon-and-capability-parity-exceptions.md)

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
- [Brand architecture](../design/brand-architecture.md)
- [Themes and inheritance](../design/themes.md)
- [Identity and media assets](../design/asset-experience.md)
- [Authentication experience](../design/authentication.md)
- [Forbidden patterns](../design/forbidden-patterns.md)
- [References](../design/references.md)
- [Approval gates](../design/approval-gates.md)
- [Motion](../design/motion.md)
- [Product animation registries](../design/animation-registry.md)
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

## Reports, exports, and fixed outputs

- [Output system index](../outputs/README.md)
- [Shared output principles](../outputs/shared-principles.md)
- [Output job lifecycle](../outputs/job-lifecycle.md)
- [PDF](../outputs/pdf.md)
- [XLSX](../outputs/xlsx.md)
- [PPTX](../outputs/pptx.md)
- [DOCX](../outputs/docx.md)
- [Email](../outputs/email.md)
- [Charts](../outputs/charts.md)
- [Print](../outputs/print.md)
- [Investor materials](../outputs/investor-materials.md)
- [Output contract template](../templates/output-contract.md)

## Technology, architecture, security, and data

| Document | Tier | Owner | Purpose |
|---|---|---|---|
| [Preferred stack](../standards/preferred-stack.md) | CONTRACT | Architecture Owner | Current defaults, evidence, alternatives, and reversal |
| [Application architecture](../standards/architecture.md) | CONTRACT | Architecture Owner | Transport-neutral authorized procedures |
| [Security and authorization](../standards/security.md) | CONTRACT | Security Owner | Identity, authorization, sessions, approvals, and audit |
| [Authentication architecture](../standards/authentication.md) | CONTRACT | Security Owner | Backend-driven WorkOS session and journey boundary |
| [Authentication security](../standards/auth-security.md) | CONTRACT | Security Owner | OAuth integrity, cookies, replay, rate limits, and redaction |
| [WorkOS implementation evidence](../standards/workos-evidence.md) | REFERENCE | Security Owner | Dated official-provider and SDK verification |
| [Secrets](../standards/secrets.md) | CONTRACT | Security Owner | Runtime injection, rotation, scanning, and revocation |
| [Data architecture](../standards/data.md) | CONTRACT | Data Owner | Postgres safety, migrations, isolation, and recovery |
| [Data lifecycle](../standards/data-lifecycle.md) | CONTRACT | Data Owner | Retention, holds, deletion, backups, and evidence |
| [Media transfer](../standards/media.md) | CONTRACT | Platform Owner | Direct upload, confirmation, quarantine, and cleanup |
| [Agent-native architecture](../standards/agent-native.md) | CONTRACT | AI Platform Owner | Outcome parity, tools, context, completion, and approvals |
| [Agent identity and naming](../standards/agent-identity.md) | CONTRACT | AI Platform Owner | Agents, Specialists, Orchestrators, Minions, names, personas, and attribution |
| [Repository lifecycle](../standards/repository-lifecycle.md) | CONTRACT | Product OS Owner | Preservation and separately approved destructive actions |
| [Vendor integration](../standards/vendor-integration.md) | CONTRACT | Architecture Owner | Official evidence, adapters, failure modes, and exit |
| [Reusable modules](../standards/reusable-modules.md) | CONTRACT | Architecture Owner | Enable, govern, upgrade, disable, and remove capabilities |
| [Decision record template](../templates/decision-record.md) | CONTRACT | Product OS Owner | Durable decision rationale and reversal |
| [Module contract template](../templates/module-contract.md) | CONTRACT | Architecture Owner | Reusable capability contract |
| [Authentication experience template](../templates/auth-experience-contract.md) | CONTRACT | Product OS Owner | Complete product-owned WorkOS journey |

## Work plans

- [Plan index and conventions](plans/README.md)

## Release and adoption

- [Adoption system](../adoption/README.md)
- [Release policy](../adoption/release-policy.md)
- [Compatibility](../adoption/compatibility.md)
- [Private distribution](../adoption/distribution.md)
- [Equip](../adoption/equip.md)
- [Tidy](../adoption/tidy.md)
- [Rollback](../adoption/rollback.md)
- [Authority cutover](../adoption/cutover.md)
- [Exception template](../templates/exception.md)
- [Promotion proposal template](../templates/promotion-proposal.md)

## Validation and retirement evidence

- [Throwaway adoption validation](../validation/throwaway-application.md)
- [Bounded client product validation](../validation/h-analytics.md)
- [Motion lineage validation](../validation/motion-lineage.md)
- [Report/output validation](../validation/report-output.md)
- [Norfolk Manual pinned audit](../validation/norfolk-manual.md)
- [Candidate release readiness](../validation/release-readiness.md)
- [Provider readiness evidence](../validation/provider-readiness.md)
- [Preservation evidence](../retirement/preservation-bundle.md)
- [Norfolk Starter dossier](../retirement/norfolk-starter.md)
- [Norfolk Manual dossier](../retirement/norfolk-manual.md)

## Reading by need

- To determine which statement wins, start with [Fundamental governance](../governance/fundamental-governance.md#authority-and-precedence).
- To introduce or change a binding rule, read [Knowledge tiers](../governance/knowledge-tiers.md) and create a decision record when rationale or compatibility changes materially.
- To use client-derived evidence, complete [Client boundaries](../governance/client-boundaries.md) before [Promotion](../governance/promotion.md).
- To prepare a release or automation, apply [Repository security](../governance/repository-security.md) and [Approvals](../governance/approvals.md).
- To begin or redesign a product, complete [Discovery](../product/discovery.md), [Observation](../product/observation.md), [Application inventory](../product/application-inventory.md), and [Information architecture](../product/information-architecture.md) before creating a design contract.

Generated handbook and catalog views are private outputs generated from these sources, never parallel editable doctrine.
