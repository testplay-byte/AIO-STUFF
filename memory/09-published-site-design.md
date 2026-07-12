# 09 — Published Site Design

> Design principles for the published Next.js site (lives in `site/`, deployed to
> https://testplay-byte.github.io/AIO-STUFF/). The dashboard is a separate app — see `06`.
> Keep these principles; don't over-specify into rigid checklists (per user: don't let docs
> force session-level rigidity on future iterations).

## Two audiences, two surfaces

- **The repo `.md` files** are for the AI — they keep "Where to go next", "Back", and
  navigation-guidance sections.
- **The published site** is for human users — it does NOT render those AI-guidance sections.
  Users see options and content, not navigation instructions.

When rendering `navigation.md` on the site, strip the "Where to go next", "Back", and
"Sibling pointer" sections. Keep "What's here" tables only if they add value; prefer
surfacing the actual tool entries directly.

## Home page (stats-first, not domain-cards-first)

- **Stats hero first** — counts (tools, domains, subdomains, last updated) + a small graph
  or two. Not the domain cards.
- **"What we provide" interactive section** next — tells the user what's available, clickable.
- **Tool-entries browser** — the main content. Shows the actual tool entries in **list/grid
  toggle** format, filterable by domain/subdomain/tags. NOT a domain→subdomain→tool
  drill-down as the primary nav. Users get to tools directly.

## Tool pages (user-approved — keep stable)

- "At a glance" metadata table (from front-matter) at the top.
- Links (official site, repo) prominent.
- Best for / Not for, Quick facts, How it works, Brief tutorial, Where to learn more.
- The user has explicitly approved this layout. Don't redesign it.

## Header (split layout)

- **Left:** app name + short description.
- **Right:** repo link + dark/light mode toggle.
- Sticky, border-bottom, warm palette.

## Easter-egg structure map

- A hidden route (e.g. `/blueprint`) showing the full `domains/` tree as a beautiful
  mind-map / visual tree.
- Accessed by clicking the app name (top-left) **5 times quickly** on the home page.
- Used by the user to visually audit how things are organized.
- Not linked in the main nav — discoverable only via the 5-click trigger (and direct URL).

## Palette + type (unchanged from 03)

- Warm coffee-cream light, warm off-black dark. Never pure white/black.
- Bigger, bolder headings. Responsive, accessible, sticky footer.

## Markdown rendering

- `**bold**`, `*italic*`, tables, code, links must all render correctly. If the user reports
  literal `**stars**` showing, it's a CSS/react-markdown config bug — fix the `.atlas-prose`
  styling or the component config.
