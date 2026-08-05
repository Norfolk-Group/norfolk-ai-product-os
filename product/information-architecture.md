---
title: Information architecture
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-05
---

# Information architecture

Information architecture is a separate product discipline between inventory and design. It asks whether the current structure deserves to exist before visual work hardens it.

## Analysis questions

- Does each route support a product goal or required responsibility?
- Should a route, view, or workflow remain, merge, split, move, or disappear?
- Can navigation lose entries or levels without hiding necessary work?
- Are administrative functions grouped coherently?
- Do roles and permissions match responsibility and least privilege?
- Does progressive disclosure reduce complexity without concealing material information?
- Are reports and exports located where the decisions they support are made?

## Required proposal

The IA proposal contains a route model, menu tree, workflow map, role-permission model, disposition for existing surfaces, evidence links, conflicts, migration implications, and open questions. Every gated route names its permission owner and roles. A menu cannot reference an unowned or undefined route.

## Approval gate

The accountable product owner approves the route, menu, role, permission, and workflow model. Only an approved IA record with a stable approval ID may advance to `design-contract-ready`. Design concepts may explore feasibility earlier, but cannot acquire contract status or create irreversible implementation commitments.

## Invalidation

A material change to purpose, users, roles, permissions, inventory, or success measures marks the IA `invalidated`, records the cause, and returns the workflow to the earliest affected stage.
