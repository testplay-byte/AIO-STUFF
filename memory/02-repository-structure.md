# 02 — Repository Structure

> The canonical folder layout for the AIO-STUFF GitHub repository.
> The live preview's "Structure" tab mirrors this exactly.

## Top-level layout

```
AIO-STUFF/                        ← the GitHub repo root (github.com/testplay-byte/AIO-STUFF)
├── README.md                     ← project intro, points to navigation.md
├── navigation.md                 ← ROOT signpost (substantive map of all domains)
├── LICENSE
├── .gitignore
├── memory/                       ← agent workflow memory (mirrored from the workspace)
│   ├── 00-project-overview.md
│   ├── 01-navigation-system.md
│   ├── 02-repository-structure.md
│   ├── 03-ui-design-language.md
│   ├── 04-adding-content-workflow.md
│   ├── 05-github-workflow.md
│   ├── 06-live-preview-protocol.md
│   ├── 07-agent-operating-rules.md
│   └── 08-communication-protocol.md
├── domains/                      ← ALL curated content lives here (FOR THE AI)
│   ├── ai-tools/
│   │   ├── navigation.md
│   │   ├── llm/
│   │   │   ├── navigation.md
│   │   │   ├── <tool>.md
│   │   │   └── <tool>.md
│   │   ├── image-generation/
│   │   │   ├── navigation.md
│   │   │   └── <tool>.md
│   │   └── speech/
│   │       └── navigation.md
│   ├── dev-tools/
│   │   └── navigation.md
│   ├── design/
│   │   └── navigation.md
│   └── productivity/
│       └── navigation.md
├── site/                         ← the published Next.js site (FOR HUMAN USERS)
│   ├── src/
│   ├── package.json
│   └── next.config.ts
├── dashboard/                    ← backup of the build-dashboard workspace (sandbox recovery)
├── sandbox-backup/               ← manifest + snapshots of sandbox state
│   └── MANIFEST.md
├── access/                       ← the token zip (PENDING security decision — see 05)
└── .github/
    └── workflows/
        ├── deploy.yml            ← builds site/ → publishes to GitHub Pages
        └── validate.yml          ← lints nav tree + build check
```

## Conventions

- **Content root is `domains/`.** Nothing navigable lives above it. This keeps the repo
  root clean and makes the live preview's structure reader trivial.
- **One domain per top-level folder under `domains/`.** Domain names are `kebab-case`,
  plural-friendly, and stable (renaming a domain breaks every deep link).
- **Subdomains nest inside domains.** Same naming rules.
- **Tools are leaf `.md` files.** Filename = tool slug (`kebab-case`). The file's front-matter
  holds the canonical name + metadata; the body holds the entry.
- **`navigation.md` is reserved.** No tool may be named `navigation.md`.
- **`memory/` is agent-only.** It is version-controlled so the workflow is auditable, but it
  is NOT part of the published atlas site. The site generator ignores it.

## Front-matter for a tool entry (leaf .md)

```yaml
---
name: Tool Display Name
slug: tool-display-name
type: tool           # tool | service | library | resource
tags: [llm, api]
license: MIT         # or Proprietary / Unknown
url: https://…
added: 2025-01-15
updated: 2025-01-15
---
```

The body that follows is the human-readable entry (see `04-adding-content-workflow.md`).

## Why this shape

- `domains/` separation means the live preview can walk one folder to render the whole tree.
- `site/` is isolated so GitHub Actions can `cd site && build` without touching content.
- `memory/` at root (not under `domains/`) keeps it out of the published atlas by convention.
