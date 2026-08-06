---
title: Identity and media assets
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-06
---

# Identity and media assets

Products provide a governed Asset Manager rather than isolated upload controls. Super Admin can create, read, update, organize, approve, replace, restore, share, and delete logos, photos, and other supported files. Platform assets and organization-private assets are isolated at storage, query, preview, export, and delivery boundaries; interface hiding is never the authorization control.

## Three-choice transformation

Every AI-processed asset follows the same interaction:

1. preserve the private original;
2. validate rights, file type, size, safety, and quality;
3. generate three compliant candidates;
4. preview them in every material context;
5. let the authorized person explicitly select one;
6. regenerate another set of three when none is suitable;
7. preserve selections and prior generations for audit and rollback.

The selector is role-specific: Super Admin selects product and authoritative assets; an authorized organization administrator may propose organization identity; a person selects their own portrait; an owner selects imagery for their private imported record. A proposal does not become active where Super Admin approval is required.

## Logos and organization identity

Logo processing may normalize crop, padding, safe area, container, contrast, file format, size, and light/dark presentation. It preserves the recognizable mark. Redrawing or recoloring requires explicit approval. One selected canonical treatment produces the technical variants; products do not use unrelated marks on different screens.

An organization identity pack may contain approved name, logo, accent, and imagery. The app may propose an accessible accent palette from a logo, but Super Admin approves activation. Product typography, navigation, components, charts, motion, and accessibility remain product-owned. When no logo exists, use an intentional typographic monogram or neutral product placeholder, never a broken image or misleading stock asset.

## People and portraits

A profile photograph is always optional. The person explicitly chooses **Create professional portrait**, reviews three identity-faithful candidates, may regenerate up to the product allowance, and selects the active portrait. Processing may improve lighting, exposure, framing, background, resolution, and natural photographic quality. It must not silently change age, ethnicity, facial structure, or recognizable identity.

Manual crop, filters, and appearance editing are not offered. The product owns a consistent portrait composition and background standard. Compact surfaces use a circular crop; larger profile contexts use the approved softly rounded treatment from the same selected portrait.

The permanent fallback is a letter avatar: first and last initials where available, otherwise the first two characters of the single display name. It is used by preference, before upload, after deletion, on processing failure, or after moderation. Super Admin may remove a noncompliant portrait and restore the initials fallback, but cannot select a different likeness for the person.

Originals and generated portraits are never used for model training, marketing, or unrelated analysis. An external processor must provide no-training terms, minimal retention, encrypted transfer, sensitive-log exclusion, and verifiable deletion; missing guarantees stop processing. Deleting all portrait imagery retains only a non-image audit event.

## Property and factual imagery

Property imagery may improve crop, exposure, resolution, color balance, and non-factual distractions. It must not invent renovations, erase defects, alter structures, or misrepresent condition. Enhancement disclosure belongs in provenance metadata and material report notes, not as a badge or watermark over the clean render. Authorized users can retrieve the original.

## Sharing and deletion

Private assets stay private. Sharing is recipient-specific, revocable, optionally expiring, non-reshareable, and requires the approval named by the product contract. Deletion first creates a recoverable archive. Permanent purge is blocked while an asset is referenced by a product, profile, record, scenario, report, export, or required evidence; Super Admin controls final purge under the retention contract.

The executable contract is [`media-asset-workflow.schema.json`](../schemas/media-asset-workflow.schema.json) with [`media-asset-workflow.example.json`](../standards/media-asset-workflow.example.json).
