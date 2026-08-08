---
title: Presentation intermediate representation
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-08
---

# Presentation intermediate representation

## Purpose and authority

The presentation intermediate representation (IR) is Norfolk AI's vendor-neutral contract for expressing a presentation before a renderer produces PPTX, PDF, HTML, or image output. Product OS owns its semantics, governance, and verification requirements. Norfolk Kit or a product may implement renderers, editors, storage, and format adapters, but no renderer or product template becomes canonical by implementing this contract.

The canonical machine-readable profile is [`presentation-ir.schema.json`](../schemas/presentation-ir.schema.json). Its [`synthetic example`](presentation-ir.example.json) is Norfolk-owned and contains no client fields, brands, slot names, templates, assets, or identity. Canonical fixtures and evidence remain synthetic-only. Product data and instances stay in the adopting product under its authorization, confidentiality, retention, and output-job controls; they do not enter Product OS.

## Semantic before geometric

Author the durable `semantic` document first. It declares stable slide and element IDs, purpose, content, provenance, accessibility, reading order, overflow behavior, and theme-token intent without coordinates or renderer-specific structures. Every semantic element carries synthetic provenance in the canonical profile. Geometry in semantic content is invalid.

Derive `render` only from a validated semantic revision. Render IR links to that revision and to semantic IDs, then adds fixed-canvas primitives, point-based geometry, z-order, asset references, and style-token references. It does not redefine meaning, data bindings, provenance, or reading order. A semantic revision may be redesigned into new geometry without changing durable meaning or IDs.

Version 1 uses points with a top-left origin. Width, height, position, z-order, and rotation are explicit; every geometry object carries `rotationDegrees`, using `0` when unrotated. Omission is invalid. Percentages, implicit renderer defaults, and vendor-native object models are excluded. Renderers convert points at their output boundary.

## Stable identity and themes

Deck, revision, theme, slide, element, token, asset, and render-node IDs are stable, human-readable identifiers. Reordering is expressed separately from identity, and every semantic slide has a unique `order`. Every semantic slide must have render coverage, and every render slide must reference an existing semantic slide. One semantic slide maps to one render slide by default; only a semantic slide whose overflow strategy is `split` or `paginate` may map to multiple render slides. Their order in `render.slides` is the output sequence. Writers and renderers must reject duplicate IDs or orders, missing references or coverage, mismatched semantic revisions, and render nodes that cannot be traced to a semantic element.

JSON Schema checks each field's shape. The companion [`presentation.ts`](../tools/validate/presentation.ts) semantic validator enforces cross-document uniqueness, reference resolution, revision equality, and exact reading-order coverage of every non-decorative semantic element.

Themes are registries of semantic tokens. The canonical profile supports color, font, size, spacing, and stroke roles. Render geometry refers to tokens by ID; it does not embed a product brand or assume a vendor theme mechanism. A product resolves its authorized local theme outside Product OS.

## Governed assets

Assets are registry entries, never anonymous URLs or copied binaries. Each entry has a stable ID, kind, Norfolk registry reference, SHA-256 digest, ownership and rights-review record, and accessibility treatment. Canonical assets are Norfolk-owned synthetic placeholders. Asset-backed render primitives are explicit: `image` carries the same governed `assetId` as its semantic asset content and accepts only `image` or `svg`; `chart` carries the same governed data asset as its semantic chart content and accepts only `data`. Other primitives cannot attach an asset. A renderer must resolve assets before rendering, verify their hashes and governance, and fail closed on missing, changed, incompatible, unapproved, inaccessible, or remotely fetched assets.

## Accessibility and overflow

Every slide declares a language, accessible title, and explicit reading order over non-decorative semantic elements. Each element declares whether it is decorative and otherwise supplies an accessible name. Reading order is semantic and remains stable when geometry changes.

Overflow must use an explicit strategy: reflow, split, paginate, truncate with disclosure, or fail. Every strategy preserves the declared typography floor. Silent clipping, off-canvas content, undisclosed truncation, and unlimited shrinking are invalid. The renderer verifies bounds and overflow after fonts and assets resolve.

## Deterministic rendering and verification

Finalized IR pins canonical JSON serialization, semantic and render hashes, renderer identity and version, configuration hash, random seed, fixed clock, and a no-external-fetch rule. The same validated input and renderer configuration must produce the same bytes and output SHA-256 digest.

Before an output may be delivered, the renderer records passed checks for:

- schema validity and semantic-to-render linkage;
- asset integrity, canvas bounds, and overflow behavior;
- reading order, contrast, and font availability;
- output format, a slide count exactly equal to `render.slides.length`, and output digest.

Unknown checks, missing evidence, pending or failed status, hash drift, nondeterministic inputs, or renderer substitution block delivery. Format-specific verification still applies; for example, PPTX also verifies native reading order, speaker notes, editability where required, and PDF export parity.

## Client-evidence boundary

The architecture was evaluated against pinned, read-only product evidence and then reauthored as a Norfolk-owned contract. That evidence did not donate code or canonical content. Its domain fields, brands, slot names, templates, assets, identity, and product-specific renderer choices remain excluded. Only the abstract decision to separate durable semantics from derived geometry, backed by independent Norfolk schema and synthetic fixtures, is accepted.
