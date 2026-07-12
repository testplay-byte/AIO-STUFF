# Build — navigation

> You are in: `domains/dev-tools/build/`. This folder covers **build tooling, package
> managers, bundlers, task runners, and codebase-maintenance linters** — tools that
> assemble, optimize, inspect, or clean up your project. Distinct from `frameworks/`
> (the app runtime itself) and `testing/` (asserting behavior). Build tools work on the
> project's structure and dependency graph, not its runtime behavior.

## What's here

| Path | Type | What it is | Who it's for |
|------|------|------------|--------------|
| [`knip.md`](./knip.md) | tool entry | **Knip** — find unused files, dependencies, and exports in JavaScript & TypeScript projects. 150+ plugins (Astro, Cypress, ESLint, Jest, Next.js, Nx, Remix, Storybook, Svelte, Vite, Vitest, Webpack…). 40M downloads/month, ~11.7k stars, ISC, TypeScript. | AI agents maintaining a JS/TS codebase: prune dead code, remove unused deps/exports, keep `package.json` lean before shipping. |

## Where to go next

- Need to **find and remove unused deps/exports/files in a JS/TS project** → [`./knip.md`](./knip.md).
- Need a **web/app framework** → `../frameworks/navigation.md` (once created).
- Need a **bundler/package manager** → this subdomain (more entries added over time).
- Need **testing** → `../testing/navigation.md` (once created).

## Back

← [`../navigation.md`](../navigation.md) (dev-tools domain)

## Last updated

2025-01-15 — subdomain created with Knip as the first entry.
