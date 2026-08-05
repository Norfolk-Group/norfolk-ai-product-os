---
title: Observation log template
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-05
---

# Observation log template

One row contains one fact. Move interpretations and recommendations to their own records.

| Observation ID | Factual statement | Source type | Reproducible locator | Captured at | Sensitivity | Confidence | Coverage area |
|---|---|---|---|---|---|---|---|
| `obs-` | | route/code/runtime/screenshot/interview/artifact/document | | | | | |

## Coverage gaps

List anything not observed. For a greenfield product, record that no existing UI exists and do not invent observation rows.

## Category check

- [ ] No “should,” “better,” “simpler,” “cluttered,” or solution language remains.
- [ ] Every row has a source and locator.
- [ ] Sensitive evidence passed the client-boundary gate.
