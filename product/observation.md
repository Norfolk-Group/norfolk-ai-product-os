---
title: Product observation
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-05
---

# Product observation

The first application pass is inventory-only. Its purpose is to establish a defensible current state before any agent recommends changes.

## Observation record

Each observation has a stable ID, one factual statement, and at least one source type and locator. Useful locators include a route, source path, reproducible runtime step, screenshot manifest, interview record, generated artifact, or approved document. Record capture time when the source can change.

An observation may say “the navigation contains nine top-level items.” It may not say “the navigation is cluttered” or “reduce it to five.” The first is a fact; the others are interpretation and recommendation.

## Coverage

Observe routes, nested navigation, roles, permissions, administrative surfaces, dialogs, forms, progressive disclosure, components, states, APIs, jobs, long-running work, reports, exports, emails, generated artifacts, tokens, themes, responsive behavior, accessibility behavior, inconsistencies, and duplicates.

## Greenfield rule

When no UI exists, record that fact once and keep the observation and current-state inventory collections empty. Product and domain evidence can still support a future IA proposal, but no route, screen, component, or behavior is described as observed.

## Exit gate

Observation is complete when evidence is reproducible, sensitive sources are classified, coverage gaps are explicit, and no recommendation language remains in the observation log.
