# Sandbox backup — manifest

This folder is the **sandbox state backup**, pushed to the repo regularly so the build
dashboard workspace can be restored after a sandbox reset. Per `memory/05-github-workflow.md`.

## What gets backed up

| Artifact | Location in repo | Source in sandbox | Cadence |
|----------|------------------|-------------------|---------|
| Workflow memory | `memory/` (repo root) | `/home/z/my-project/memory/*.md` | every update |
| Dashboard state | `sandbox-backup/state.ts` | `/home/z/my-project/src/lib/atlas/state.ts` | every update |
| Dashboard source | `dashboard/` | `/home/z/my-project/src/` + configs | milestone pushes |

## Restore procedure (after a sandbox reset)

1. Clone this repo: `git clone https://github.com/testplay-byte/AIO-STUFF.git`
2. Restore memory: `cp AIO-STUFF/memory/*.md /home/z/my-project/memory/`
3. Restore state: `cp AIO-STUFF/sandbox-backup/state.ts /home/z/my-project/src/lib/atlas/state.ts`
4. Restore dashboard source from `AIO-STUFF/dashboard/` (if present).
5. `cd /home/z/my-project && bun install && bun run dev`
6. Re-provide the GitHub token (stored in `access/` per the security decision, OR re-paste).

## Last backup

2025-01-15 — full backup including STARTUP.md, all 11 memory files, dashboard source
(65 files), state.ts. 22 tools, 6 domains, 14 subdomains, all with icons.
