# Motion source inventory — 2026-08-05

Publication: **blocked**. This exact-identity source inventory is validation evidence only and is excluded from release inputs and generated outputs.

Status: **recovered and locally hashed; not yet preserved to immutable R2 versions; no source is canonical solely because it appears here.** Original files were read only and retained in place.

## Source aliases

- `FIGMA_LOCAL` — local `Projects/H-_Figma_Design` directory; creative-intent and exported-work evidence.
- `H_ANALYTICS` — local H-Analytics repository; client-context production evidence requiring the client-boundary and reuse-rights gate before canonical promotion.
- `KIT` — Norfolk Kit worktree; portable implementation and preservation evidence.

Absolute personal paths are intentionally excluded from this repository. A local-only recovery map may resolve aliases during preservation.

## Figma Make creative-intent masters

| Logical source | SHA-256 |
|---|---|
| `FIGMA_LOCAL/Rebecca and Analyst Animated Icons.make` | `c87b7320703f6accbf4bcbb5c760ce5eda26786395f486beacc46a0a7db03631` |
| `FIGMA_LOCAL/Create animated icons.make` | `ea564c6d3f0431ba723bb32c7f42ab5b7853cbe69086b66e1452ff6f8e94f4f6` |
| `FIGMA_LOCAL/Create animated icons (1).make` | `3bb1f346dfa42a77e529ebbdd6c9ed45d70107d149fafd7611d57b27bfe86bb8` |
| `FIGMA_LOCAL/Create animated icons (2).make` | `4a8f795ad7bae2b871ace1609c961e63eab61dd04b7d81011d48c93e6fcf47f8` |
| `FIGMA_LOCAL/Create animated icons (3).make` | `8922d2db3df55a3a9c4f8b45620c2b86c82d9d56f5ef5c257680ef4e47cc3ba1` |
| `FIGMA_LOCAL/untitled folder/Create animated icons (1).make` | `5b06a6aea082fc696a43a7f9c6d7d0d6458c9d03410b015966c87cb288a52fe3` |

The newest/largest archive has a blank thumbnail. Quality must be judged from editable content and verified playback, never timestamp, size, or thumbnail alone.

## Replit handoff evidence

The local Replit export contains the Rebecca and Analyst families. One traced example, `AnalystCubeR3F.tsx`, has SHA-256 `f2ba0a5656a0b3976afae3ef5b78dabb256b0f43431464b38550b88f728e5599`; the H-Analytics timestamped attachment is byte-identical. The Kit `_replit-export` copy has SHA-256 `73b312510d16f776dc86f9aad5dc0bfe2afbb4234ae74e6d487b821f1d6801e2`, so it is a derivative or normalized preservation copy, not an immutable substitute for the original export.

## H-Analytics production evidence

| Logical source | SHA-256 | Finding |
|---|---|---|
| `H_ANALYTICS/.../graphics/AnalystCubeIcon.tsx` | `71aafa1b7584e8352d02e90e513fdd444b1bdeb855768c76133744706eb27120` | Byte-identical to current Kit portable component |
| `H_ANALYTICS/.../agent-animations/RebeccaAdvancedOrbit.tsx` | `850acc19f4bb76e8f7a58b2e4fee37a55102591cfdb5d1d6c9dd5314d7d64be3` | Byte-identical to current Kit portable component |
| `H_ANALYTICS/.../intelligence/AnalystProgressHUD.tsx` | `b23336f249495830b73066e1c464d661b08b158124722ce57621be3480ea0e3c` | Production long-process surface candidate |
| `H_ANALYTICS/.../intelligence/CategoryProgressDialog.tsx` | `c7c1dfcde7a68abb77915519296ceb64e9263db862a84ec76ddd7e5be2446bcb` | Production blocking-progress candidate |
| `H_ANALYTICS/.../intelligence/CategoryProgressPill.tsx` | `b36d18190a2a87b15880791851cc98cb04b8c1015ac63203151779df8d649f60` | Production persistent-progress candidate |
| `H_ANALYTICS/.../admin/brand-assets/animationCatalog.tsx` | `4ee8fae791b66a69645377b2cff1846234f9fa01b10e74407bbe4bdda1372b0b` | Production catalog and assignment evidence |

These records support the working belief that H-Analytics has the strongest complete production behavior. They do not override the possibility that Figma holds stronger creative intent.

## Selected reconciliation candidate

`RebeccaAdvancedOrbit` is the first fully traced candidate:

- creative-intent family: `FIGMA_LOCAL/Rebecca and Analyst Animated Icons.make`, SHA-256 `c87b7320703f6accbf4bcbb5c760ce5eda26786395f486beacc46a0a7db03631`;
- best original exported implementation: `FIGMA_LOCAL/RebeccaAdvancedOrbit.tsx`, SHA-256 `50497c9c110fd54a83565b851a2f6252d46c2190d03b05e012496df67211c951`;
- best known production implementation: `H_ANALYTICS/.../RebeccaAdvancedOrbit.tsx`, SHA-256 `850acc19f4bb76e8f7a58b2e4fee37a55102591cfdb5d1d6c9dd5314d7d64be3`;
- portable preservation: `KIT/src/components/animations/RebeccaAdvancedOrbit.tsx`, byte-identical to the production implementation.

The exported and production files differ by 19 inserted and 40 removed lines. This establishes distinct lineage, not superiority. Visual, timing, easing, reduced-motion, and client-boundary review remain required before approval; candidate status is intentionally retained.

## Preservation gate

R2 preservation is **pending** because no scoped bucket/account target or credential is configured in this workspace. The next preservation action must:

1. use a Norfolk AI-controlled versioned bucket and immutable retention policy;
2. upload by logical source ID without rewriting or moving the local original;
3. record object version and checksum;
4. retrieve the object independently and confirm the same checksum;
5. stop on any mismatch and leave every original untouched.

No deletion, archival, reconciliation overwrite, or canonical approval is authorized by this inventory.
