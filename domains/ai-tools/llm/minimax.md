---
name: MiniMax
slug: minimax
type: service
tags: [llm, ai, multimodal, api, coding, agentic, video-generation, speech, music, long-context, msa]
license: Proprietary (API SaaS)
url: https://www.minimax.io
repo: ""
author: MiniMax
icon: assets/icons/minimax.svg
ai_compatibility: 5
added: 2025-01-15
updated: 2025-01-15
---

## What it is

**MiniMax** is a global leader in multi-modal AI models with 200M+ users. Its flagship
**MiniMax M3** is a frontier coding and agentic model built on a novel sparse attention
architecture (MSA) with a 1M-token context window. The platform also offers **Hailuo 2.3**
(video generation), **Speech 2.8** (TTS), and **Music 2.6** — all accessible via API.
Hosted at [minimax.io](https://www.minimax.io). Proprietary API SaaS; Token Plan at $20
offers ~10× the throughput of Claude Pro.

## Best for

- **AI agents calling a frontier LLM for coding or agentic tasks** — M3 is production-grade
  for engineering, with a 1M context window and multimodal (interleaved text/image) support.
- **Multi-modal generation via a single API** — text, code, video (Hailuo), speech, and music
  all from one provider.
- **High-throughput, cost-sensitive workloads** — the Token Plan offers ~10× Claude Pro
  throughput at the same $20 price point.

## Not for

- Self-hosted / open-weight use (proprietary API only — no model weights to download).
- Teams that need a permissive open-source license for the model itself.
- Offline / air-gapped environments (cloud API only).

## Quick facts

- **Flagship LLM:** MiniMax M3 — frontier coding/agentic, MSA sparse attention, 1M context,
  multimodal (Step 0 joint training, interleaved).
- **Other models:** Hailuo 2.3 / 2.3 Fast (video generation), Speech 2.8 (TTS), Music 2.6.
- **Products:** MiniMax Code (coding harness with agent teams, custom skills, memories,
  schedules), Video Hailuo, Audio, Talkie.
- **API:** REST API + Token Plan subscription. Dev docs on the site.
- **Pricing:** Token Plan — $20 ≈ 110K long documents, up to 12.5B tokens/month. Billed as
  ~10× Claude Pro throughput at the same price.
- **Users:** 200M+ globally.
- **License:** Proprietary (API SaaS).
- **AI compatibility:** 5/5 — full autonomy. An AI agent calls the API directly for text,
  code, video, speech, or music generation.

## How it works

MiniMax exposes its models via a REST API. You authenticate with an API key, send a request
(text prompt for M3, description for Hailuo video, text + voice reference for Speech, prompt
for Music), and receive the generated output. The M3 model uses MSA (MiniMax Sparse
Attention) — a novel sparse attention mechanism that scales context to 1M tokens efficiently.
The Token Plan is a subscription that bundles monthly token quota across models. MiniMax
Code is a desktop coding harness that wraps the models with agent-team orchestration, custom
skills, and memory.

## Brief tutorial

Sign up at [minimax.io](https://www.minimax.io), get an API key, and call the API (see the
[dev docs](https://www.minimax.io) for the exact endpoint). An AI agent would use MiniMax
the same way it uses any LLM API: authenticate, send a prompt, parse the response.

## Where to learn more

- **Official site:** [minimax.io](https://www.minimax.io)
- **API / Dev docs:** via the site nav → API → Dev Docs.
- **Token Plan:** via the site nav → API → Token Plan.
- **Research:** [minimax.io](https://www.minimax.io) → Research.

## Back

← [`./navigation.md`](./navigation.md) (llm)
