# Agent operating contract

This file routes agents to durable Product OS knowledge. It does not duplicate that knowledge.

## Before any change

1. Read [README.md](README.md) and [docs/README.md](docs/README.md).
2. Read [fundamental governance](governance/fundamental-governance.md), then the CONTRACT documents governing the affected area.
3. Check [decision records](decisions/0001-product-os-is-canonical.md) and active exceptions before proposing a conflicting change.
4. Distinguish observed facts, recommendations, approvals, and generated evidence.
5. Work on a branch. Never write directly to the default branch or weaken required review controls.

## Binding behavior

- Product OS owns Norfolk-wide WHAT and WHY; Norfolk Kit owns executable HOW.
- Preserve Norfolk AI ownership. Treat KIT Capital, H-Analytics, and every other account as a client or product unless an approved record states otherwise.
- Fail closed on unknown ownership, source classification, permission, or disclosure risk.
- Promote client-derived learning only through the documented proposal, sanitization, disclosure review, and Norfolk approval process.
- Never treat generated handbook or catalog output as editable source.
- Never silently rewrite an accepted decision; add a superseding decision record.
- Never silently restyle a product, erase a local exception, overwrite an edited managed file, or adopt an unpinned release.
- Never delete a repository, branch, PR, source asset, or historical variant under a migration, tidy, adoption, or creation instruction. Destructive work requires a separate, target-specific approval.

## Change routing

| Change | Read first |
|---|---|
| Authority, precedence, or lifecycle | [Fundamental governance](governance/fundamental-governance.md) |
| Tier or freshness metadata | [Knowledge tiers](governance/knowledge-tiers.md) |
| Consequential action or release | [Approvals](governance/approvals.md) |
| Departure from an adopted contract | [Exceptions](governance/exceptions.md) |
| Learning from Kit or a product | [Promotion](governance/promotion.md) and [client boundaries](governance/client-boundaries.md) |
| Automation, release, or repository access | [Repository security](governance/repository-security.md) |
| New durable choice | [Decision records](decisions/0001-product-os-is-canonical.md) |

Keep prompts and bridge files small. Put durable rules in the indexed canonical documents and link to them.
