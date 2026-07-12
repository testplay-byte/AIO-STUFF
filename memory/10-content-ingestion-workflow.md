# 10 — Content Ingestion Workflow (canonical)

> The definitive, timeline-formatted workflow I follow **every single time** the user gives
> me new content to add (a tool, a site, a skill, a library, a resource). This is the
> "proper dedicated file" for the process. The dashboard's **Workflow** tab renders this as a
> visual timeline. If this file and the dashboard data drift, **this file wins** — update the
> dashboard data to match.
>
> See also: `04-adding-content-workflow.md` (the per-entry template + placement rules — the
> detailed reference for steps 6–7 below).

## How to read this

- The workflow runs **top to bottom**: step 1 at the top, the finishing step at the bottom.
- The **main flow** (happy path) is the spine. **Detours** branch off to the side — they are
  real branches I take when a condition is met, then either rejoin the main flow or stop.
- **Hard stops** (🔴) end the workflow early — I report to the user and wait.
- **Soft detours** (🟡) are side-paths that rejoin the main flow.

---

## Step 1 — Receive & capture the request

I get a name / URL / repo / skill-id from the user. I record it in the dashboard's recent
activity ("Received: <name>") before doing anything else.

## Step 2 — Existence check (mandatory, before any other work)

`grep -ril "<slug-or-name>" aio-repo/ --include="*.md"` (and try name variants: the slug,
the display name, the URL host, the GitHub org/repo).

- **🟡 Detour A — already exists:** If the resource is already in the repo, STOP processing.
  Tell the user it exists, where it lives (the path), and ask whether they want it updated,
  moved, or left alone. Do NOT create a duplicate. (Per memory/04 Step 0 + the user's
  explicit rule: "if it exists you will directly tell me.")
- **Main flow — does not exist:** proceed to step 3.

## Step 3 — Research (scrape the web, read docs, cross-check)

Open the official site / docs / repo. Read them. Scrape the web as needed to gather facts:
what it does, how it works, pricing, license, platform support, integrations, notable
limitations. Cross-check claims against a second source (e.g. GitHub API for stars/license,
or a second page) where possible.

- **🟡 Detour B — facts missing or ambiguous:** If a fact can't be verified after research,
  mark the field `Unknown` (or `None` for license). **Never invent features, pricing, or
  stats.** Continue the workflow with the gap marked — `Unknown` is always preferable to a
  fabricated value. (Per memory/04 Step 2 + memory/07 rule 8.)

## Step 4 — Analyze & understand

Distill the research into: what it is (1–2 sentences), what it does, best-for / not-for
(honesty over hype), quick facts, how it works, and — critically — the **AI-compatibility
rating** (1–5, no 0; see memory/04 for the scale) and the **icon** (see memory/04 for the
icon step). The rating answers: can an AI agent directly USE this tool as part of its
workflow? 5 = full AI autonomy (CLI/library/skill the agent runs), 1 = user-only product
the AI can only recommend. The icon: extract the tool's real logo from its site if it has
one; otherwise create a detailed custom SVG representing what the tool does. Store at
`assets/icons/<slug>.svg`.

## Step 5 — Classify (decide domain + subdomain)

Decide which top-level domain (`ai-tools`, `dev-tools`, `design`, `security`, `productivity`,
or a new one) and which subdomain the resource belongs to. Use the 3–12 sibling rule
(memory/01): if a subdomain would have <3 or >12 siblings, flatten or split.

- **🟡 Detour C — no suitable domain exists:** Create a new top-level domain. Add it to the
  root `navigation.md` "What's here" table + "Where to next" + "Last updated". Create the
  domain folder + `domains/<new>/navigation.md` (substantive, per memory/01). Update the
  dashboard structure tree + distribution.
- **🟡 Detour D — no suitable subdomain exists:** Create a new subdomain under the best
  domain. Create the folder + `domains/<domain>/<new-sub>/navigation.md` (substantive). Add
  it to the parent domain's `navigation.md` "What's here" + "Where to next" + "Last updated".

## Step 6 — Write the entry

Create `domains/<domain>/<subdomain>/<slug>.md` with front-matter (name, slug, type, tags,
license, url, repo, author, added, updated) + body (What it is, Best for / Not for, Quick
facts, How it works, Brief tutorial [optional], Where to learn more). Per the approved
template in memory/04. **Watch the multi-line `**bold**` bug** (react-markdown doesn't span
`**` across newlines — keep bold phrases on one line).

## Step 7 — Update the parent navigation.md files

- If the subdomain is new: create its `navigation.md` (step 5 detour D already did this).
- Update the parent domain's `navigation.md`: add the tool to "What's here" with a
  substantive description, refresh "Where to next" if needed, bump "Last updated".
- If the domain is new: update the root `navigation.md` (step 5 detour C already did this).

## Step 8 — Update the dashboard state (`src/lib/atlas/state.ts`)

Bump the tools count, mark the domain/subdomain/entry live in the structure tree, refresh the
distribution, add a recent-activity entry. The dashboard must always match disk (per memory/07
rule 4 — the dashboard is the contract).

## Step 9 — Rebuild the published site

`cd aio-repo/site && bun run build`. Must succeed and produce `out/`. Verify the new tool
page exists in `out/` and has no literal `**` (bold renders as `<strong>`).

- **🔴 Hard stop E — build fails:** Fix the error before pushing. Do NOT push a broken build.
  Common causes: a `**bold**` spanning newlines, a gitignored folder (remember the `build/`
  → `/build/` lesson), a syntax error in the .md front-matter.

## Step 10 — Lint + verify build clean

`cd /home/z/my-project && bun run lint` (dashboard lint). Must pass. Verify no token leak:
`grep -rl "github_pat_" aio-repo/` must return nothing.

## Step 11 — Sync memory + state to the repo (sandbox backup)

`cp memory/*.md aio-repo/memory/` and `cp src/lib/atlas/state.ts aio-repo/sandbox-backup/state.ts`.
Per memory/05 sandbox-backup protocol — after each update, push so nothing is lost on a
sandbox reset.

## Step 12 — Commit + push to AIO-STUFF main

`git add -A && git commit -m "add(tool): <slug> under <domain>/<subdomain> ..."` (per the
commit convention in memory/04 Step 6). Push via the token.

## Step 13 — Monitor the GitHub Actions deploy

Poll the Actions API until the latest run is `completed / success`. The deploy workflow
builds `site/` and publishes to GitHub Pages.

- **🔴 Hard stop F — deploy fails:** Check the Actions logs. Common causes: a build error
  that didn't surface locally, a path issue. Fix, re-push, re-monitor.

## Step 14 — Verify the new tool page is live

`curl -s -o /dev/null -w "%{http_code}" https://testplay-byte.github.io/AIO-STUFF/<path>/`
must return 200. Open the page in agent-browser and confirm the key facts rendered (license,
stars, name, etc.).

- **🟡 Detour G — live page missing content:** Investigate. Fix the source, rebuild, re-push,
  re-verify. Don't report done until the live page is correct.

## Step 15 — Verify /explore shows the new tool

Open `/explore/` in agent-browser. Confirm the new tool appears alongside the others.

## Step 16 — Append work record to worklog.md

Append a `---` section to `/home/z/my-project/worklog.md` with Task ID, Agent, Task, Work
Log, Stage Summary, Flagged issues. Per memory/07 rule 7 — append, never overwrite.

## Step 17 — Report done to the user

Tell the user: what was added, where it lives (the path + the live URL), the key verified
facts, and any flagged issues (e.g. no license, ambiguous facts). Be honest — don't claim
done if any step is incomplete.

---

## Detour summary (the side-paths)

| ID | Trigger | Action | Rejoin? |
|----|---------|--------|---------|
| 🟡 A | Already exists in repo | Stop, tell user, ask what they want | No (hard stop for this resource) |
| 🟡 B | Facts missing/ambiguous after research | Mark `Unknown`/`None`, continue | Yes — rejoin at step 4 |
| 🟡 C | No suitable top-level domain | Create new domain + root nav | Yes — rejoin at step 6 |
| 🟡 D | No suitable subdomain | Create new subdomain + parent nav | Yes — rejoin at step 6 |
| 🔴 E | Build fails | Fix, rebuild, don't push broken | Rejoin at step 10 after fix |
| 🔴 F | Deploy fails | Check logs, fix, re-push | Rejoin at step 13 after fix |
| 🟡 G | Live page missing content | Investigate, fix, re-verify | Rejoin at step 14 after fix |

## Principles that govern every step

- **Existence check first, always.** No exceptions.
- **Never fabricate.** `Unknown`/`None` > invented facts.
- **AI-use angle emphasized** in every entry (this is an AI-first repo).
- **The dashboard must match disk.** If they drift, fix the dashboard immediately.
- **No slop.** The "would a human designer ship this?" test gates every UI change.
- **Append, never overwrite** the worklog.
- **Don't push broken.** Build + lint must pass before push.
