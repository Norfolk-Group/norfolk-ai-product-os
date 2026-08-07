---
title: Accessibility
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-05
---

# Accessibility

WCAG 2.2 AA is the minimum product contract, not the ceiling. Accessibility is designed with each pattern and state; it is not a final audit layer.

## Required behavior

- semantic structure and accessible names;
- complete keyboard operation, visible focus, logical order, and focus restoration;
- screen-reader state, error, progress, and completion announcements without noise;
- text and non-text contrast across themes and states;
- zoom, text resize, reflow, and localization resilience;
- touch targets of at least 44×44px on mobile;
- reduced-motion behavior that preserves meaning and completion information;
- charts and visualizations with accessible summaries, data access, and non-color encoding;
- authentication and recovery that remain operable without precision, memory tricks, or inaccessible time pressure.

## Evidence

Automated checks catch only part of the contract. Acceptance combines semantic and keyboard tests, screen-reader review for material flows, contrast evidence, viewport/zoom review, and human visual inspection. Record browser, assistive technology, viewport, theme, state, and result.

An exception names the user impact, scope, owner, mitigation, expiry, and migration consequence. “Third-party component” is not an exemption.
