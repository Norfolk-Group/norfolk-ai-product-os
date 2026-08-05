---
title: Migration source register
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-05
---

# Migration source register

The machine-readable [`source-register.json`](source-register.json) records every source used or evaluated before the first Product OS release. A source requires ownership, sensitivity, evidence, pinned repository ref, disposition, approval, and destination. Promotion is fail-closed: pending, client-confidential, or destination-less material cannot become canonical.

GitHub MCP confirmed on 2026-08-05:

| Repository | Visibility | State | Default branch | Recorded ref |
|---|---|---|---|---|
| `Norfolk-Group/norfolk-ai-product-os` | private | active, empty upstream | `main` | local candidate only; not pushed |
| `Norfolk-Group/norfolk-kit` | private | active | `main` | `f2680624596048a88f78e2a77b2a7e3d1d4aeed5` |
| `Norfolk-Group/norfolk-manual` | private | active | `main` | `b397f6e3d5e00d2be9ee608356f892daaca8dcd2` |
| `Norfolk-Group/norfolk-starter` | **public** | archived | `main` | `3788ec74763018b73f4051613d90c0005874388b` |

The Starter being public and already archived is a discovered fact, not a deletion approval. The Product OS and Kit commits in this worktree remain local.
