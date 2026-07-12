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
| [`brag.md`](./brag.md) | tool entry | **brag** (`/brag`) — turns the project you just built into a short, shareable launch video (music, motion, share copy) with one command. Powered by Hyperframes. Works with Claude Code, Cursor, Codex, Copilot, Gemini CLI, opencode. ~833 stars, Python, no license. | AI agents wrapping up a project: run `/brag` to generate a social-ready launch clip without leaving the agent. Steer tone via `--tone`. |

## Where to go next

- Need an agent to **write less code / stop over-building** → [`./ponytail.md`](./ponytail.md).
- Need to **turn a finished project into a launch video** → [`./brag.md`](./brag.md).
- Need an **agent framework to run yourself** → `../agents/navigation.md` (once created).
- Need to **hire a studio to build a custom agent** → [`../studios/navigation.md`](../studios/navigation.md) (NoctisNova is there).

## Back

← [`../navigation.md`](../navigation.md) (ai-tools domain)

## Last updated

2025-01-15 — added brag as the second entry (agent skill for launch videos). Ponytail was the first.
