---
title: Exceptions
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-04
---

# Exceptions

An exception is a bounded, reviewable departure from a CONTRACT standard in an adopting product. It is not an undocumented preference, a permanent fork, or permission to change the Product OS.

## Required record

Every exception records:

- stable identifier and lifecycle state;
- owning product and accountable owner;
- affected Product OS version and standard;
- exact scope and rationale;
- risk, user and business impact, and compensating controls;
- approval and approver;
- review or expiry date;
- migration and rollback consequence;
- links to evidence and later renewal, revocation, or resolution events.

## Lifecycle

`proposed` → `approved` → `expired`, `revoked`, or `resolved`.

Renewal appends an event and updates the review or expiry date; it does not erase earlier approval history. Security and client-boundary exceptions block on expiry. Lower-risk exceptions warn until their declared review gate, but may not be described as current compliance when their status is unknown.

## Limits

Exceptions cannot transfer Norfolk AI ownership, expose client data, authorize unlawful behavior, remove an approval owned by another accountable role, permit silent consumer rewrites, or bundle destructive action. A proposed exception to these boundaries must be rejected or handled as a new governing decision by the proper authority.

Adoption tooling must preserve approved product-local exceptions. A later Product OS or Kit release may propose resolving an exception but cannot overwrite it silently.
