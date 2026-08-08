# Bounded report and fixed-output validation

Sensitivity: Norfolk-only validation evidence. Publication: blocked. Source commit: `eeb05f9563b93f8842d2257eb7054555935f7e44`. Read-only GitHub MCP inspection on 2026-08-08 was bounded to the slide-deck specification, render-IR contract, and the claimed reusable payload boundary; no client repository changes.

The selected export-data slice recomputes through shared finance modules, calls an export verifier, and emits output hash, engine version, projection horizon, typed statements, metrics, and numeric formats. This validates the Product OS rule that renderers consume one authoritative calculation snapshot and never independently recalculate.

The selected slide-deck evidence separates durable semantic specification from render geometry and describes stable IDs, explicit units, themes, assets, provenance, and renderer validation. The inspection also confirmed that the claimed reusable boundary remains mixed with product-specific fields, slot structures, template assumptions, and fail-open payload behavior. Those implementation details are not portable and were not copied.

## Proposal disposition

| Proposal | Disposition | Norfolk decision | Approval record |
|---|---|---|---|
| PP-U11-DECK-IR | accepted | Adopt the independent Norfolk-owned, vendor-neutral, semantic-before-geometric presentation IR with stable IDs, explicit point units, neutral theme tokens, governed assets, synthetic provenance, accessibility and reading order, explicit overflow, renderer verification, and deterministic hashes. | [outputs/presentation-ir.md](../outputs/presentation-ir.md) |

The accepted proposal changes Norfolk-owned contracts only. The schema and example were authored independently and are synthetic-only. Inspected client fields, brands, slot names, templates, assets, identity, and code remain excluded. The underlying product evidence remains publication-blocked and does not become an upstream dependency or reusable identity.
