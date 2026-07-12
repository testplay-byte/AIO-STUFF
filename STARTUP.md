# STARTUP.md — Read This First

> **If you are a new AI agent picking up this project, read this file in full before doing
> anything else.** It tells you everything you need to know: what the project is, where
> everything lives, the rules, the workflow, and how to continue the work.
>
> This file is the single entry point. After reading it, follow the links to the `memory/`
> files for deeper context on each topic.

---

## What is AIO-STUFF?

AIO-STUFF is a **curated, navigable directory of tools, skills, and resources for AI**,
published as a public GitHub repository at **https://github.com/testplay-byte/AIO-STUFF**
and deployed to **https://testplay-byte.github.io/AIO-STUFF/**.

It has two surfaces:
1. **The GitHub repository** (`.md` files under `domains/`) — **for the AI**. An AI agent
   navigates the markdown to find the right tool. Every folder has a `navigation.md` with
   substantive, detailed descriptions (not vague one-liners).
2. **The published website** (Next.js static export in `site/`) — **for human users**. A
   beautiful, visual, easy-to-navigate site deployed to GitHub Pages.

**Current state:** 22 tools across 6 live domains (ai-tools, dev-tools, design, security,
finance, productivity) and 14 live subdomains. Every tool has an icon, an AI-compatibility
rating (1–5), and a detailed entry with front-matter + body.

---

## Repository Layout

```
AIO-STUFF/
├── STARTUP.md              ← YOU ARE HERE — read first
├── README.md               ← public-facing readme (simple, no internals)
├── navigation.md           ← ROOT signpost (substantive map of all domains)
├── LICENSE                  ← MIT
├── .gitignore
├── memory/                 ← 11 workflow files (READ THESE for rules + context)
│   ├── 00-project-overview.md
│   ├── 01-navigation-system.md
│   ├── 02-repository-structure.md
│   ├── 03-ui-design-language.md
│   ├── 04-adding-content-workflow.md
│   ├── 05-github-workflow.md
│   ├── 06-live-preview-protocol.md
│   ├── 07-agent-operating-rules.md
│   ├── 08-communication-protocol.md
│   ├── 09-published-site-design.md
│   └── 10-content-ingestion-workflow.md
├── domains/                ← ALL curated content (for the AI)
│   ├── ai-tools/           (studios, agent-skills, app-builders, llm, speech)
│   ├── dev-tools/          (build, resources, learning)
│   ├── design/             (component-libraries, prototyping, ai-design)
│   ├── security/           (scanners, recon)
│   ├── finance/            (trading)
│   └── productivity/       (planned, no entries yet)
├── assets/icons/           ← tool icons (PNG/SVG) + domain + subdomain SVGs
│   ├── domains/            (6 custom SVGs — spark, code, pen, shield, chart, checklist)
│   ├── subdomains/         (14 custom SVGs — chat, wave, puzzle, etc.)
│   └── *.png / *.svg       (22 tool icons — real favicons or custom SVGs)
├── site/                   ← the published Next.js website (for human users)
│   ├── src/
│   │   ├── app/            (routes: /, /explore, /blueprint, /[domain]/[subdomain]/[tool])
│   │   ├── components/     (site-header, blueprint-tree, tool-browser, etc.)
│   │   └── lib/            (content.ts, icons.ts, domain-style.ts)
│   ├── public/icons/       (PNG icons copied here for serving)
│   ├── next.config.ts      (output: 'export', basePath: '/AIO-STUFF')
│   └── package.json
├── sandbox-backup/         ← dashboard state snapshot (for sandbox recovery)
│   ├── MANIFEST.md
│   └── state.ts
├── dashboard/              ← dashboard workspace backup (README only currently)
├── access/                 ← token vault (password-protected zip + README)
└── .github/workflows/      ← deploy.yml (build site/ → Pages) + validate.yml
```

---

## The 11 Memory Files (Read in Order)

These are the canonical rules. Read them before doing anything.

| File | What it covers |
|------|---------------|
| `00-project-overview.md` | What we're building, the two audiences (AI repo + human site), who does what, non-goals. **AI-first repo.** |
| `01-navigation-system.md` | The core feature: every folder has a `navigation.md`, substantive (not vague), scoped to its branch only. ≤3 branch decisions to any tool. |
| `02-repository-structure.md` | The folder contract: `domains/` for content, `site/` for the published site, `memory/` for workflow, `assets/icons/` for icons. |
| `03-ui-design-language.md` | Design system: warm coffee-cream light / off-black dark palette (NO pure white/black), bigger bolder headings, shadcn/ui, no AI slop. |
| `04-adding-content-workflow.md` | The per-entry template: front-matter (name, slug, type, tags, license, url, repo, author, **icon**, **ai_compatibility**, added, updated) + body sections. **Icon step + AI-compat rating scale (1–5, no 0).** |
| `05-github-workflow.md` | Repo setup, token storage (password-protected zip in `access/`, password in sandbox only), sandbox backup protocol, deploy workflow. |
| `06-live-preview-protocol.md` | The dashboard (separate Next.js app, not in this repo) — 6 tabs, reads real memory files. Two audiences: repo for AI, site for users. |
| `07-agent-operating-rules.md` | 13 non-negotiable rules: read before writing, update memory when corrected, browser-verify before done, dashboard = disk, no slop, append worklog, don't push broken, etc. |
| `08-communication-protocol.md` | The red-emoji must-read protocol (15 dots top + bottom) for critical flags. Mistake documentation. |
| `09-published-site-design.md` | Site design: stats-only home + Explore button, /explore browsing page, no subdomain page, disconnected header pills (logo LEFT, repo+theme RIGHT; blueprint page = both right), blueprint 3 views (mind-map/tree/grid), wheel-zoom + drag-pan + fullscreen, markdown must render bold. |
| `10-content-ingestion-workflow.md` | The canonical 17-step workflow (timeline format): receive → existence check → research → analyze + rate + icon → classify → write → update nav → update dashboard → rebuild → lint → sync → push → monitor deploy → verify live → verify /explore → worklog → report done. 7 detour/stop branches. |

---

## The Workflow (Read memory/10 for the Full Timeline)

Every time the user gives you a new tool/site/resource to add:

1. **Existence check** — grep the repo for the slug/name/URL. If it exists, stop + ask.
2. **Research** — open the site, read docs, scrape the web, cross-check via GitHub API. Never fabricate — `Unknown` > invented.
3. **Analyze** — distill what it is, best-for / not-for, quick facts, how it works. Assign an **AI-compatibility rating** (1–5, no 0; see memory/04 for the scale). Create/extract an **icon** (real logo from the site, or a custom currentColor SVG if none exists).
4. **Classify** — pick the domain + subdomain. Create new ones if needed (3–12 sibling rule).
5. **Write the entry** — `domains/<domain>/<subdomain>/<slug>.md` with front-matter + body per the template in memory/04.
6. **Update parent navigation.md** — add to the "What's here" table with a substantive description.
7. **Update the dashboard** (if running) — bump tools count, mark live in structure tree, refresh distribution.
8. **Rebuild the site** — `cd site && bun run build`. Must succeed. No literal `**` in output.
9. **Lint** — `bun run lint`. Must pass. No token leak.
10. **Sync + push** — `cp memory/*.md aio-repo/memory/`, commit, push to main.
11. **Monitor deploy** — poll Actions API until `completed / success`.
12. **Verify live** — curl the tool page (HTTP 200), confirm content rendered.
13. **Append worklog** — `---` section with Task ID, Work Log, Stage Summary.
14. **Report done** — tell the user what was added, where, verified facts, flagged issues.

---

## AI-Compatibility Rating (1–5, No 0)

| Rating | Label | Meaning |
|--------|-------|---------|
| 5 | Full autonomy | Agent uses it directly (CLI, library, skill) |
| 4 | High | Agent uses with minimal user involvement |
| 3 | Moderate | Agent consults as a reference |
| 2 | Low | User-facing; agent navigates/recommends |
| 1 | User-only | User-only product; agent can only recommend |

---

## Icon System

Every tool, domain, and subdomain has an icon:
- **Tool icons** (`assets/icons/<slug>.png` or `.svg`): real favicon/logo extracted from the
  tool's site, or a custom currentColor SVG if none exists. PNGs served from
  `site/public/icons/`. SVGs embedded inline at build time.
- **Domain icons** (`assets/icons/domains/`): 6 custom minimalistic one-color SVGs (spark,
  code brackets, pen nib, shield, trending chart, checklist). Embedded in `site/src/lib/icons.ts`.
- **Subdomain icons** (`assets/icons/subdomains/`): 14 custom minimalistic one-color SVGs
  (chat bubble, sound wave, puzzle, app window, building, wrench, book, graduation cap,
  grid, pen+ruler, magic wand, radar, magnifying glass, candlestick). Embedded in `icons.ts`.
- All SVGs use `currentColor` (dark/light adaptive via `text-foreground`).
- Subdomain icons render with a colored background (parent domain's accent at 15% opacity).
- **Important for small sizes:** custom SVGs must be legible at 16px — bold strokes (2.5px+),
  large shapes, avoid fine details.

---

## The Published Site (site/)

- **Framework:** Next.js 16 App Router, TypeScript, Tailwind CSS 4, static export (`output: 'export'`).
- **basePath:** `/AIO-STUFF` (GitHub Pages).
- **Palette:** warm coffee-cream light (`oklch(0.935 0.022 75)`) / warm off-black dark
  (`oklch(0.175 0.006 70)`). **NEVER pure white or pure black.**
- **Key routes:**
  - `/` — home: stats + 2 graphs + categories overview + Explore button
  - `/explore` — tool browser (list/grid toggle, filterable by domain)
  - `/[domain]` — domain page (lists tools grouped by subdomain)
  - `/[domain]/[subdomain]/[tool]` — tool page (icon + At a glance metadata + markdown body)
  - `/blueprint` — hidden easter-egg structure map (click app name 5x on home). 3 views:
    Mind Map, Tree, Grid. Wheel-zoom (cursor-anchored), drag-pan, fullscreen.
- **Header:** two disconnected floating pills. Default: logo LEFT, repo+theme RIGHT.
  Blueprint page: both grouped RIGHT.
- **Content rendering:** `content.ts` reads `../domains/` at build time. `stripAiGuidance()`
  removes "Where to go next", "Back", "Last updated", "What's here" from rendered
  navigation.md (those are for the AI, not human users). Bold/italic must render correctly.
- **Icons:** `content.ts` reads SVG/PNG icons at build time → `iconSvg` field on Tool type.
  SVGs: strip width/height, use `width="100%" height="100%"`. PNGs: `<img>` with absolute
  path `/AIO-STUFF/icons/<name>.png` + `object-fit:cover`.
- **Domain/subdomain icons:** `src/lib/icons.ts` embeds all 20 SVGs as raw strings.
  `src/lib/domain-style.ts` maps domains to chart colors + subdomains to parent domain colors.

---

## The Dashboard (NOT in this repo)

The build dashboard is a **separate Next.js app** at `/home/z/my-project/` (the sandbox
workspace). It is NOT part of the published site. It has 6 tabs: Understanding, Roadmap,
Structure, Progress, Memory, Design. Plus a `/workflow` page (center-spine timeline).

The dashboard reads the real `memory/*.md` files via `/api/memory` and reflects the project
state via `src/lib/atlas/state.ts`. The `state.ts` snapshot is backed up to
`sandbox-backup/state.ts` in this repo.

**To restore after a sandbox reset:**
1. Clone this repo.
2. `cp memory/*.md /home/z/my-project/memory/`
3. `cp sandbox-backup/state.ts /home/z/my-project/src/lib/atlas/state.ts`
4. `cp -r dashboard/* /home/z/my-project/` (if dashboard source is backed up)
5. `cd /home/z/my-project && bun install && bun run dev`
6. Re-provide the GitHub token.

---

## Agent Operating Rules (Read memory/07 for All 13)

Key rules:
1. **Read before writing** — read worklog + relevant memory files first.
2. **Update memory when corrected** — memory is durable; chat is ephemeral.
3. **Browser-verify before done** — "it compiles" is never sufficient.
4. **Dashboard = disk** — if they drift, fix immediately.
5. **No slop** — "would a human designer ship this?" test.
6. **Don't push broken** — build + lint must pass.
7. **Append worklog** — never overwrite.
8. **Red-emoji must-read** — 15 🔴 top + bottom for critical flags (see memory/08).
9. **Token security** — never commit in plaintext; stored in `access/vault.zip`.
10. **Regular sandbox backups** — push memory + state.ts to the repo after each update.

---

## Key Technical Decisions (Don't Regress These)

- **No subdomain page** — the route `/[domain]/[subdomain]` returns 404. Domain pages list
  tools directly.
- **Tool page breadcrumb:** Home › Domain › Tool (subdomain omitted).
- **Blueprint:** 3 views (Mind Map, Tree, Grid). Radial was removed. Wheel = zoom
  (cursor-anchored, no modifier). Drag empty canvas = pan. Fullscreen button.
- **Tree view:** last child uses └ connector (not ├).
- **Home:** stats + graphs + categories overview + Explore button. No tool browser on home.
- **Header:** two disconnected pills, NOT one joined bar. Default order: logo LEFT,
  repo+theme RIGHT. Blueprint: both RIGHT.
- **AI-compatibility label:** "AI compatibility" (full word, not "AI compat"). Short labels
  only: "User-only", "Low", "Moderate", "High", "Full autonomy". No "AI recommends".
- **Icon paths:** PNGs use ABSOLUTE path `/AIO-STUFF/icons/<name>.png` (not relative —
  relative breaks on deep routes like `/domain/subdomain/tool/`).
- **SVG icons:** strip width/height at build time, replace with `width="100%" height="100%"`.
- **`.gitignore`:** `/build/` (root-only) not `build/` — the latter swallows
  `domains/dev-tools/build/` content.

---

## How to Continue

1. Read this file in full.
2. Read `memory/00-project-overview.md` through `memory/10-content-ingestion-workflow.md`.
3. Read `navigation.md` (the root signpost) to understand the current domain structure.
4. Browse the live site at https://testplay-byte.github.io/AIO-STUFF/ to see the current state.
5. Check `sandbox-backup/state.ts` for the latest dashboard state.
6. If the user gives you a new tool, follow the workflow in `memory/10` step by step.
7. If the user gives UI feedback, check `memory/09` for the design principles first.
8. Always append to the worklog, never overwrite.
9. Always verify with a browser before reporting done.
10. When in doubt, ask — don't guess and ship.
