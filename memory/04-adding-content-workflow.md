# 04 — Adding Content Workflow

> The exact sequence to follow every time you (the user) hand me a tool, skill, or
> website to add to the atlas. Follow it in order. Do not skip steps.

## Step 0 — Capture the request + EXISTENCE CHECK (new rule)

Record, in the live preview's "Recent activity" feed:
- What was given (name / URL / skill id).
- Where you (the user) suggested it should live (if you did).

**Existence check (mandatory, before any other step):** search the repo for the resource
before doing anything else.

- `grep -ril "<slug-or-name>" aio-repo/ --include="*.md"` (and try a few name variants).
- Check `aio-repo/domains/**/<slug>.md` directly.
- If the resource **already exists**: stop. Tell the user it already exists, where it lives,
  and ask whether they want it updated, moved, or left alone. Do NOT create a duplicate.
- If it **does not exist**: proceed to Step 1.

This rule was added by the user explicitly: "if I provide you some site or something like
that or some skills or some other stuff like that, you will firstly check if it exists or
not. If it exists you will directly tell me and if it does not exist then you will properly
start to work on it."

## Step 1 — Classify

Decide the **domain** and **subdomain**. If unsure, propose 1–2 candidate locations and
note them; default to the candidate that keeps its sibling-count in the 3–12 range
(see `02-repository-structure.md`).

Ask: is this a `tool`, `service`, `library`, or `resource`? Set `type` in front-matter.

## Step 2 — Research deeply (REVISED: scraping IS part of the job)

This is the core of the work. When you hand me a resource, I **deeply research and analyze
it** before writing anything:

- Visit the official site / docs / repo. Read them.
- **Scrape the web as needed** to gather facts: what it does, how it works, pricing,
  license, platform support, integrations, notable limitations.
- Cross-check claims against a second source where possible.
- Extract: canonical name, official URL, license, one-sentence purpose, 2–5 tags, platform,
  pricing model, open-source status.
- One concrete "best for" line and one "not for" line (honesty over hype).
- If the resource warrants a brief how-to (per the revised non-goals in `00`), draft a short
  "vague tutorial" section — only when it adds real value.

If facts are missing or ambiguous after research, mark the field `Unknown` rather than
guessing. **Never invent features, pricing, or stats.** Research deeply; fabricate never.

## Step 3 — Write the leaf entry

Create `domains/<domain>/<subdomain>/<slug>.md` with:

```yaml
---
name: ...
slug: ...
type: tool | service | library | resource
tags: [...]
license: ...
url: ...
repo: ...            # add when there's a source repo (GitHub etc.)
author: ...          # add when known
icon: assets/icons/<slug>.svg   # see icon step below
ai_compatibility: 1-5   # REQUIRED — see rating scale below
added: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

### Icon (REQUIRED for every entry)

Every entry gets an icon — an SVG file stored at `assets/icons/<slug>.svg` in the repo.

1. **If the tool has a real logo/favicon:** extract it from the site. Check the page's
   `<link rel="icon">`, `<meta property="og:image">`, or inline `<svg>` elements. Save it
   as an SVG (preferred) or PNG (if only raster is available). The icon should be the tool's
   actual brand mark — NOT a monogram or placeholder.
2. **If the tool has NO icon:** create a detailed custom SVG that represents what the tool
   does conceptually. Make it as detailed as possible (multiple elements, gradients, filters,
   meaningful symbolism). The SVG should be appropriate to the tool's function — e.g., a
   radar display for a recon tool, a wave form for a TTS tool, a component grid for a UI
   library. Use a 128×128 viewBox with a transparent background and `currentColor` for
   structural elements (so it adapts to dark/light mode).
   **Important for small sizes:** the icon must be legible at 16px (blueprint nodes, home
   overview chips). Test at small sizes — use bold strokes (2.5px+), large shapes, and
   avoid fine details that blur at 16px. Fewer, bolder elements are better than many tiny
   ones when the icon will be displayed at 16-20px.
3. **Store it** at `aio-repo/assets/icons/<slug>.svg` and reference it in the front-matter
   as `icon: assets/icons/<slug>.svg`.
4. The published site reads the SVG at build time and renders it inline on the tool page
   (next to the title) and in the blueprint views (mind-map/tree/radial/grid nodes).

### AI-compatibility rating (REQUIRED, 1–5, no 0)

Every entry gets a rating. The question is: **can an AI agent directly USE this tool as
part of its workflow?** (Not "does the tool use AI internally" — that's different.)

| Rating | Label (shown on site) | Meaning | Examples |
|--------|----------------------|---------|----------|
| **5** | Full autonomy | An AI agent uses it directly and autonomously (CLI it runs, library it imports, skill it installs). | MEDUSA (`medusa scan --git`), React Bits (agent drops components into a UI), Ponytail (agent installs + benefits automatically). |
| **4** | High | An AI agent can use it with minimal user involvement. | Knip (`npx knip`), ReconForge (`reconforge report`), brag (`/brag`). |
| **3** | Moderate | An AI agent consults it as a reference or uses it with user context. | free-for.dev (agent consults to recommend services). |
| **2** | Low | Primarily user-facing; an AI agent can navigate/recommend but doesn't use it directly. | Jitter (user designs motion), Ideavo (user chats to build apps), Lovart (user chats to design). |
| **1** | User-only | User-only product; an AI agent can only recommend it. The AI can still navigate the repo and surface it. | NoctisNova (hire a studio), UpsideOnly (user trades on a platform). |

**No 0 rating.** Even a purely user-facing tool gets at least 1, because the AI can always
navigate the atlas and recommend it to the user.

Body sections (this is the template the user has reviewed and likes — keep it):
1. **What it is** — 1–2 sentences (substantive, from research).
2. **Best for** / **Not for** — one line each. Honesty over hype.
3. **Quick facts** — small bullet list (component count, stack flavors, license, stars,
   author, primary language — whatever's genuinely relevant; not every field every time).
4. **How it works** (optional) — 2–4 sentences on the mechanism, if non-obvious.
5. **Brief tutorial** (optional) — only if genuinely useful; keep it short and vague-ish.
6. **Where to learn more** — the official link + repo link.

The published site renders the front-matter as an "At a glance" metadata table at the top
of the tool page (name, type, license, url, repo, author, ai_compatibility, tags, added,
updated) and the body as markdown below. The user has explicitly approved this layout —
keep it stable for new entries. (See `09-published-site-design.md` for the site's design
principles.)

## Step 4 — Update the parent `navigation.md`

Open `domains/<domain>/<subdomain>/navigation.md` and:
- Add the new tool to the "What's here" table with a **substantive** description (per `01`).
- Refresh "Where to go next" if the new tool changes the decision guidance.
- Bump "Last updated" with a one-line change note.

If this is the **first** tool in a brand-new subdomain, also:
- Create the subdomain folder + its `navigation.md` from the template (detailed, per `01`).
- Add the subdomain row to the **domain's** `navigation.md` (substantive description).
- If the domain itself is new, add it to the **root** `navigation.md`.

## Step 5 — Update the live preview

- Bump the relevant progress counters (tools count, domain coverage).
- Add an entry to "Recent activity".
- Regenerate the Structure tree + distribution donut from the real `domains/` walk.

## Step 6 — Back up to the repo

Per `05-github-workflow.md` sandbox-backup protocol: after the update, push the new content
to the AIO-STUFF repo so nothing is lost on a sandbox reset. Commit message convention:

```
add(tool): <slug> under <domain>/<subdomain>

- entry + parent navigation.md updated
- live preview counters refreshed
```

Use `add(tool)`, `add(domain)`, `add(subdomain)`, `update(nav)`, `fix(ui)`, `chore(ci)`,
`backup(sandbox)`.

## Step 7 — Verify before reporting done

- The new leaf is reachable from root `navigation.md` in ≤ 3 branch decisions.
- The parent `navigation.md` "What's here" table includes it with a substantive description.
- The live preview Structure tab shows it.
- Lint passes. The dashboard still renders with no console errors.
- The change is pushed to the repo (sandbox backup).

Only then report "added" to the user.
