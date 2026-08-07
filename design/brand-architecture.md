---
title: Brand architecture
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-06
---

# Brand architecture

Product OS supports both a complete Norfolk AI master brand and a customer master brand. Neither owns the neutral product foundation: accessibility, state behavior, responsive composition, data truth, progress semantics, and component contracts survive every brand.

## Brand modes

- **Norfolk master:** the ready-to-use identity when a customer chooses Norfolk AI's complete product language.
- **Client master:** the customer's approved identity applied through bounded semantic tokens and governed assets.
- **Incomplete client master:** Norfolk derives a coherent client system from the evidence supplied. It uses neutral foundation values for unresolved decisions and does not visibly mix recognizable Norfolk styling into the client identity.

The canonical visible company name is **Norfolk AI**. Official Norfolk logos, colors, typography, imagery, and expressive visual masters remain deferred to the future Claude Design engagement. Until accepted assets exist, implementations use neutral semantic placeholders and must not invent an official Norfolk palette.

## Product, organization, and endorsement identity

A product has one global name and primary app logo across its instances. Super Admin governs that product identity, previews it across light/dark, navigation, authentication, reports, and exports, and can restore a prior approved version. An organization may have a secondary name, logo, accent, and imagery only where the product contract permits it; organization identity never renames the product.

Every client-branded and Norfolk-branded product carries **Powered by Norfolk AI**. It links to `https://www.norfolk.ai`, opens in a new tab in interactive surfaces, and cannot be removed by theme, customer configuration, or a white-label setting. Use restrained placement on identity surfaces such as login, launch, About, and footer. Reports and exports carry the endorsement in the footer; non-interactive formats print `norfolk.ai`.

## Appearance and hierarchy

Light and dark are first-class brand variants. First use follows system preference and later honors the saved user choice. A single-mode deployment requires an approved exception with accessibility evidence.

In a client-branded product, the product identity remains primary, contextual organization identity is secondary, and the Norfolk endorsement is quiet but persistent. Client and organization layers may set identity expression; they cannot override accessibility, truthful states, interaction behavior, chart meaning, report provenance, or other foundation safeguards.

The machine-readable example is [`brand-profile.example.json`](brand-profile.example.json); its contract is [`brand-profile.schema.json`](../schemas/brand-profile.schema.json).
