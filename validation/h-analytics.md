# Bounded client product and architecture validation

Sensitivity: Norfolk-only validation evidence. Publication: blocked. Source commit: `eeb05f9563b93f8842d2257eb7054555935f7e44`. Read-only GitHub MCP inspection on 2026-08-08 was bounded to the product-local design contract, its mechanical UI validator, and the capability parity map; no client repository changes.

## Observed evidence

- The product-local design system is explicitly extracted from running code, defines precedence, and routes icon imports through one documented library boundary. Its canonical UI checker build-blocks selected anti-drift rules; icon discipline remains an explicit review obligation.
- The parity map records UI action, location/endpoint, conversational tool, and status across a broad product surface. It exposes exceptions marked N/A rather than silently claiming parity; several N/A rationales are physical user-only boundaries, while adapter and implementation limitations remain gaps under the accepted Norfolk rule.
- Product identity includes a local palette, icon library, personas, labels, financial/domain rules, and brand-specific slide assets. These remain client/product material and are not Norfolk canon.
- The current product animation system has a 15-entry stable registry, five server-configured semantic assignment categories, Super-Admin assignment, live previews, reduced-motion handling, and an honest named-member progress ticker.
- The current agent sources distinguish named LLM Agents and reusable Specialists from deterministic Minions, use Italian/Brazilian first-name grammar, and use zero-padded names for job-specific Swarm members. One older glossary entry and a few deterministic Swarm labels conflict with that newer doctrine and are rejected as drift rather than promoted.

## Comparison and proposals

The evidence validates Product OS requirements for observed-before-recommended design, machine-enforced anti-drift, runtime themes, capability maps, and product-local authority beneath an adopted Product OS version. It also demonstrates that a mature product can preserve a coherent single-library grammar without changing the Norfolk default.

The product parity map is strong evidence, but some N/A decisions cite adapter limitations rather than physical, legal, or security constraints. Those entries are gaps and cannot support a complete parity claim.

## Proposal dispositions

| Proposal | Disposition | Norfolk decision | Approval record |
|---|---|---|---|
| PP-U11-ICON-GRAMMAR | accepted | Lucide remains the Norfolk/Kit default. A product-local alternative requires an approved design-contract exception proving coherent single-library grammar, accessibility, ownership, migration boundary, and review. | [0007](../decisions/0007-governed-icon-and-capability-parity-exceptions.md) |
| PP-U11-PARITY-EXCEPTIONS | accepted | A parity exception requires a physical, legal, or security constraint, named human procedure, approval record or class, owner, recovery, and review. Adapter inconvenience is invalid. | [0007](../decisions/0007-governed-icon-and-capability-parity-exceptions.md) |

These accepted proposals change Norfolk-owned contracts only. The underlying product evidence remains publication-blocked and does not become an upstream dependency or reusable identity.

Approved sanitized promotion: Product OS adopts the reusable brand-layer architecture, governed media transformations, agent taxonomy and naming grammar, truthful member attribution, product-scoped protected animation registries, server-configured categories, and reduced-motion/long-process behavior. Product names, assistant identities, animation names and visuals, palettes, client context, and financial/domain rules remain product-local. Current product implementations are the working motion masters for that product; Figma and Replit remain preserved lineage evidence.
