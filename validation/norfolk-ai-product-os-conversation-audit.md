# Norfolk AI Product OS conversation audit

Publication: **blocked**. This exact-identity historical audit is validation evidence only and is excluded from release inputs and generated outputs.

**Audit date:** 2026-08-04
**Purpose:** Preserve the Product OS and design decisions developed across today's design conversation and the repository-consolidation task before implementation planning.

## Sources audited

- ChatGPT conversation `6a724ba5-63e8-83ea-a10c-8968326a8e1d`, titled “HTML page explanation,” including the full design-to-Product-OS discussion and later repository-hygiene handoff.
- The complete current Codex task, `019fceee-e149-74a2-a87b-c9fdd0d8d26e`.
- The MCP-verified repository consolidation report in `outputs/norfolk-repository-consolidation-plan.md`.
- Relevant Norfolk Kit governance, requirements, ADRs, design, stack, equip/tidy, and buildout material inspected during this task.
- H-Analytics animation governance and the locally recovered Figma Make/Replit animation lineage.

The audit treats the user's explicit statements and corrections as authoritative. Assistant proposals are retained only when the user accepted them or subsequent evidence supports them. Later corrections supersede earlier assumptions.

---

## Executive synthesis

Norfolk AI Product OS is a persistent, versioned operating system for AI-assisted product development. It teaches agents how Norfolk AI understands a business, defines a product, organizes information, designs interfaces and outputs, chooses architecture, protects data, implements capabilities, verifies quality, documents decisions, and learns from deployed products.

It is not merely a design system, prompt collection, starter template, component library, or handbook. Design is nevertheless a major first-class pillar and the original catalyst for the concept. The Product OS must retain the depth of today's design work rather than compressing it into a generic standards page.

The target system has three distinct roles:

- **Norfolk AI Product OS** owns canonical knowledge, policy, rationale, standards, methods, contracts, playbooks, and adoption rules.
- **Norfolk Kit** implements the current approved Product OS as executable scaffolding, packages, components, integrations, checks, and equip/tidy tooling.
- **Product repositories** adopt explicit Product OS and Kit versions, contain product-specific context and exceptions, and may propose sanitized improvements back upstream.

Norfolk AI owns the Product OS and reusable intellectual property. KIT Capital is a client account and consumer, not part of Norfolk AI's identity and not a co-owner or automatic source of portfolio-wide standards.

---

## Authoritative decisions

### Identity, ownership, and repository roles

- The canonical name is **Norfolk AI Product OS**.
- It will live in a new private Norfolk AI repository rather than replacing or renaming Norfolk Kit.
- Product OS owns “what and why.” Kit owns executable “how.”
- Applications inherit through versioned adoption, not by copying an untracked snapshot of standards.
- Client repositories retain their own data, credentials, brands, business rules, product decisions, and exceptions.
- Client-derived patterns enter Product OS only after Norfolk AI deliberately extracts, sanitizes, reviews, and promotes them.
- A human-readable handbook is generated from Product OS; it is not an independent source of truth.
- `norfolk-manual` is a duplicated experiment to retire after handbook replacement and separate approval.
- `norfolk-starter` is the obsolete Clerk/Prisma generation to retire after preservation and separate approval.
- No repository deletion, branch deletion, PR closure, archive change, or other destructive action is implied by the Product OS plan. Each requires its own explicit approval.

### Product-first operating philosophy

Every engagement begins with understanding, not coding and not visual styling. Before changing a product, the agent must understand:

- why the application exists;
- who uses it and who pays for it;
- which decisions it helps people make;
- which business value it creates;
- how success is measured;
- which jobs users are trying to complete;
- which emotions and level of trust the experience should create;
- which domain, risk, data, and integration constraints shape the product.

The operating sequence is a product organization in software form: product management, business analysis, UX research, information architecture, design architecture, technical/security/data architecture, engineering, QA, documentation, and continuous review.

Durable intelligence belongs in structured documents and machine-readable contracts. Prompts remain small and route agents to the relevant knowledge. The system must not depend on one enormous prompt.

### Observation before recommendation

The first application pass is inventory-only. It maps the product without proposing changes:

- routes and navigation;
- pages and views;
- menus and nested sidebars;
- roles, permissions, and administrative surfaces;
- dialogs, modals, forms, collapsible sections, cards, tables, and charts;
- APIs, procedures, background jobs, and long-running operations;
- reports, exports, emails, and generated artifacts;
- existing components, tokens, patterns, inconsistencies, and duplicates.

This protects mature applications from agents that rush directly into “fixing.” Recommendations follow only after the product and current system are understood.

### Information architecture is a separate discipline

After inventory, the Product OS asks whether the current structure deserves to exist:

- Should a page remain, merge, split, or disappear?
- Can a workflow be simpler?
- Can navigation lose unnecessary entries or levels?
- Are admin functions grouped coherently?
- Do roles and permissions match the product's purpose?
- Do progressive-disclosure patterns reduce complexity without hiding necessary information?

The output is an evidence-backed information architecture, navigation map, workflow map, permission map, and prioritized recommendation set—not an immediate code rewrite.

---

## Design pillar: retained scope from today's discussion

Design is a first-class Product OS pillar parallel to governance, architecture, security, data, engineering, and reporting. Governance spans all pillars and must not be used as a synonym for design governance.

### Design begins with product intent

The design system adapts to what the product is for. A financial analysis product should not look, behave, or report like an artistic portfolio or event-planning product. Shared Norfolk foundations provide coherence, while domain playbooks and product profiles determine density, tone, information hierarchy, interaction posture, and output design.

The Product OS therefore needs product and domain inputs before visual recommendations:

- product profile and vision;
- business objectives and success measures;
- user/persona definitions;
- jobs to be done;
- domain and product glossary;
- trust, emotion, and brand posture;
- data sensitivity and accessibility requirements;
- integration constraints.

### Discover before inventing

For an existing application, the design process first extracts the actual design language:

- colors and semantic color roles;
- typography and numeric typography;
- spacing, sizing, density, radii, borders, and shadows;
- icons and icon weight;
- buttons, inputs, forms, selectors, toggles, and controls;
- cards, panels, tables, lists, tabs, sidebars, headers, and navigation;
- dialogs, modals, alerts, notifications, and confirmations;
- charts, data visualization, KPIs, and financial displays;
- loading, waiting, progress, empty, success, failure, and cancellation states;
- responsive and mobile behavior;
- accessibility and reduced-motion behavior;
- animation, transition, timing, and feedback patterns;
- product voice and conversational surfaces.

Only after discovery does the system propose a canonical design language, identify forbidden patterns, and explain which existing patterns are retained, replaced, or allowed as product-specific exceptions.

### Shadcn as the compositional default

- Prefer shadcn/ui and its underlying accessible primitives when they satisfy the need.
- Compose and theme those primitives rather than creating arbitrary local alternatives.
- Document every meaningful deviation and its rationale.
- Product OS owns the standards and component contracts; Kit owns executable components and configuration.
- Domain or product expression must not fragment the core interaction language.

### Living visual documentation

Design cannot be governed only through prose. The Product OS must produce interactive, inspectable visual artifacts that show the real system:

- UI primitives and composite patterns;
- all relevant states: default, hover, focus, active, disabled, loading, error, empty, success;
- light/dark and approved product/theme variants;
- responsive behavior;
- accessibility notes and keyboard behavior;
- usage guidance and forbidden uses;
- source/component mapping;
- shadcn equivalent or documented deviation;
- where each pattern is used in adopted applications;
- replayable motion with duration, easing, trigger, and reduced-motion behavior.

The original conversation described a living HTML design-system site richer than static Markdown and similar in usefulness to Storybook. Kit governance further requires self-contained, generated artifacts that remain synchronized with source. These ideas are compatible: Product OS defines the catalog contract and review experience; Kit generates executable catalogs from real components and tokens.

### Design approval gates

- No broad page redesign begins until the product profile, inventory, information architecture, and proposed design system have been reviewed.
- Recommendations carry confidence levels and cite the product/user goal they advance.
- Design debt is prioritized by impact and effort rather than dumped as an undifferentiated issue list.
- Before/after evidence, screenshots, prototypes, or visual artifacts support approval.
- Implementation proceeds incrementally after approval, with documentation updated alongside behavior.
- Better patterns discovered during implementation are proposed upstream rather than silently becoming local precedent.

### Authentication is product experience

Every Norfolk application is expected to have authentication. WorkOS supplies identity infrastructure, but Norfolk owns the experience. Product OS must govern first-party-feeling:

- login and logout;
- invitation and account activation;
- passwordless or recovery flows as applicable;
- organization selection and switching;
- MFA;
- session expiry and reauthentication;
- loading, empty, error, locked, and permission-denied states;
- branded hosted surfaces and transitions between application and identity provider.

The user should not feel they have left the product or entered an unrelated WorkOS interface.

### Output and report design system

Reports and exports are first-class products, not afterthoughts. The Product OS must govern:

- PDF and printed reports;
- Excel workbooks;
- PowerPoint presentations;
- Word documents when appropriate;
- dashboards and charts;
- emails and notifications;
- image/graphic exports;
- investor materials and financial statements.

Each medium needs explicit standards for typography, spacing, density, margins, headers, footers, branding, chart behavior, numeric formatting, disclosures, accessibility, provenance, and rendered samples. UI, agent, report, and export outputs must reuse the same authoritative calculations and procedures rather than drifting into separate implementations.

### Motion and honest progress

The motion system is one protected design module within the broader Product OS:

- H-Analytics contains the best known deployed animation suite and progress integration.
- The recovered Figma Make projects contain higher-fidelity creative originals to inspect.
- Replit exports preserve the original implementation handoff.
- Kit contains portable/reference copies and specifications.
- None of these sources may be discarded until visually and behaviorally reconciled.

The H-Analytics governance pattern is canonical prior art:

- long operations receive consistent modal or non-modal progress surfaces;
- elapsed time is honest;
- percentages appear only when grounded in real staged progress;
- operations without a real progress signal remain visibly indeterminate;
- fabricated progress is forbidden;
- cancellation, success, failure, reduced motion, keyboard use, and mobile behavior are designed states.

---

## Fundamental governance and knowledge architecture

The accepted term is **fundamental governance**, not “design constitution.” Governance covers how decisions are made and enforced across product, design, engineering, security, data, reporting, agents, and repository lifecycle.

The Product OS needs:

- precedence and conflict rules;
- binding versus reference knowledge tiers;
- decision records that preserve rationale and explicitly state what a decision rules out;
- freshness and verification requirements;
- anti-bloat and anti-fabrication rules;
- approval boundaries for destructive, irreversible, outward, financial, security, and client-impacting actions;
- documentation synchronization and machine-checkable gates;
- explicit ownership for each pillar;
- confidence levels and evidence citations for recommendations;
- exception records with owner, rationale, scope, expiry/review date, and migration consequence.

Knowledge should distinguish:

- stable canonical standards and decisions;
- reusable domain playbooks;
- project templates to be populated before use;
- generated inventories, audits, maps, and catalogs;
- implementation packages and tools;
- product-local decisions and approved exceptions.

Domain playbooks adapt the Product OS to financial, hospitality, CRM, legal, analytics, AI-agent, and other product categories without forcing every product into one visual or operational mold.

---

## Agent-native and continuous-learning model

Agents should behave as members of a product organization, not isolated code generators. The Product OS must provide:

- a vendor-neutral root agent contract;
- role-specific, lightweight workflows that load canonical knowledge;
- procedure-first capabilities shared by UI and agent surfaces;
- MCP parity for authorized product capabilities;
- model portability and model-as-configuration;
- truthful verification and explicit limits;
- human approval at consequential gates;
- browser/visual inspection for user-facing work;
- recommendations that explain confidence, evidence, and user/business impact.

The learning loop is proposal-based:

1. A product discovers a better component, workflow, rule, or architectural pattern.
2. The product proposes it for upstream promotion with evidence.
3. Norfolk AI sanitizes and reviews the proposal.
4. Product OS changes first if approved.
5. Kit implements the new version.
6. Applications receive an adoption proposal and choose when to upgrade.

Nothing is pushed automatically into products. Adoption audits show the Product OS version, Kit version, product version, available improvements, local exceptions, confidence, and expected impact.

---

## Preferred technology baseline

The obsolete Starter stack must not shape Product OS. The current baseline recovered from Kit is:

- WorkOS AuthKit for identity;
- Neon PostgreSQL and Drizzle;
- Doppler with separate development, staging, and production environments;
- Railway for applications, long-running services, workers, scheduled work, and WebSockets;
- Cloudflare R2 and Stream for files/media with direct signed transfers;
- Resend for email;
- Sentry for error monitoring;
- tRPC as the procedure layer;
- MCP wrappers for authorized UI/agent parity;
- Vercel AI SDK for model-portable product AI;
- shadcn/ui and Tailwind for UI composition;
- pgvector and Voyage for embeddings where needed;
- invisible-container posture: Codespaces/Railway manage containers, with Dockerfiles treated as explicit exceptions.

Product OS owns the rationale, constraints, reversal conditions, security posture, and capability contract. Kit owns pinned, tested integrations and project scaffolding.

---

## Repository evidence and consequences

### Norfolk Kit

Keep. It has strong governance, ADRs, design/motion source, agent contracts, setup/equip/tidy tooling, brand material, and preferred-stack decisions. It is not yet the fully runnable preferred-stack starter its README implies. The plan must make it an honest executable reference after canonical standards move to Product OS.

### Norfolk Manual

Retire after replacement and separate approval. It is an equipped/copy snapshot of Kit, not a durable independent handbook. Its open animation-removal PR should not be merged merely to tidy a repository scheduled for retirement; preserve the diff and branch, then close it as superseded at the approved retirement gate.

### Norfolk Starter

Retire after preservation and separate approval. It contains the obsolete Next.js/Clerk/Prisma/local-Docker/`.env` generation. Useful setup/check files were already harvested; its open dependency PR does not modernize the architecture.

### H-Analytics

Use as the first mature validation application and pattern-harvesting source. It is intentionally difficult: large, inconsistent, and operationally real. The Product OS must observe it before recommending changes, produce prioritized debt rather than noise, and never absorb client/product-specific material without review.

### Design provenance repositories and local sources

Preserve until reconciled. `H-Analytics_Figma_Design`, archived `hbg-design-system`, H-Analytics runtime components, Replit exports, Kit copies, and the six recovered local Figma Make bundles each preserve different layers of intent or implementation.

---

## Proposed Product OS capability model

The plan should organize the Product OS around capabilities rather than one flat folder of prose:

1. **Fundamental governance** — precedence, decisions, ownership, approvals, evidence, freshness, exceptions.
2. **Product understanding** — profiles, users, jobs, objectives, glossary, success, emotion/trust posture.
3. **Discovery and inventory** — application mapping without recommendations.
4. **Information architecture** — navigation, workflows, permissions, page necessity, simplification.
5. **Design** — foundations, components, composition, responsive behavior, accessibility, voice, themes, motion, authentication experience, forbidden patterns.
6. **Output/report design** — PDF, Office, charts, email, print, investor and financial artifacts.
7. **Architecture and engineering** — preferred stack, boundaries, procedure-first capabilities, deployment, observability, tests, CI.
8. **Security and data** — identity, authorization, secrets, environments, storage, retention, migration safety, client isolation.
9. **Agent-native operations** — agent contracts, MCP parity, model portability, human gates, truthful verification.
10. **Domain playbooks** — adaptable product knowledge for financial, hospitality, legal, CRM, analytics, AI-agent, and future domains.
11. **Adoption and lifecycle** — versions, lockfiles, audits, proposed upgrades, exceptions, promotion loop, repository retirement.
12. **Handbook and visual artifacts** — generated, inspectable views of canonical standards and executable systems.

---

## Superseded or rejected ideas

- **“Product OS is mainly a design system.”** Rejected. Design is a major pillar; governance and Product OS are broader.
- **“Design belongs under governance.”** Rejected. They are parallel pillars; design has its own governance within the broader system.
- **“Manual is the explanation layer and remains a separate maintained repository.”** Superseded. Generate the handbook from Product OS.
- **“Starter remains canonical.”** Superseded. Product OS becomes canonical; Kit implements it; the old Starter retires.
- **“Clerk/Prisma/local Docker/`.env` define the preferred stack.”** Superseded by WorkOS, Drizzle, managed environments, and Doppler.
- **“The Figma-design GitHub repository is necessarily the source of the process animations.”** Corrected. The full provenance is local Figma Make → Replit/source exports → H-Analytics production integration → Kit preservation/reference copies.
- **“The newest or largest animation archive must be best.”** Rejected. One later bundle has a blank thumbnail; selection requires playback and comparison.
- **“Every recommendation or upgrade may apply automatically.”** Rejected. The system proposes; humans approve consequential changes.
- **“Fix the mature application immediately.”** Rejected. Observe, model, propose, approve, then implement incrementally.
- **“One giant prompt should contain the system.”** Rejected. Durable knowledge lives in structured files/contracts; prompts remain small.
- **“Product OS should automatically be open source.”** Not adopted. Current direction is a private Norfolk AI repository.

---

## Open planning questions

These do not alter the established Product OS concept but must be resolved in the implementation plan or early implementation:

- Exact package and publication model for Kit components, tokens, motion, finance, and optional modules.
- Exact schema for Product OS versions, Kit compatibility, application locks, and exceptions.
- Which standards are machine-readable in addition to Markdown.
- How the generated handbook and visual catalogs are built, hosted, and verified without becoming a second truth source.
- Which design foundations are universal Norfolk defaults versus theme/domain-level choices.
- How Figma libraries, Code Connect, local Make archives, runtime components, and catalog artifacts maintain traceable provenance.
- The first complete reporting/export format matrix and rendered acceptance suite.
- The first H-Analytics validation slice and the threshold for promoting a product-local pattern upstream.
- Final repository name spelling and capitalization in GitHub; the conceptual name remains Norfolk AI Product OS.

---

## Planning guardrail

The implementation plan must treat this audit and the repository consolidation report as a combined source set. It must not reduce the project to repository hygiene, animation preservation, a generic starter, or a conventional component library. The plan succeeds only if it creates the operating methodology, canonical knowledge architecture, design system and review surfaces, executable Kit relationship, client boundary, and continuous adoption/promotion loop defined above.
