---
title: Repository lifecycle
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-05
---

# Repository lifecycle

Repositories move through proposed, active, maintenance, superseded, archived, and deleted states. A state change names owner, canonical successor, consumers, open work, security posture, and recovery path. “Old” or “small” is not retirement evidence.

Before archive or deletion, create and verify a restorable preservation bundle covering exportable refs, tags, branches, pull-request metadata and patches, issues, releases, settings, rules, workflows, environments, webhooks, package/container references, dependency relationships, unique content, and externally stored large assets. Prove current consumers no longer depend on the repository and successor links resolve. Preserve legal or contractual material according to lifecycle policy.

Archive, unarchive, delete, transfer, visibility change, branch deletion, PR closure, and destructive content migration are separate target-specific actions. Each requires explicit human approval that names repository and action after the evidence is presented. Approval of a plan, another repository, or a previous action cannot be reused.
