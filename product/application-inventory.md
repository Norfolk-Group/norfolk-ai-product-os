---
title: Application inventory
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-05
---

# Application inventory

The inventory is the structured current-state map validated by [`application-inventory.schema.json`](../schemas/application-inventory.schema.json). Every existing item links to one or more observation IDs.

## Required collections

- routes, pages, and views;
- primary, secondary, nested, and contextual navigation;
- roles, permissions, owners, and administrative surfaces;
- dialogs, forms, drawers, collapsible regions, cards, tables, and charts;
- APIs, procedures, integrations, events, and background work;
- reports, exports, emails, print, and generated artifacts;
- reusable component and token patterns, duplicates, and deviations;
- state coverage: default, hover, focus, active, disabled, loading, error, empty, success, cancel, timeout, offline, and reduced motion where applicable.

An empty collection is valid only when it means “observed and none found” or the product is explicitly greenfield. “Not yet checked” is a coverage gap, not an empty fact.

## Completion and invalidation

The inventory owner signs off on coverage. New evidence that materially changes a route, workflow, role, permission, or output invalidates the affected IA and recommendations and returns them to review.
