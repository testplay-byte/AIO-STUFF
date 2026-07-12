# 04 — Adding Content Workflow

> The exact sequence to follow every time you (the user) hand me a tool, skill, or
> website to add to the atlas. Follow it in order. Do not skip steps.

## Step 0 — Capture the request

Record, in the live preview's "Recent activity" feed:
- What was given (name / URL / skill id).
- Where you (the user) suggested it should live (if you did).

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
added: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

Body sections:
1. **What it is** — 1–2 sentences (substantive, from research).
2. **Best for** / **Not for** — one line each.
3. **Quick facts** — small bullet list (platform, pricing model, open-source?).
4. **How it works** (optional) — 2–4 sentences on the mechanism, if non-obvious.
5. **Brief tutorial** (optional) — only if genuinely useful; keep it short and vague-ish.
6. **Where to learn more** — the official link + 1 secondary link max.

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
