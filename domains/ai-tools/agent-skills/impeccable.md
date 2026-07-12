---
name: Impeccable
slug: impeccable
type: library
tags: [ai-agent, agent-skill, design, frontend, cli, claude, cursor, codex, design-system, detector-rules, javascript]
license: Apache-2.0
url: https://impeccable.style
repo: https://github.com/pbakaus/impeccable
npm: https://www.npmjs.com/package/impeccable
author: pbakaus
ai_compatibility: 5
added: 2025-01-15
updated: 2025-01-15
---

## What it is

**Impeccable** is a design skill for AI coding agents. It provides 1 skill, 23 commands,
live browser iteration, and 46 deterministic detector rules for AI-generated frontend
design. It started from Anthropic's frontend-design skill and adds a structured design
vocabulary (`polish`, `audit`, `critique`, `distill`, `animate`, `bolder`, `quieter`, and
more) so your AI harness produces better design instead of the same SaaS-template tells.
Source on [GitHub (pbakaus/impeccable)](https://github.com/pbakaus/impeccable),
[impeccable.style](https://impeccable.style). ~46k stars, Apache-2.0, JavaScript. `npx
impeccable install`.

## Best for

- **AI agents (and their operators) that want better frontend design** — install the skill,
  run `/impeccable init` to set up design context, then use the 23 commands to shape, polish,
  and audit the UI.
- **Avoiding "AI design slop"** — the 46 deterministic detector rules catch the common tells
  (Inter-for-everything, purple-to-blue gradients, cards-nested-in-cards, gray-text-on-color,
  rounded-square icon tiles) without needing an LLM.
- **Any Claude / Cursor / Codex workflow** — installs as a skill the agent uses on every
  frontend task.

## Not for

- Non-frontend work (it's a design skill for frontend UI, not backend or infra).
- Agents that don't support skills/plugins (check compatibility).
- Teams that want fully manual design control (it's AI-assisted; you steer via commands).

## Quick facts

- **What it is:** design skill for AI coding agents — 1 skill, 23 commands, 46 deterministic
  detector rules.
- **Commands:** `init`, `craft`, `document`, `extract`, `shape`, `critique`, `audit`,
  `polish`, `bolder`, `quieter`, `distill`, `harden`, `onboard`, `animate`, `colorize`,
  `typeset`, `layout`, `delight`, `overdrive`, and more (23 total).
- **Detector rules:** 46 deterministic (no LLM, no API key needed) + LLM-only critique
  checks. Runs via CLI + browser extension.
- **Install:** `npx impeccable install`, then `/impeccable init` in your AI coding tool.
- **Setup flow:** `init` writes `PRODUCT.md` + offers `DESIGN.md` — captures audience,
  brand/product lane, voice, anti-references, colors, type, components.
- **License:** Apache-2.0 (permissive — commercial use OK).
- **Author:** pbakaus.
- **Stars:** ~45,939 (as of early 2025).
- **AI compatibility:** 5/5 — full autonomy. An AI agent installs it, runs `/impeccable`
  commands, and produces better design directly.

## How it works

Install via `npx impeccable install`. In your AI coding tool (Claude Code, Cursor, Codex),
run `/impeccable init` — it asks about the surface (brand vs. product) and writes
`PRODUCT.md` + `DESIGN.md` so later commands know your design context. Then use the 23
commands: `/impeccable shape` to plan UX before code, `/impeccable critique` for a design
review, `/impeccable polish` for a final pass, `/impeccable bolder` or `/impeccable quieter`
to adjust intensity, etc. The 46 deterministic detector rules run via CLI or browser
extension — no LLM needed — to catch common AI-design tells.

## Brief tutorial

```bash
# Install
npx impeccable install

# In your AI coding tool:
/impeccable init      # one-time setup: gather design context
/impeccable shape     # plan UX/UI before writing code
/impeccable critique  # design review
/impeccable polish    # final pass + shipping readiness
/impeccable bolder    # amplify a boring design
/impeccable quieter   # tone down an overly bold design
```

An AI agent workflow: install impeccable once, run `/impeccable init` per project, then use
the commands throughout the build to produce polished, non-slop frontend design.

## Where to learn more

- **Official site:** [impeccable.style](https://impeccable.style)
- **GitHub:** [pbakaus/impeccable](https://github.com/pbakaus/impeccable) — README, all 23
  commands, detector rules.
- **npm:** [impeccable](https://www.npmjs.com/package/impeccable)

## Back

← [`./navigation.md`](./navigation.md) (agent-skills)
