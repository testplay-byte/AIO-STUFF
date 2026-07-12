---
name: Knip
slug: knip
type: tool
tags: [javascript, typescript, dead-code, unused-dependencies, unused-exports, linter, maintenance, build, monorepo, node, cli]
license: ISC
url: https://knip.dev
repo: https://github.com/webpro-nl/knip
npm: https://www.npmjs.com/package/knip
author: webpro-nl
icon: assets/icons/knip.png
ai_compatibility: 4
added: 2025-01-15
updated: 2025-01-15
---

## What it is

**Knip** is a project linter that finds unused dependencies, unused exports, and unused
files in JavaScript & TypeScript projects — including monorepos. It uses advanced analysis
starting from fine-grained entry points based on the actual frameworks and tooling in your
project, so results are accurate and actionable (not noisy guesses). Hosted at
[knip.dev](https://knip.dev), source on [GitHub (webpro-nl/knip)](https://github.com/webpro-nl/knip).
~11.7k stars, ISC license, TypeScript. 40M downloads/month, 15,000+ public projects use it.

## Best for

- **AI agents maintaining a JS/TS codebase** — run `knip` to find dead code, unused deps,
  and unused exports before shipping. Keeps `package.json` lean and surfaces code that can
  be safely deleted.
- **Monorepo cleanup** — Knip is built for monorepos, with workspace-aware analysis and
  150+ plugins for the common tools in them.
- **Pre-PR / CI gating** — add `knip` to CI to fail when unused dependencies or exports
  creep in, so the codebase stays pruned over time.

## Not for

- Runtime bug detection (it's static analysis of the dependency/export graph, not behavior
  testing — use a test runner for that).
- Non-JS/TS projects (Node/JS ecosystem only).
- Formatting / style linting (use ESLint/Biome/Prettier for that — Knip finds *unused*
  things, not *wrong-style* things).

## Quick facts

- **Finds:** unused dependencies, unused devDependencies, unused exports, unused files,
  unlisted dependencies, duplicate dependencies.
- **Plugins:** 150+ for tools and frameworks including Astro, Cypress, ESLint, Jest, GitHub
  Actions, Next.js, Nx, Remix, Storybook, Svelte, Vite, Vitest, Webpack, and many more.
- **Monorepo support:** workspace-aware analysis out of the box.
- **Adoption:** 40M downloads/month, 15,000+ public projects, 257 contributors.
- **Playground:** try Knip in-browser at [knip.dev](https://knip.dev) (no install).
- **Reports:** CLI output, JSON, SARIF, and more.
- **Language:** TypeScript (runs on Node).
- **License:** ISC (permissive).
- **Author:** webpro-nl.
- **Stars:** ~11,717 (as of early 2025).

## How it works

Knip builds a graph of your project starting from configured entry points (your `main`,
`bin`, scripts, config files, etc.) and the entry points of each detected framework/tool
(via its 150+ plugins). It then walks every import/require/re-export reachable from those
roots. Anything in `package.json` dependencies that's never reached = unused dependency.
Anything exported from a module that's never imported anywhere = unused export. Any file not
reachable from any entry point = unused file. Because the analysis is rooted in real
framework-aware entry points (not just `node_modules` grepping), false positives are low.

## Brief tutorial

```bash
# Install
npm install -D knip

# Run in your project (auto-detects frameworks via plugins)
npx knip

# In a monorepo — run from the root
npx knip

# CI mode: exit non-zero if issues found (great for pre-PR gating)
npx knip --production

# JSON output for tooling
npx knip --reporter json
```

An AI agent workflow: before finalizing a feature branch, run `npx knip` to catch unused
deps/exports/files you introduced; remove them; ship a leaner diff.

## Where to learn more

- **Official site:** [knip.dev](https://knip.dev) — docs, playground, plugin list.
- **GitHub:** [webpro-nl/knip](https://github.com/webpro-nl/knip) — source, issues, releases.
- **npm:** [knip](https://www.npmjs.com/package/knip)

## Back

← [`./navigation.md`](./navigation.md) (build)
