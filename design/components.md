---
title: Component contracts
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-05
---

# Component contracts

Every reusable primitive or composite has one specimen record validated by [`component-specimen.schema.json`](../schemas/component-specimen.schema.json).

## Required record

- purpose, permitted uses, and forbidden uses;
- source path and Storybook/artifact mapping;
- shadcn primitive or documented custom basis;
- variants and sizes;
- applicable state behavior, with rationale for every non-applicable state;
- keyboard and screen-reader behavior;
- mobile, tablet, and desktop treatment;
- reduced-motion behavior;
- token dependencies and theme coverage;
- governed deviations and known product use.

## shadcn input control

Record registry source, upstream version or commit, SHA-256 content hash, resolved hash, installed files, and local deviations. An upgrade is a reviewed source change, not a blind CLI refresh. A hash mismatch blocks reproduction and acceptance.

## Custom components

Custom work is justified when reviewed primitives cannot satisfy the product or accessibility requirement. It must still use canonical tokens, interaction grammar, state records, and evidence. “Looks different” is not sufficient rationale.

## Ownership

Product OS owns this contract. Kit owns executable reference components and tests. Product repositories own their composed product behavior and approved local exceptions. A product implementation becomes reusable only through promotion.
