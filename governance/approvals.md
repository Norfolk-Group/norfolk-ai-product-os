---
title: Approval policy
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-04
---

# Approval policy

## Accountable roles

- **Product OS Owner:** initially Ricardo Cidale. Approves Product OS releases, authority changes, accepted standards and decisions, compatibility policy, promotions, and disputed exceptions.
- **Product owner:** approves a product's adoption, local implementation, and product-local exceptions within authority delegated by Norfolk AI and the client agreement.
- **Security or data owner:** approves scoped security, privacy, retention, legal-hold, and destructive-data decisions when assigned.
- **Reviewer:** supplies evidence or review but does not gain approval authority merely by reviewing.

Delegation must be written, scoped, attributable, and revocable. A client approver cannot approve client material as Norfolk AI intellectual property.

## Required human approval

Human approval is mandatory for:

- accepting or superseding CONTRACT standards and decisions;
- publishing a Product OS release or declaring Kit compatibility;
- approving, renewing, or revoking an exception;
- accepting a promotion proposal, especially one derived from a client or product;
- changing protected-branch, owner, required-check, release-environment, signing, or identity policy;
- payments, legal commitments, external communications, production migrations, credential or authorization changes, and other consequential outward actions;
- baseline changes that alter approved visual or behavioral evidence;
- destructive actions, including repository, branch, PR, asset, history, data, or environment deletion.

Automation may prepare evidence and a reviewable proposal. It may not grant its own approval, widen its identity, bypass a required check, or convert silence into consent.

## Decision record

An approval records the exact target, proposed action, approver identity, timestamp, evidence reviewed, scope, conditions, and expiry where applicable. Approval for one action or target does not authorize a related action. “Ready for deletion decision” is a readiness state, not permission to delete.

## Conflicts and uncertainty

Fail closed when approver identity, authority, scope, client ownership, or target is unclear. Preserve the current state and route the decision to the Product OS Owner or the separately accountable security, data, or client owner.
