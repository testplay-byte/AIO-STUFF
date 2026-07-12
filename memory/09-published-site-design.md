# 09 — Published Site Design

> Design principles for the published Next.js site (lives in `site/`, deployed to
> https://testplay-byte.github.io/AIO-STUFF/). The dashboard is a separate app — see `06`.
> Keep these principles; don't over-specify into rigid checklists (per user: don't let docs
> force session-level rigidity on future iterations).

## Two audiences, two surfaces

- **The repo `.md` files** are for the AI — they keep "Where to next", "Back", and
  navigation-guidance sections.
- **The published site** is for human users — it does NOT render those AI-guidance sections.
  Users see options and content, not navigation instructions.

When rendering `navigation.md` on the site, strip the "Where to next", "Back", and
"Sibling pointer" sections. Keep "What's here" tables only if they add value; prefer
surfacing the actual tool entries directly.

## Home page (stats + graphs only; browse lives on /explore)

- **Home shows ONLY stats + graphs + a little info + a button.** No tool browser, no
  "what we provide" section on home anymore. Keep it clean and dashboard-like.
- Stats: counts (tools, domains, subdomains, last updated) + at least 2 small graphs (e.g.
  tools-per-domain bar + a donut/pie of distribution). Make the graphs real and polished.
- A prominent button (e.g. "Explore the atlas") links to the dedicated `/explore` page.

## /explore page (the browsing surface)

- Dedicated full page for "What we provide" + the tool-entries browser.
- Domain chips ("What we provide") + list/grid toggle + filterable tool entries.
- This is where users browse and click into a tool. Reached from the home button.

## Routing — NO subdomain page

- **The subdomain route (`/[domain]/[subdomain]`) is removed.** Users don't see an
  intermediate subdomain index page — it was an unwanted "back" stop.
- The domain page (`/[domain]`) stays as a **dedicated standalone page** — it lists the
  domain's tools (grouped by subdomain as headings, but the headings are not links to a
  separate page).
- Tool URLs stay `/[domain]/[subdomain]/[tool]` (subdomain is a URL segment, not a page).
- Tool page breadcrumb: Home › Domain › Tool (subdomain omitted from the breadcrumb display).

## Header — two disconnected sections (not one joined bar)

- The top of the page has **two separate floating sections** with a visible gap between
  them — NOT one full-width bar with a border-bottom joining left and right.
- **Left section:** logo tile + app name + short description.
- **Right section:** repo link + dark/light toggle.
- Both are rounded bordered elements sitting on the warm background, sticky at top.

## Tool pages (user-approved — keep stable)

- "At a glance" metadata table (from front-matter) at the top.
- Links (official site, repo) prominent.
- Best for / Not for, Quick facts, How it works, Brief tutorial, Where to learn more.
- The user has explicitly approved this layout. Don't redesign it.

## Blueprint page (/blueprint) — multiple view formats

- A **view switcher** at the top: Mind Map / Tree / Radial / Grid (at least 2–3 of these).
- **Color-coded per domain** (each domain gets a consistent accent color across all views).
- **Tool counts visible** at every level (domain, subdomain).
- **Scrollable / pannable canvas** for the mind-map and radial views (drag to pan, wheel to
  zoom, or at least a large scrollable area).
- Beautiful, not a plain indented list. This is for the user to audit structure visually.
- Accessed by clicking the app name 5x quickly on home, or via direct URL. Not in main nav.

## Palette + type (unchanged from 03)

- Warm coffee-cream light, warm off-black dark. Never pure white/black.
- Bigger, bolder headings. Responsive, accessible, sticky footer.

## Markdown rendering

- `**bold**`, `*italic*`, tables, code, links must all render correctly. If the user reports
  literal `**stars**` showing, it's a CSS/react-markdown config bug — fix the `.atlas-prose`
  styling or the component config.

## Subdomains (subcategories) scale on demand

- Domains contain subdomains (e.g. `design/component-libraries/`). New subdomains are
  created on-demand when the first tool in a new category arrives (per memory/04). The
  structure replicates trivially for every domain — same `navigation.md` template, same
  tool-entry template. Don't over-build the UI for a single tool; design grids/groupings to
  look right with 1 tool and scale to many.
