---
title: Preferred technology stack
status: accepted
tier: CONTRACT
owner: Architecture Owner
lastVerified: 2026-08-05
---

# Preferred technology stack

The preferred stack is an opinionated default, not an eternal vendor promise. The machine-readable [stack register](preferred-stack.json) records each choice, rationale, rejected alternative, reversal trigger, owner, and verification date. Pricing, SDK behavior, model quality, quotas, and provider capabilities are time-sensitive and must be rechecked against official current sources before a consequential commitment.

The current foundation is GitHub Codespaces; Doppler; Railway; WorkOS AuthKit; Neon Postgres with Drizzle; Cloudflare R2 and Stream; Resend; Sentry; tRPC; MCP; Vercel AI SDK; and shadcn, Tailwind, and Lucide. WorkOS is the sole production identity default. Clerk, Prisma, Replit-hosted databases, and the legacy public Next.js scaffold are superseded choices, not compatible alternatives.

Products may add a domain dependency. A second authentication system, ORM/database abstraction, object store, application runtime, or equivalent foundational service requires an accepted decision record covering ownership, security boundary, operational burden, migration, and removal. Model and agent runtimes are configuration behind capabilities; they never own domain policy.

Before integration, check the official vendor skill or MCP surface when available, official current documentation, supported diagnostics or command index, and a minimal failing/succeeding probe. Store verification date and owner. Marketing pages and remembered SDK behavior are not sufficient evidence.
