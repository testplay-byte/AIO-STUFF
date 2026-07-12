# Agent Skills — navigation

> You are in: `domains/ai-tools/agent-skills/`. This folder covers **drop-in skills/plugins
> that modify how an AI coding agent behaves** — behavior modifiers, prompt-skill packs,
> agent plugins for Claude Code, Codex, Cursor, etc.

## What's here

| Path | Type | What it is | Who it's for |
|------|------|------------|--------------|
| [`ponytail.md`](./ponytail.md) | tool | **Ponytail** — makes your AI agent think like the laziest senior dev. 7-rung "laziness ladder" (YAGNI → reuse → stdlib → native → dep → one-liner → minimum). ~54% less code, 100% safe. Works with 20 agents. ~81k stars, MIT. | AI agents that over-build: install so the agent reaches for native/stdlib/reuse first. AI compat: 5/5. |
| [`brag.md`](./brag.md) | tool | **brag** (`/brag`) — turns a finished project into a short shareable launch video (music, motion, share copy). Powered by Hyperframes. Works with 20 agents. ~833 stars, Python, no license. | AI agents wrapping up a project: run `/brag` to generate a social-ready launch clip. AI compat: 4/5. |
| [`impeccable.md`](./impeccable.md) | library | **Impeccable** — design skill for AI coding agents. 1 skill, 23 commands, 46 deterministic detector rules for AI-generated frontend design. Catches "AI design slop" tells. `npx impeccable install`. ~46k stars, Apache-2.0. | AI agents that want better frontend design — install, run `/impeccable init`, use commands like `polish`, `critique`, `bolder`. AI compat: 5/5. |

## Where to go next

- Need an agent to **write less code / stop over-building** → [`./ponytail.md`](./ponytail.md).
- Need to **turn a finished project into a launch video** → [`./brag.md`](./brag.md).
- Need an agent to **produce better frontend design** → [`./impeccable.md`](./impeccable.md).

## Back

← [`../navigation.md`](../navigation.md) (ai-tools domain)

## Last updated

2025-01-15 — added Impeccable as the third entry. Ponytail and brag were the first two.
