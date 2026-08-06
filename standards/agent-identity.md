---
title: Agent identity and naming
status: accepted
tier: CONTRACT
owner: AI Platform Owner
lastVerified: 2026-08-06
---

# Agent identity and naming

Named members make agentic work understandable and attributable. Identity never hides execution type: the interface and audit record state whether work used an LLM or a deterministic procedure.

## Taxonomy

- **Agent:** a named LLM member performing substantive reasoning or generation.
- **Specialist:** an Agent reused across more than one product surface. A cross-product Specialist retains the same identity and role everywhere.
- **Orchestrator:** an Agent that plans and routes work among members, records handoffs, and does not produce the domain artifact directly.
- **Minion:** a named deterministic function or worker. It never calls an LLM, exercises judgment, or claims to interpret evidence.
- **Swarm:** a product-local coordinated team that may contain Agents and Minions. LLM use determines member type; Swarm membership does not.

Every member declares name, pronunciation, type, role, short description, long description, product scope, execution type, inputs, outputs, permissions, and lifecycle state. Names are unique and reserved within an app or project. Different projects may reuse a local name. Animation names are protected by their own registry and are not renamed by this convention.

## Naming grammar

Use Brazilian or Italian first names. Prefer Italian Renaissance women and men—artists, architects, sculptors, thinkers, and patrons—and Brazilian painters, sculptors, bossa nova singers, and composers. Match the association respectfully to the work: visual roles may draw from artists, narrative and rhythm roles from musicians, and multidisciplinary orchestration from polymaths. Do not turn a culture or person into a caricature.

Product-local Agents, Orchestrators, Specialists, and Minions use one name. Job-specific Swarm members use a zero-padded suffix such as `Name-01`. A central registry records cultural inspiration, pronunciation, role, product, execution type, descriptions, visual reference, and active/reserved/retired state.

## Conversational identities

An Agent or Specialist that directly chats, speaks, or guides a user has a female identity. A member that appears only in progress attribution or an intelligence badge does not inherit that requirement. Conversational identity is stable, clearly disclosed as AI, and never claims to be a human employee.

Each conversational identity supports an approved abstract animation and may support a highly photoreal animated synthetic human. Super Admin chooses the default. A user may switch to the abstract mode for comfort, bandwidth, or accessibility without changing the identity. Photoreal identities cannot imitate a real person without rights and consent; the normal contract uses a synthetic face and licensed synthetic voice.

Creation produces three candidate identities, previewed for still appearance, speech, expression, light/dark surfaces, and reduced motion. Super Admin selects one or regenerates another three. The abstract identity is the failure and reduced-capability fallback.

## Attribution

Long work names the actual active Agent, Specialist, Orchestrator, or Minion and describes the concrete current action. A Minion uses deterministic verbs such as validating, calculating, converting, rendering, or exporting; it never appears to reason. Handoffs and completion identify the responsible members. The display must correspond to real server state, not a synthetic ticker.

The machine-readable registry is [`agent-identity.schema.json`](../schemas/agent-identity.schema.json) with [`agent-identity.example.json`](agent-identity.example.json).
