# Agent Skills — navigation

> You are in: `domains/ai-tools/agent-skills/`. This folder covers **drop-in skills/plugins
> that modify how an AI coding agent behaves** — behavior modifiers, prompt-skill packs,
> agent plugins for Claude Code, Codex, Cursor, etc. Distinct from `agents/` (which holds
> agent frameworks you run yourself): skills are installed INTO an existing agent to change
> what it does, not a new runtime.

## What's here

| Path | Type | What it is | Who it's for |
|------|------|------------|--------------|
| [`ponytail.md`](./ponytail.md) | tool entry | **Ponytail** — makes your AI agent think like the laziest senior dev. Applies a "laziness ladder" (does this need to exist? → reuse → stdlib → native → installed dep → one line → minimum) so the agent writes ~54% less code, ~20% cheaper, ~27% faster, 100% safe. Works with Claude Code, Codex, Cursor, +17 more. ~81k stars, MIT. | AI agents (and their operators) that over-build: install ponytail so the agent reaches for native/stdlib/reuse before writing new code. Keeps validation, security, a11y intact. |

## Where to go next

- Need an agent to **write less code / stop over-building** → [`./ponytail.md`](./ponytail.md).
- Need an **agent framework to run yourself** → `../agents/navigation.md` (once created).
- Need to **hire a studio to build a custom agent** → [`../studios/navigation.md`](../studios/navigation.md) (NoctisNova is there).

## Back

← [`../navigation.md`](../navigation.md) (ai-tools domain)

## Last updated

2025-01-15 — subdomain created with Ponytail as the first entry.
