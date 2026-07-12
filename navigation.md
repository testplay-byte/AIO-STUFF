# AIO-STUFF — navigation

> You are at the **root** of the AIO-STUFF repository. This file is the top-level signpost
> for the entire atlas. Every domain below has its own `navigation.md` that zooms in on
> that domain only — read the one-line orienting description here, then follow the link for
> the full, detailed context.

## What this repository is

AIO-STUFF is a curated, navigable directory of **tools, skills, services, libraries, and
resources for AI agents**. It is organized as a folder tree where every folder carries its
own `navigation.md`. An AI (or human) navigates from this root down to a specific tool in
≤ 3 branch decisions, reading only the context relevant to each step.

The content lives under `domains/`. Each top-level domain is a broad category; inside each
domain are subdomains; inside each subdomain are the actual tool entries (leaf `.md` files).

## What's here

| Path | Type | What it is | Who it's for |
|------|------|------------|--------------|
| `domains/ai-tools/` | folder | AI tooling: models, generation (text/image/audio/video), speech, vision, agents. The largest domain — everything an AI uses to do AI work. | AI agents building apps that need LLMs, image gen, TTS/ASR, vision, etc. |
| `domains/dev-tools/` | folder | Software-development tooling: frameworks, build tools, ORMs, testing, CI, editors, language servers. | AI agents writing or scaffolding code, debugging, setting up pipelines. |
| `domains/design/` | folder | Design & frontend: UI component libraries, design systems, icon sets, fonts, prototyping, accessibility tooling. | AI agents building user interfaces or picking a visual direction. |
| `domains/security/` | folder | Security tooling: scanners, vulnerability detectors, secret finders, supply-chain vetters, recon, pentesting, AI-specific security (LLM/agent/MCP attack detection). | AI agents vetting repos before using them, scanning code for vulns, finding leaked credentials, securing AI apps. |
| `domains/productivity/` | folder | Productivity & automation: note systems, automation/glue platforms, knowledge management, scheduling, doc tools. | AI agents helping with workflows, knowledge bases, recurring tasks. |
| `memory/` | folder | Agent workflow memory (how this repo is built & maintained). NOT part of the published atlas — operational only. | The maintainer agent (and anyone auditing the build process). |
| `site/` | folder | The published Next.js website that renders this atlas for human users (static export → GitHub Pages). | Human users browsing the atlas visually. |
| `dashboard/` | folder | Backup of the build-dashboard workspace (sandbox recovery). | The maintainer agent. |
| `sandbox-backup/` | folder | Manifest + snapshots of sandbox state, pushed regularly so nothing is lost on a sandbox reset. | The maintainer agent. |
| `.github/workflows/` | folder | CI: `deploy.yml` (build site/ → GitHub Pages) and `validate.yml` (lint the navigation tree). | Automation. |

## Where to go next

- **If you want an AI capability** (a model, image generator, speech tool, vision API, agent
  framework) → go to [`./domains/ai-tools/navigation.md`](./domains/ai-tools/navigation.md).
- **If you want a software-engineering tool** (framework, build tool, ORM, test runner, CI
  helper, editor plugin) → go to [`./domains/dev-tools/navigation.md`](./domains/dev-tools/navigation.md).
- **If you want a UI/design resource** (component library, design system, icons, fonts,
  a11y tool) → go to [`./domains/design/navigation.md`](./domains/design/navigation.md).
- **If you want a security tool** (vulnerability scanner, secret finder, supply-chain vetter,
  recon, pentesting, AI-security) → go to [`./domains/security/navigation.md`](./domains/security/navigation.md).
- **If you want a productivity/automation tool** (automation platform, knowledge tool,
  scheduler, doc system) → go to [`./domains/productivity/navigation.md`](./domains/productivity/navigation.md).
- **If you are the maintainer agent** and need the build/maintenance workflow → read
  [`./memory/`](./memory/) (start at `00-project-overview.md`).

## Last updated

2025-01-15 — added the `security/` domain (5th top-level domain) with `scanners/` subdomain +
Medusa as the first entry. Other domains unchanged.
