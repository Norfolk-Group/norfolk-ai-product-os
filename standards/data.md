---
title: Data architecture and safety
status: accepted
tier: CONTRACT
owner: Data Owner
lastVerified: 2026-08-05
---

# Data architecture and safety

Neon Postgres is the default system for transactional records and Drizzle owns the typed schema and forward migrations. Each database self-identifies its environment and immutable instance identity. Destructive commands refuse staging, production, replicas of uncertain origin, and unstamped databases regardless of command-line environment labels. Only a self-stamped local-development database is eligible for destructive reset.

Production migrations are forward-only in CI, reviewed, attributable, observable, and compatible with the running application through expand-and-contract phases. Rollback applies to code/configuration while both schemas remain compatible. Destructive or irreversible data changes require a separately approved recovery plan, verified backup/restore evidence, affected-tenant analysis, and explicit execution window.

Tenant scope is part of every query and policy boundary. Database roles separate runtime, read-only support, migrations, and administration. Seeds and fixtures are synthetic. Logs and analytics exclude sensitive record bodies unless a documented, minimized use is approved. Calculations that feed reports name their authoritative input snapshot and calculation version.
