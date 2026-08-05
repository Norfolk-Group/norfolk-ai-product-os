---
title: Product recommendations
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-05
---

# Product recommendations

A recommendation is a reviewable proposal, never a disguised observation or automatic mutation.

## Required record

Every recommendation names:

- the proposed change;
- one or more source observation IDs;
- the product goal it advances;
- confidence, expected impact, and effort;
- risk and at least one alternative;
- affected routes, workflows, outputs, or roles;
- accountable owner;
- approval state and review date.

Use `proposed`, `approved`, `rejected`, `deferred`, or `invalidated`. An agent may draft and rank recommendations; it cannot approve them.

## Prioritization

Rank with evidence, not visual novelty. Product value, risk reduction, access correctness, user effort, decision quality, and reversibility matter more than how impressive a change appears. State uncertainty and competing evidence plainly.

## Traceability and expiry

The source observations and goal must remain addressable. If any premise is invalidated, the recommendation returns to `invalidated` until re-evaluated. Review dates prevent old proposals from masquerading as current direction.
