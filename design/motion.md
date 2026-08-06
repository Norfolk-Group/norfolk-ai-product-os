---
title: Motion
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-05
---

# Motion

Motion communicates state, causality, continuity, focus, and progress. It is never decoration that competes with the job. Implementations preserve recorded timing, easing, transform origin, and coordinated timelines; they do not invent animation for static source nodes. Repeated behavior is factored into reusable primitives.

## Lineage and source roles

Source role is explicit and is not inferred from filename, modification time, archive size, or repository recency:

1. Local Figma Make archives preserve creative intent and editable originals.
2. Replit exports preserve the best original exported implementation.
3. H-Analytics preserves the best known complete production behavior.
4. Norfolk Kit preserves portable implementation and history.
5. Supporting Figma-design repositories are recipes, not automatic authority.

Before reconciliation, hash every variant, copy it to a versioned immutable object, retrieve it, verify the checksum, and retain the local original. A mismatch stops reconciliation; it never authorizes deletion. Canonical status requires complete lineage and explicit Product OS Owner approval.

Figma motion data is authoritative for recorded values. The implementation must honor `prefers-reduced-motion`, preserve state and completion information, validate one entire timeline before batching, and leave unsupported source motion visibly recorded rather than silently dropped.

Accepted names and identifiers are governed by [Product animation registries](animation-registry.md). An implementation refinement may version an animation but cannot silently rename its identity. For the currently reviewed H+ family, the current H+ production implementation is the working master; its visual identities remain product-exclusive while the architecture and quality bar are reusable.
