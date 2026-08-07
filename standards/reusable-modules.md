---
title: Reusable modules
status: accepted
tier: CONTRACT
owner: Architecture Owner
lastVerified: 2026-08-05
---

# Reusable modules

A reusable module is an independently governed capability, not a copied folder. It declares purpose, owner, lifecycle status, Product OS/Kit compatibility, schema and migrations, authorized procedures, UI/tRPC/MCP exposure, human-only actions, configuration, secrets, telemetry, accessibility, data lifecycle, tests, upgrade, rollback, and clean removal.

Modules are disabled by default unless foundational. Enabling is idempotent and validates dependencies; disabling stops new work, preserves or disposes data according to contract, removes routes/tools/jobs, and leaves no orphan permissions or secrets. Removal is tested. Products may configure presentation and bounded policy but cannot fork shared authorization invisibly.

Animation assignment, document management, photo workflows, finance, and similar optional capabilities use this contract before promotion into Kit. Client-specific behavior remains product-local until sanitized, evidenced, and approved for Norfolk reuse.
