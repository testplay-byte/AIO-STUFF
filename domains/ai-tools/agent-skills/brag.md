---
name: brag
slug: brag
type: tool
tags: [ai-agent, agent-skill, agent-plugin, claude-code, cursor, codex, copilot, gemini-cli, video-generation, launch-video, marketing, python, hyperframes]
license: None
url: https://latent-spaces.github.io/brag/
repo: https://github.com/latent-spaces/brag
author: latent-spaces
added: 2025-01-15
updated: 2025-01-15
---

## What it is

**brag** (invoked as `/brag`) is an agent skill that turns the project you just built into a
short, shareable launch video — music, motion, and share copy included — with one command.
It owns the story (product angle, tone, which moments to show) and hands a focused brief to
[Hyperframes](https://hyperframes.heygen.com/), which builds, times, and renders the video.
Source on [GitHub (latent-spaces/brag)](https://github.com/latent-spaces/brag), launch site
[latent-spaces.github.io/brag](https://latent-spaces.github.io/brag/). ~833 stars, Python,
no license (verify before commercial use). Works with Claude Code, Cursor, Codex, Copilot,
Gemini CLI, opencode, and any agent that supports skills.

## Best for

- **AI agents wrapping up a project** — run `/brag` to generate a launch video + share copy
  without leaving the agent. One command, no manual video editing.
- **Solo devs / small teams who ship fast** — turn a finished project into a social-ready
  launch clip in seconds. Steer the tone: `/brag --tone "fake Series A launch from 2016"`.
- **Any agent-skills-compatible workflow** — works with Claude Code (plugin marketplace),
  Cursor/Codex/Copilot/Gemini CLI/opencode (via the `skills` CLI), or by copying the skill
  directly.

## Not for

- Long-form / tutorial videos (it's a short launch clip, not a screencast).
- Projects where you need full manual control over the video (brag owns the story; you steer
  tone but don't edit frame-by-frame).
- Commercial use without verifying the license — the repo has **no license file**, which
  means "all rights reserved" by default. Confirm with the author before any commercial use.

## Quick facts

- **What it produces:** a `brag-output/` folder with the plan, a composition brief, share
  copy, and the rendered `brag.mp4` video.
- **Powered by:** [Hyperframes](https://hyperframes.heygen.com/) for video build/timing/render.
- **Bundled assets:** music (ende.app "Happy Beats / Business Moves") + SFX (Kenney).
- **Compatibility:** Claude Code (plugin marketplace), Cursor / Codex / Copilot / Gemini CLI
  / opencode (via `npx skills add`), or copy `skills/brag/` directly into the agent's skill
  directory. Symlinks at `.claude/`, `.agents/`, `.opencode/` for auto-discovery.
- **Requirements:** an agent that supports skills, Node.js 22+, FFmpeg on PATH, Hyperframes
  CLI (`npx hyperframes`).
- **License:** **None** — no license file in the repo. Treat as all-rights-reserved; confirm
  with the author before commercial use.
- **Author:** latent-spaces.
- **Stars:** ~833 (as of early 2025).
- **Language:** Python (skill logic) + JS (Hyperframes integration).

## How it works

`/brag` is an agent skill that owns the *story* — it reads your project, picks the product
angle, tone, and which moments to show, then writes a focused composition brief. That brief
is handed to Hyperframes, which builds the visual sequence, times the motion to the bundled
music, and renders the final `brag.mp4`. The skill ships with references and bundled
music/SFX so you don't need to source audio. You steer the output via a `--tone` flag.

## Brief tutorial

```bash
# Claude Code (two separate prompts)
/plugin marketplace add latent-spaces/brag
/plugin install brag@brag

# Any other agent (Cursor, Codex, Copilot, Gemini CLI, opencode)
npx skills add https://github.com/latent-spaces/brag --skill brag
# Add -g to install globally; drop it to scope to current project.

# Use it — from any project directory, ask your agent:
let's /brag
# Or steer the tone:
/brag --tone "fake Series A launch from 2016"
```

Output lands in `brag-output/` (plan, composition brief, share copy, `brag.mp4`).

An AI agent workflow: after shipping a feature/project, run `/brag` to generate a launch
clip you can post immediately.

## Where to learn more

- **Launch site:** [latent-spaces.github.io/brag](https://latent-spaces.github.io/brag/) —
  the looping video there was made by `/brag` on its own repo.
- **GitHub:** [latent-spaces/brag](https://github.com/latent-spaces/brag) — README, skill
  source, examples, docs.
- **Browse on skills.sh:** [skills.sh/latent-spaces/brag/brag](https://www.skills.sh/latent-spaces/brag/brag)

## Back

← [`./navigation.md`](./navigation.md) (agent-skills)
