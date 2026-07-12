# dashboard/

Backup of the **build-dashboard workspace** — the Next.js app that lives at
`/home/z/my-project` in the sandbox and serves the live preview at `/`.

This folder is a snapshot used for sandbox recovery (see
[`../sandbox-backup/MANIFEST.md`](../sandbox-backup/MANIFEST.md)). It is NOT the published
atlas site — that lives in [`../site/`](../site/).

## Contents (on full backups)

- `src/` — the dashboard source (app, components, lib, hooks)
- `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`,
  `postcss.config.mjs`, `eslint.config.mjs`, `components.json`
- `public/` — static assets

## Restore

Copy these into a fresh Next.js 16 workspace, `bun install`, `bun run dev`. See the sandbox
backup manifest for the full procedure.
