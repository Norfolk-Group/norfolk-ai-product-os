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
| `Norfolk-Group/norfolk-ai-product-os` | private | active, PR #1 merged | `main` | `692b94a3878cc3505f5ce95582ca1a91b3516da7` |
| `Norfolk-Group/norfolk-kit` | private | active, PR #1 merged | `main` | `848d8e71dca8cc1de72a123b6444f8fe5e08af70` |
| `Norfolk-Group/norfolk-manual` | private | active | `main` | `b397f6e3d5e00d2be9ee608356f892daaca8dcd2` |
| `Norfolk-Group/norfolk-starter` | **public before deletion** | deleted; no longer resolves | `main` before deletion | `3788ec74763018b73f4051613d90c0005874388b` |

Starter was deleted outside the Product OS retirement workflow after this register captured its final reviewed main ref. The incomplete retirement dossier is retained as historical evidence rather than being rewritten as successful. Product OS and Kit PR #1 are merged. Manual was audited at its pinned main ref; no unique current doctrine was found, but deletion remains blocked by incomplete all-ref preservation, settings/consumer evidence, safe restoration, and exact approval. No Product OS release is published.
