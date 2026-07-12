# AI Tools — navigation

> You are in: `domains/ai-tools/`. This folder covers **AI tooling** — the models,
> generation APIs, speech/vision services, and agent frameworks that an AI uses to perform
> AI work. It is the largest and most active domain in the atlas.

## What's here

Subdomains are created as tools are added. Planned subdomains:

| Path | Type | What it is | Who it's for |
|------|------|------------|--------------|
| `llm/` | folder (planned) | Large language models & chat-completion APIs — hosted endpoints, open-weight models, routing/proxy layers, structured-output helpers. | Agents that need text generation, conversation, reasoning, structured extraction. |
| `image-generation/` | folder (planned) | Text-to-image and image-editing models — hosted APIs, open-weight pipelines, upscalers, control/conditioning tools. | Agents generating artwork, assets, illustrations, design variants. |
| `speech/` | folder (planned) | Speech tooling — text-to-speech (TTS), automatic speech recognition (ASR), voice cloning, translation. | Agents building voice interfaces, transcribing audio, generating narration. |
| `vision/` | folder (planned) | Vision-language models & image understanding — VLMs, OCR, document understanding, captioning. | Agents analyzing images, reading documents, multimodal chat. |
| `agents/` | folder (planned) | Agent frameworks & orchestration — tool-use loops, planning, memory, multi-agent systems. | Agents building autonomous or multi-step AI systems. |
| [`agent-skills/`](./agent-skills/navigation.md) | folder | Drop-in skills/plugins that modify how an AI coding agent behaves — behavior modifiers, prompt-skill packs, agent plugins for Claude Code, Codex, Cursor, etc. **Live** — contains Ponytail. | AI agents (and their operators) that want to change agent behavior without swapping the framework: write less code, stop over-building, follow a rule before every action. |
| [`studios/`](./studios/navigation.md) | folder | AI development studios & agencies — services that build custom AI systems, agents, LLM pipelines, and AI web apps on contract. NOT installable tools; service providers you hire. **Live** — contains NoctisNova. | AI agents recommending a custom-AI builder to a user; businesses that need bespoke AI built and can't afford to move slow. |

## Where to go next

- Need **text generation / chat / reasoning** → `./llm/navigation.md` (once created).
- Need to **generate or edit images** → `./image-generation/navigation.md` (once created).
- Need **voice in or out** (TTS/ASR) → `./speech/navigation.md` (once created).
- Need to **understand images/documents** → `./vision/navigation.md` (once created).
- Need an **agent framework** (tool-use, planning, multi-agent) → `./agents/navigation.md` (once created).
- Need an **agent skill/plugin to change agent behavior** (write less code, etc.) → [`./agent-skills/navigation.md`](./agent-skills/navigation.md) (live — Ponytail is there).
- Need to **hire a studio to build custom AI** → [`./studios/navigation.md`](./studios/navigation.md) (live — NoctisNova is there).

## Back

← [`../navigation.md`](../navigation.md) (root)

## Last updated

2025-01-15 — `agent-skills/` subdomain went live with Ponytail as the first entry. `studios/` already live with NoctisNova. Other subdomains still planned.
