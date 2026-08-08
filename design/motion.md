---
title: Motion
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-08
---

# Motion

Motion communicates state, causality, continuity, focus, and progress. It is never decoration that competes with the job. Implementations preserve recorded timing, easing, transform origin, and coordinated timelines; they do not invent animation for static source nodes. Repeated behavior is factored into reusable primitives.

## Lineage and source roles

Source role is explicit and is not inferred from filename, modification time, archive size, or repository recency:

1. Editable design masters preserve creative intent and original source values.
2. Original implementation exports preserve the handoff from design to code.
3. Deployed product implementations preserve observed production behavior.
4. Portable reference implementations preserve reusable execution and history.
5. Supporting recipe repositories are implementation aids, not automatic authority.

Before reconciliation, hash every variant, copy it to a versioned immutable object, retrieve it, verify the checksum, and retain the local original. A mismatch stops reconciliation; it never authorizes deletion. Canonical status requires complete lineage and explicit Product OS Owner approval.

Figma motion data is authoritative for recorded values. The implementation must honor `prefers-reduced-motion`, preserve state and completion information, validate one entire timeline before batching, and leave unsupported source motion visibly recorded rather than silently dropped.

Accepted names and identifiers are governed by [Product animation registries](animation-registry.md). An implementation refinement may version an animation but cannot silently rename its identity. A product's current production implementation may be a working behavior reference, but it is not thereby an accepted Norfolk visual master. The reusable registry, resolver, honest-progress, reduced-motion, assignment, and quality rules are accepted independently. A visual master remains deferred until a pinned comparison, reuse-rights approval, and immutable source-master preservation establish that narrower choice.
