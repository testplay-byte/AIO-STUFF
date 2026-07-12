# AIO-STUFF

A curated, navigable directory of **tools, skills, services, libraries, and resources for
AI agents** — organized as a folder tree where every folder carries its own `navigation.md`.

## The idea

An AI (or human) opens [`navigation.md`](./navigation.md), reads a substantive map of the
domains, picks a branch, opens that branch's `navigation.md` for more focused context, and
repeats until it lands on the exact tool it was looking for. **Progressive disclosure by
directory** — each `navigation.md` is detailed enough to make the next decision confidently,
never a vague one-liner. Reach any tool in ≤ 3 branch decisions.

## Two audiences

- **This repository** (the `.md` files under `domains/` + each `navigation.md`) is **for the
  AI**. An agent navigates the markdown to find the right tool/skill/resource for its project.
- **The published site** (in [`site/`](./site/), deployed to GitHub Pages) is **for human
  users** — a beautiful, visual, easy-to-navigate webpage.

## Start here

👉 **[`navigation.md`](./navigation.md)** — the root signpost. Read it first.

## Structure

```
navigation.md          ← root signpost (substantive map of all domains)
domains/               ← all curated content (for the AI)
  ai-tools/            ← models, generation, speech, vision, agents
  dev-tools/           ← frameworks, build, ORMs, testing, CI
  design/              ← UI libraries, design systems, icons, fonts
  productivity/        ← automation, knowledge, scheduling
site/                  ← published Next.js site (for human users)
memory/                ← agent workflow memory (how this repo is built)
.github/workflows/     ← deploy.yml (→ Pages) + validate.yml (lint nav tree)
```

See [`memory/02-repository-structure.md`](./memory/02-repository-structure.md) for the full
folder contract.

## Adding a tool

Each tool is a leaf `.md` under `domains/<domain>/<subdomain>/` with front-matter + a
descriptive body. The maintainer agent researches the tool deeply (reads docs, scrapes the
web as needed, verifies facts), writes the entry, and updates the parent `navigation.md`.
See [`memory/04-adding-content-workflow.md`](./memory/04-adding-content-workflow.md) for the
exact sequence.

## License

MIT — see [`LICENSE`](./LICENSE).
