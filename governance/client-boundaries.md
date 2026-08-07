---
title: Client boundaries
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-04
---

# Client boundaries

## Ownership

Norfolk AI owns Product OS, Norfolk Kit, and reusable Norfolk intellectual property. KIT Capital is a client account. H-Analytics is a product and validation source associated with client work. Neither is Norfolk AI identity, a co-owner of Product OS, or an automatic source of portfolio standards.

Client agreements and applicable law remain controlling for client material. When ownership or reuse rights are unknown, classification fails closed and the material stays outside canonical history.

## Material excluded from canon by default

- client names, brands, logos, palettes, domains, URLs, and contact details;
- credentials, secrets, identifiers, customer or employee data, and financial data;
- client-specific calculations, workflows, permissions, business rules, and personas;
- screenshots, documents, images, source paths, commit metadata, or examples that reveal client identity directly or indirectly;
- client code copied as a purported Norfolk default without provenance, rights, sanitization, and approval.

Visual similarity or removal of a visible name is not sufficient sanitization. Intake must inspect structured identifiers, URLs, paths, image metadata, document properties, encoded values, and semantic combinations that could disclose the source.

## Permitted learning

A reusable behavior or insight may be proposed through [Promotion](promotion.md) only after rights classification, minimum-necessary extraction, synthetic replacement, machine checks, and human disclosure review. The canonical record describes the general problem and evidence without exposing the client.

Client repositories may adopt Norfolk releases and retain local exceptions. Their code and data do not flow back upstream by default. Client approval of a product change does not substitute for Norfolk AI approval of a canonical promotion.

## Review outcome

Every intake ends as `blocked`, `client-local`, `sanitized proposal`, or `approved canonical`. Ambiguous evidence remains `blocked`. Review records identify the source privately without placing the sensitive payload in the canonical repository.
