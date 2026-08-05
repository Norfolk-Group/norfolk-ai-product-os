---
title: Compatibility
status: accepted
tier: CONTRACT
owner: Architecture Owner
lastVerified: 2026-08-05
---

# Compatibility

Compatibility is declared, never inferred. The matrix names Product OS range, Kit range, application prerequisites, required migrations, known incompatibilities, validation level, and rollback window. Unknown combinations fail before bundle extraction or repository write.

Compatibility covers contracts, runtime/tool versions, auth/session shape, database expand-and-contract window, module versions, output schemas, and adoption-tool protocol. A local exception remains visible and is re-evaluated; it is not silently removed by a compatible upgrade.
