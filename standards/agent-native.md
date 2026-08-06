---
title: Agent-native product architecture
status: accepted
tier: CONTRACT
owner: AI Platform Owner
lastVerified: 2026-08-05
---

# Agent-native product architecture

An agent-native product gives agents outcome parity with authorized users. Every UI action maps to the same procedure, context, policy, and observable state; every entity has complete create/read/update/delete or an explicit governed reason it cannot. Capability maps ship with the feature and CI detects drift. Natural-language outcome tests verify end state and recovery rather than prescribing one model trace.

Tools are small composable capabilities, named in user vocabulary, with simple data inputs, rich results, explicit errors, idempotency, and enough state to verify or undo. Business judgment stays in prompts and agent loops. Code owns security invariants, human approvals, transactional correctness, quotas, and irreversible boundaries. For broad evolving external APIs, agents discover authorized capabilities dynamically; constrained mappings must state the deliberate scope.

Agents receive the resources, vocabulary, recent state, permissions, and capability descriptions the UI exposes. Long tasks checkpoint plan, completed effects, pending approvals, and recovery information and finish with an explicit completion signal. Agent writes update shared product state immediately. Context is minimized and authorization-filtered; parity never means bypassing policy.

Consequential proposals show intended effect, scope, target, reversibility, evidence, and expiry to a human. Approval cannot be bundled across unrelated effects. A model or provider swap must not change capability semantics or policy.

Member type, naming, conversational presentation, and truthful progress attribution follow [Agent identity and naming](agent-identity.md). A deterministic worker is a Minion even when it participates in a Swarm; it cannot be presented as an LLM Agent.
