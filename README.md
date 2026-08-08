# Norfolk AI Product OS

Norfolk AI Product OS is the private, canonical source for how Norfolk AI understands, designs, builds, governs, verifies, and improves digital products.

It owns product doctrine and the reasons behind it: product method, design, architecture, security, data, agent-native behavior, outputs, governance, and adoption contracts. It does not contain a starter application. [Norfolk Kit](https://github.com/Norfolk-Group/norfolk-kit) is the executable reference implementation of released Product OS versions, and product repositories adopt explicit Product OS and Kit versions with local exceptions.

## Current status

The repository source has advanced beyond immutable `0.3.0-candidate.4`. That candidate remains historical evidence and does not contain the later accepted U11 contracts. A new signed candidate is required after the current changes merge. Until a trusted versioned release is published, content marked `accepted` is authoritative for this repository but is not automatically adopted by Kit or any product.

Norfolk AI owns this repository and its reusable intellectual property. KIT Capital, H-Analytics, and other accounts are clients or products, not Norfolk AI identity and not automatic sources of canonical standards. Client-derived learning must pass the [promotion](governance/promotion.md) and [client-boundary](governance/client-boundaries.md) gates before it can enter the canon.

## Start here

- [Documentation index](docs/README.md) — the router to canonical knowledge
- [Fundamental governance](governance/fundamental-governance.md) — authority, precedence, ownership, and lifecycle
- [Knowledge tiers](governance/knowledge-tiers.md) — binding contracts, references, and freshness
- [Approvals](governance/approvals.md) — who may approve consequential changes
- [Exceptions](governance/exceptions.md) — bounded departures from adopted standards
- [Promotion](governance/promotion.md) — how product learning becomes Norfolk doctrine
- [Client boundaries](governance/client-boundaries.md) — ownership, disclosure, and sanitization
- [Repository security](governance/repository-security.md) — trust and change-control requirements
- [Decision records](decisions/0001-product-os-is-canonical.md) — why Product OS is canonical

## Repository roles

| Repository type | Owns | Does not own |
|---|---|---|
| Product OS | Norfolk-wide WHAT and WHY, versioned standards, governance, rationale, and adoption contracts | Application scaffolding or client-specific rules |
| Norfolk Kit | Executable HOW: starter, components, integrations, modules, tests, and adoption tooling | Portfolio-wide doctrine |
| Product repository | Product context, client data, implementation, adopted versions, and approved local exceptions | Automatic authority over Product OS or other products |
| Generated handbook/catalog | Private, readable view generated from canonical source | Independently editable policy |

## Working in this repository

Read [AGENTS.md](AGENTS.md) before making changes. Work on a branch, keep durable decisions in the indexed documents, and use a new decision record to supersede an accepted decision rather than rewriting its history. Generated handbook and catalog files are outputs; edit their canonical sources instead.

No migration or creation work authorizes deletion. `norfolk-starter` was subsequently deleted outside the Product OS retirement workflow; its incomplete pre-deletion dossier remains preserved as evidence. `norfolk-manual` remains a retirement candidate, but it requires preservation and parity evidence followed by exact, explicit approval before any destructive action.

## Accountable owner

The initial **Product OS Owner** is **Ricardo Cidale**. The owner approves releases, resolves authority and exception disputes, assigns freshness reviewers, and may delegate reviews without transferring Norfolk AI ownership.
