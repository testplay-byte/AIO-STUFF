# 01 — The Navigation System

> This is the **heart** of AIO-STUFF. Every other decision serves this system.

## The rule

**Every directory that contains content MUST contain a `navigation.md`.**
No exceptions. If a folder exists, it has a `navigation.md`.

## The escalation principle

Each `navigation.md` is **scoped to its own folder only** and progressively more specific
than its parent's. Think of it as a series of zooming-in signposts:

```
navigation.md                   → substantive map of ALL top-level domains
  ai-tools/navigation.md        → focused on the AI domain ONLY (skips dev-tools, etc.)
    ai-tools/llm/navigation.md  → focused on LLM tools ONLY
      ai-tools/llm/<tool>.md    → the leaf: the actual tool entry
```

A reader never needs to see the whole tree at once. They see **only the branch they're in**,
plus pointers to where they could go next.

## Detail level — REVISED (NOT vague one-liners)

A `navigation.md` must be **detailed enough for an AI to understand what is in the branch,
what it is for, and what might be present — so it can decide confidently whether to go
deeper or backtrack.** A vague one-liner per child is NOT enough.

Concretely, for each child (folder or file) listed in "What's here", give:
- **What it is** — 1–2 sentences of real substance (not "various tools").
- **What it covers / what you'll find** — the specific scope.
- **Who/what it is for** — which kind of project or task would look here.
- **A representative example or two** — concrete names so the reader can pattern-match.

The root `navigation.md` describes each domain with enough depth that an AI can route
itself correctly without guessing. Each deeper level adds resolution, never repetition.

## Anatomy of a `navigation.md`

Every `navigation.md` has the same six sections, in this order:

1. **Scope statement** — "You are in: `<path>`. This folder covers `<X>` in depth." Plus a
   2–3 sentence orienting paragraph so the reader knows exactly what this branch is about.
2. **What's here** — a table of the immediate children (folders + files), each with a
   substantive description (per the detail rules above) and a relative link.
3. **Where to go next** — decision guidance: "If you want A → go to `./a/`. If you want B →
   read `./b.md`." Make the decision criteria explicit.
4. **Sibling pointer** (optional) — a single line back to the parent `navigation.md`, so a
   reader can retreat one level. Never list siblings from other branches.
5. **Last updated** — a date + one-line change note, so staleness is visible.
6. **Pointers** (optional) — cross-links to strongly related branches elsewhere in the tree,
   used sparingly and only when genuinely helpful.

## Writing rules

- **Never** describe content that lives outside the current folder. The root describes the
  domains; `ai-tools/navigation.md` describes only `ai-tools/*`, never `dev-tools/*`.
- **Never** duplicate the parent's overview. Each level adds resolution, not repetition.
- **Always** link with relative paths (`./llm/`, `../navigation.md`).
- **Always** keep "What's here" to a scannable table — name | type | substantive description | link.
- **Never** use vague filler ("various", "miscellaneous", "etc."). If you can't be specific,
  the branch isn't ready to ship — research it first.
- Leaf tool entries (`.md` files that are not `navigation.md`) use a **different** template
  (see `04-adding-content-workflow.md`).

## Decision: how deep?

- Target **depth ≤ 4** for the content tree (root → domain → subdomain → tool). Go deeper
  only if a subdomain genuinely has > ~12 tools that cluster further.
- Width over depth: a folder with 3–12 siblings is ideal. Fewer than 3 → flatten. More than
  12 → split into subfolders.

## The reader's journey (worked example)

1. Reader opens `navigation.md` → reads substantive descriptions of each domain (AI Tools,
   Dev Tools, Design, Productivity…). Picks **AI Tools**.
2. Opens `ai-tools/navigation.md` → reads focused descriptions of subdomains (LLM, Image Gen,
   Speech, Vision…). Picks **Image Gen**.
3. Opens `ai-tools/image-generation/navigation.md` → reads substantive descriptions of actual
   tools, each a leaf `.md`. Picks one.
4. Reads `ai-tools/image-generation/<tool>.md` → the entry itself.

Three branch decisions, zero wasted context, zero guessing. That is the goal.
