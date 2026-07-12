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

## Home page (stats + graphs + categories overview)

- **Home shows stats + graphs + a categories overview + a button.** Keep it clean and
  dashboard-like, but DO use the ample space to surface the categories in a detailed view.
- Stats: counts (tools, domains, subdomains, last updated) + at least 2 small graphs (e.g.
  tools-per-domain bar + a donut/pie of distribution). Make the graphs real and polished.
- **Categories overview section:** show all domains (and their subdomains) as a detailed
  view on the home page itself — not just a button. The user wants to see the structure at
  a glance on home.
- **Hover affordance:** when the user hovers on a domain (e.g. "AI Tools"), show the names
  of its subdomains AND the tool names within them. Currently hover only shows counts — the
  user wants the actual names. (Apply this to the donut/radial graph slices too: hovering a
  domain slice shows its subdomains + tool names.)
- A prominent button (e.g. "Explore the atlas") still links to the dedicated `/explore`
  page for full browsing.

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

## Header — two disconnected sections, order swapped

- The top of the page has **two separate floating sections** with a visible gap between
  them — NOT one full-width bar with a border-bottom joining left and right.
- **Order (per user revision):** the section that was on the right (repo link + dark/light
  toggle) is now on the LEFT. The section that was on the left (logo tile + app name + short
  description) is now on the RIGHT (rightmost). They are NOT merged — just swapped position.
  So: leftmost = repo + theme toggle pill; rightmost = logo + name + description pill.
- Both are rounded bordered elements sitting on the warm background, sticky at top.

## Tool pages (user-approved — keep stable)

- "At a glance" metadata table (from front-matter) at the top.
- Links (official site, repo) prominent.
- Best for / Not for, Quick facts, How it works, Brief tutorial, Where to learn more.
- The user has explicitly approved this layout. Don't redesign it.

## Blueprint page (/blueprint) — multiple view formats + canvas interactions

- A **view switcher** at the top: Mind Map / Tree / Radial / Grid (all 4 live).
- **Color-coded per domain** (each domain gets a consistent accent color across all views).
- **Tool counts visible** at every level (domain, subdomain).
- Beautiful, not a plain indented list. This is for the user to audit structure visually.
- Accessed by clicking the app name 5x quickly on home, or via direct URL. Not in main nav.

### Canvas interactions (Mind Map + Radial views) — per user revision

- **Mouse wheel = ZOOM** (not scroll). Currently wheel scrolls the page; the user wants
  wheel to zoom in/out of the canvas. Plain wheel zooms; no ctrl/cmd modifier required.
- **Drag to pan:** clicking and holding the mouse button anywhere outside a node (i.e. on
  empty canvas) and moving the mouse pans the whole canvas (up/down/left/right). Currently
  drag doesn't work — implement pointer-based panning. Clicking ON a node should still
  select/expand it, not pan.
- **Full-screen button:** a button that (a) makes the canvas area fill the viewport AND
  (b) calls the browser Fullscreen API (`requestFullscreen`) to put the browser itself in
  full-screen mode. Toggle back on second click.
- These apply to Mind Map and Radial (the pannable/zoomable views). Tree and Grid keep
  their current behavior (the user approved them).

### Tree view — corner connector fix

- The bottommost entry in any branch currently uses a T-shaped (├) connector as if it had a
  sibling below. It should use an L-shaped (└) connector instead, because there is no
  sibling below it — the next thing down is the parent's sibling, not this node's sibling.
  Standard tree-drawing rule: last child = └, non-last children = ├.

### Radial view

- Same canvas interaction improvements as Mind Map (wheel-zoom, drag-pan, fullscreen).
  UI polish can come later; navigation fixes are the priority now.

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
