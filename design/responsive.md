---
title: Responsive design
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-05
---

# Responsive design

Mobile is a first-class surface, not a shrunken desktop. Every contract describes mobile, tablet, and desktop evidence and names unsupported behavior explicitly.

## Mobile requirements

- Interactive targets are at least 44×44px.
- Layout honors viewport and device safe areas.
- Reading order, keyboard order, and screen-reader order remain intentional after reflow.
- Dense grids choose a documented strategy: prioritized columns, horizontal scroll with context, stacked record, or task-specific mobile view.
- Fixed actions do not cover content or the on-screen keyboard.
- A desktop copilot side panel becomes a sheet or equivalent mobile surface with focus return, dismiss behavior, and preserved work state.

## Breakpoints and content

Breakpoints follow content failure rather than named devices. Record the widths used for review and why the layout changes there. Focus surfaces remain bounded as viewports grow. Scan surfaces may expand while maintaining stable columns and readable line length.

## Responsive evidence

Review navigation, dialogs, forms, tables, charts, authentication, errors, long content, localization expansion, zoom, reduced motion, and virtual keyboard behavior. Passing a single home-page screenshot does not establish responsive conformance.
