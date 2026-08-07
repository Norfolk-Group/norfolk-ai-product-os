---
title: Repository security
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-04
---

# Repository security

This contract states required repository controls. A statement here is not evidence that a GitHub setting has already been configured; implementation and verification must be recorded separately.

## Change control

- Protect the default branch and prohibit direct human or automation writes.
- Require pull requests, current required checks, CODEOWNERS approval, resolved review conversations, and non-stale approval after material changes.
- Prevent force pushes and branch deletion on protected release and default branches.
- Use release environments with named human approval for publication.
- Keep accepted release manifests immutable, signed, and content-addressed; record actor, source commit, checks, and included standards.

## Automation identity

Automation uses repository-scoped, least-privilege, short-lived GitHub App or OIDC identities. It writes only to a named branch and opens a reviewable change. It may not use a broad personal token, read unrelated repositories, push directly to the default branch, approve itself, or expand permissions at runtime.

Unknown organizations, repositories, refs, actors, or classification fail before fetch or mutation. Private adoption consumes a pinned release bundle and verifies its signature and hashes; it never clones or executes unpinned Product OS head.

## Secrets and sensitive data

Keep credentials in approved secret management, never Git. Redact logs, errors, manifests, generated views, and review artifacts. Client evidence follows [Client boundaries](client-boundaries.md) before canonical commit. Large binary masters live in the approved object store; Git contains manifests, provenance, hashes, approved URLs, and small fixtures.

## Auditability

Security-relevant actions record attributable actor identity, time, target, source revision, requested permissions, approval, result, and correlation identifier. Failed preflights and denied operations are evidence and must not be hidden by retries.

## Destructive operations

Repository creation or migration credentials do not include deletion authority. Deletion, history rewriting, branch or PR removal, ruleset weakening, environment removal, and secret destruction require a separately scoped identity and exact human approval under [Approvals](approvals.md). Readiness or a cleanup recommendation is not authorization.

## Verification before release

Before a release, verify actual GitHub settings against this contract, exercise planted failures for direct default-branch writes, over-scoped identities, missing approval, bad signature or hash, unknown targets, and disclosure leakage, and retain the evidence with the release record.
