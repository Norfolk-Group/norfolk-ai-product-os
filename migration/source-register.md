---
title: Migration source register
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-07
---

# Migration source register

The machine-readable [`source-register.json`](source-register.json) records every source used or evaluated before the first Product OS release. A source requires ownership, sensitivity, evidence, pinned repository ref, disposition, approval, and destination. Promotion is fail-closed: pending, client-confidential, or destination-less material cannot become canonical.

GitHub and the local upstream refs confirmed through 2026-08-07:

| Repository | Visibility | State | Default branch | Recorded ref |
|---|---|---|---|---|
| `Norfolk-Group/norfolk-ai-product-os` | private | active, draft PR #1 | `main` | `21a972efd68c5c565c8724e41ea23270dead7f0e` |
| `Norfolk-Group/norfolk-kit` | private | active, draft PR #1 | `main` | `f13a47590342042cb34816c899823994f265e1bb` |
| `Norfolk-Group/norfolk-manual` | private | active | `main` | `b397f6e3d5e00d2be9ee608356f892daaca8dcd2` |
| `Norfolk-Group/norfolk-starter` | **public before deletion** | deleted; no longer resolves | `main` before deletion | `3788ec74763018b73f4051613d90c0005874388b` |

Starter was deleted outside the Product OS retirement workflow after this register captured its final reviewed main ref. The incomplete retirement dossier is retained as historical evidence rather than being rewritten as successful. Product OS and Kit feature branches are pushed for draft review; neither PR is merged and no release is published.
