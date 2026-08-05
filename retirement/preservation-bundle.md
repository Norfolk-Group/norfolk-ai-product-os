# Preservation evidence and limits

On 2026-08-05, read-only GitHub MCP confirmed current visibility/state and remote branch/PR facts. Local main histories were exported to `/Users/rcidale/Documents/Codex/2026-08-04/referenced-chatgpt-conversation-this-is-an/work/repositories/preservation/` and `git bundle verify` confirmed complete history for each included `main` ref.

| Repository | Main bundle SHA-256 | Included | Known missing |
|---|---|---|---|
| norfolk-starter | `8c44a7c4f755a2758eaec8cff2047dac0315145d6f304fdf12c03843fa5a9ee0` | `main` at `3788ec74763018b73f4051613d90c0005874388b` | Dependabot branch, settings/rules/workflows/environments/webhooks/dependencies, safe-target restoration |
| norfolk-manual | `7d9a6a534b51adc2a538272ea70875654248beab81f7788d054d7b27b44220cd` | `main` at `b397f6e3d5e00d2be9ee608356f892daaca8dcd2` | two extra branches, open PR #2 metadata/patch, settings/rules/workflows/environments/webhooks/dependencies, safe-target restoration |

These are partial preservation artifacts, not deletion backups. A verified checksum and main history alone are insufficient. Complete retirement requires exportable refs/tags/PRs/issues/releases/settings/rules/workflows/environments/webhooks/dependency relationships plus safe-target restoration.
