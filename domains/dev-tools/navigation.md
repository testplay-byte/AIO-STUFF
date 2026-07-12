# Dev Tools — navigation

> You are in: `domains/dev-tools/`. This folder covers **software-development tooling** —
> frameworks, build systems, ORMs, testing libraries, CI/CD helpers, editors, and language
> servers. Tools an AI agent uses to write, build, test, and ship code.

## What's here

Subdomains are created as tools are added. Planned subdomains:

| Path | Type | What it is | Who it's for |
|------|------|------------|--------------|
| `frameworks/` | folder (planned) | Web/app frameworks — full-stack, frontend, backend, meta-frameworks. | Agents scaffolding a new app or picking a runtime. |
| [`build/`](./build/navigation.md) | folder | Build tools, bundlers, package managers, task runners, and codebase-maintenance linters (dead-code/unused-deps detection). **Live** — contains Knip. | Agents setting up or optimizing a build pipeline, pruning dead code, keeping package.json lean. |
| `data/` | folder (planned) | Databases, ORMs, migration tools, query builders, caching. | Agents modeling data or wiring persistence. |
| `testing/` | folder (planned) | Test runners, assertion libs, mocking, e2e, visual regression. | Agents writing or running tests. |
| `ci/` | folder (planned) | CI/CD platforms, action libraries, deploy helpers. | Agents automating build/deploy. |
| `editors/` | folder (planned) | Editor plugins, language servers, formatters, linters. | Agents configuring a dev environment. |
| [`learning/`](./learning/navigation.md) | folder | Developer learning & education resources — coding practice platforms, mentoring, course catalogs, language tracks. **Live** — contains Exercism. | Developers learning or improving a language; AI agents recommending a learning path to a user. |
| [`resources/`](./resources/navigation.md) | folder | Curated resource lists, awesome-lists, and reference compilations for developers — not installable tools, but organized catalogs. **Live** — contains free-for.dev. | AI agents discovering options for a given need (free tiers, libraries by category, etc.) before committing to a choice. |

## Where to go next

- Need a **web/app framework** → `./frameworks/navigation.md` (once created).
- Need a **build tool / dead-code linter / dep pruner** → [`./build/navigation.md`](./build/navigation.md) (live — Knip is there).
- Need a **database / ORM** → `./data/navigation.md` (once created).
- Need **testing** → `./testing/navigation.md` (once created).
- Need **CI/CD** → `./ci/navigation.md` (once created).
- Need an **editor/LSP/formatter** → `./editors/navigation.md` (once created).
- Need a **learning / practice platform** (coding exercises, mentoring) → [`./learning/navigation.md`](./learning/navigation.md) (live — Exercism is there).
- Need a **curated list / awesome-list / reference catalog** (e.g. free-tier services) → [`./resources/navigation.md`](./resources/navigation.md) (live — free-for.dev is there).

## Back

← [`../navigation.md`](../navigation.md) (root)

## Last updated

2025-01-15 — `learning/` subdomain went live with Exercism as the first entry. `build/` (Knip) and `resources/` (free-for.dev) already live. Other subdomains still planned.
