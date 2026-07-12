# 06 — Live Preview Protocol

> How the dashboard at `/` stays in sync with reality, and what it must always show.

## Two audiences, two surfaces (REVISED)

- **The GitHub repository** (`domains/` + `navigation.md`) is **for the AI** — machine-readable
  markdown, detailed enough for an agent to navigate and find the right tool.
- **The live preview / published site** is **for human users** — beautiful, visual,
  easy-to-navigate. They see what the atlas offers and browse comfortably.

This dashboard (the Next.js app at `/`) is the **build command-center** for the project. It
is *not* the published site (that lives in `site/` in the repo). The dashboard exists so
that at any moment you can glance at it and know: *what is this project, where are we, what
just happened, what is the shape of the thing being built.*

## The six tabs (contract)

1. **Understanding** — my current understanding of the project (so you can correct me).
2. **Roadmap** — the phase plan with live status.
3. **Structure** — the real `domains/` tree, rendered from disk.
4. **Progress** — scorecard + radar (build dimensions) + distribution donut.
5. **Memory** — the real `memory/*.md` files, read from disk and rendered as markdown.
   This is the proof the workflow files exist and match what I claim.
6. **Design** — the design language, with live swatches + component samples.

## Sync rules

- **Memory tab** reads the actual `memory/` folder via `/api/memory`. If a file is missing,
  the tab says so explicitly. Never hardcode memory contents in the UI.
- **Structure tab** reflects the *target* structure (from `02-repository-structure.md`) until
  the real `domains/` mirror exists locally; after that it walks `domains/` for real.
- **Progress tab** numbers come from a single state object (`src/lib/atlas/state.ts`). When I
  finish a phase, I update that object — the tab updates automatically.
- **Recent activity** is a rolling list (last ~8 events) kept in the same state object.

## What "updated as new content uploads" means concretely

When I add a tool (per `04-adding-content-workflow.md`), I also:
1. Bump counters in `state.ts` (tools count, domain coverage %).
2. Append a one-line entry to recent activity with a timestamp.
3. Re-walk `domains/` so the Structure tab + distribution donut reflect the new leaf.
4. Re-run the agent-browser self-check on `/` (per `07-agent-operating-rules.md`).
5. Push the change to the AIO-STUFF repo (sandbox backup, per `05`).

## Visual contract (matches `03-ui-design-language.md`)

- Header banner sticky, with project title + phase tag + status badge + theme toggle.
- Executive summary card with 4-up stat grid (each tile: icon + bold number + micro-progress
  bar) + a restrained left-accent status banner.
- Tabbed body, `text-xs` tab labels with leading icons.
- **Bigger, bolder headings** — section titles and card titles are clearly larger and
  heavier than body text (per user feedback).
- **Off-black dark background** (NOT pure black) and **warm coffee-cream light background**
  (NOT pure white) — per user feedback. All layered tokens adjusted to match.
- Sticky footer (`mt-auto` on a `min-h-screen flex flex-col` root).
- Light default, dark available. Responsive. No AI slop.

## Failure modes to avoid

- A Memory tab that shows hardcoded text instead of reading files (breaks trust).
- A Progress tab that always says 100% (hides real state).
- A Structure tab that drifts from the actual `domains/` folder.
- Pure-black dark mode or pure-white light mode (user explicitly rejected both).
- Any screen that looks generated rather than designed.
