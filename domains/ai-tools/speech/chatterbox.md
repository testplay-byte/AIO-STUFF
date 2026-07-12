---
name: Chatterbox
slug: chatterbox
type: library
tags: [tts, text-to-speech, voice-cloning, speech, ai, open-source, python, multilingual, voice-agent, paralinguistic]
license: MIT
url: https://resemble-ai.github.io/chatterbox_demopage/
repo: https://github.com/resemble-ai/chatterbox
pypi: https://pypi.org/project/chatterbox-tts/
author: Resemble AI
ai_compatibility: 5
added: 2025-01-15
updated: 2025-01-15
---

## What it is

**Chatterbox** is a family of state-of-the-art, open-source text-to-speech (TTS) models by
Resemble AI. It includes a multilingual model (V3, 500M params, 23+ languages), a
low-latency English model (Turbo, 350M, with paralinguistic tags like `[laugh]` and
`[chuckle]`), dedicated single-language finetunes, and the original Chatterbox with
creative-control knobs. Zero-shot voice cloning from a short reference clip. Source on
[GitHub (resemble-ai/chatterbox)](https://github.com/resemble-ai/chatterbox),
[demo page](https://resemble-ai.github.io/chatterbox_demopage/). ~25k stars, MIT, Python 3.11.
`pip install chatterbox-tts`.

## Best for

- **AI agents generating speech from text** — narration, voice agents, multilingual content,
  creative workflows. Fully agent-usable: `pip install chatterbox-tts`, load a model,
  `model.generate(text)`, save the WAV.
- **Low-latency voice agents** — Chatterbox-Turbo (350M, English) is built for production
  voice agents with reduced compute/VRAM and one-step mel decoding.
- **Multilingual voice cloning** — V3 clones a voice across 23+ languages with stable speaker
  similarity.

## Not for

- Real-time streaming TTS at sub-100ms without optimization (Turbo is fast but still
  batch-oriented; Resemble's hosted API offers sub-200ms for production).
- Non-Python environments (Python 3.11, requires PyTorch + CUDA/MPS for best performance).
- Speech recognition / transcription (it's TTS only — ASR is a different tool).

## Quick facts

- **Models:** Chatterbox-Multilingual V3 (500M, 23+ languages), Chatterbox-Turbo (350M,
  English, paralinguistic tags, one-step mel decode), Single Language Pack (6 dedicated
  finetunes), original Chatterbox (500M, English, CFG + exaggeration controls).
- **Voice cloning:** zero-shot from a ~10s reference clip.
- **Paralinguistic tags (Turbo):** `[cough]`, `[laugh]`, `[chuckle]`, and more for realistic
  speech.
- **Languages:** 23+ in V3 (broad coverage); English in Turbo/original; 6 dedicated
  single-language finetunes.
- **Install:** `pip install chatterbox-tts` (or from source).
- **Runtime:** Python 3.11, PyTorch, CUDA/MPS/CPU (GPU recommended).
- **License:** MIT (permissive — commercial use OK).
- **Author:** Resemble AI.
- **Stars:** ~25,485 (as of early 2025).
- **HuggingFace Spaces:** live demos for each model (try before installing).
- **AI compatibility:** 5/5 — full autonomy. An AI agent installs, loads, and generates speech
  directly.

## How it works

Chatterbox models are PyTorch-based. You load a model via `ChatterboxTTS.from_pretrained()`
(English), `ChatterboxMultilingualTTS.from_pretrained()` (23+ languages), or
`ChatterboxTurboTTS.from_pretrained()` (low-latency English). Call `model.generate(text,
audio_prompt_path=ref_clip.wav)` for zero-shot voice cloning, or `model.generate(text)` for
the default voice. Returns a waveform you save with `torchaudio.save()`. The Turbo model
distills the mel decoder to a single step for speed; V3 optimizes for speaker similarity and
reduced hallucination across languages.

## Brief tutorial

```python
import torchaudio as ta
from chatterbox.tts_turbo import ChatterboxTurboTTS

# Load the Turbo model (English, low-latency)
model = ChatterboxTurboTTS.from_pretrained(device="cuda")

# Generate with paralinguistic tags + voice cloning
text = "Hi there, Sarah here from MochaFone [chuckle], have you got a minute?"
wav = model.generate(text, audio_prompt_path="your_10s_ref_clip.wav")
ta.save("output.wav", wav, model.sr)
```

An AI agent workflow: install chatterbox-tts, load the appropriate model for the task
(Turbo for English voice agents, V3 for multilingual), generate speech from text, save the
audio file.

## Where to learn more

- **Demo page:** [resemble-ai.github.io/chatterbox_demopage](https://resemble-ai.github.io/chatterbox_demopage/)
- **GitHub:** [resemble-ai/chatterbox](https://github.com/resemble-ai/chatterbox) — README,
  model zoo, installation, usage.
- **PyPI:** [chatterbox-tts](https://pypi.org/project/chatterbox-tts/)
- **HuggingFace:** [ResembleAI spaces](https://huggingface.co/ResembleAI) — live demos.
- **Discord:** [join](https://discord.gg/rJq9cRJBJ6) — community.

## Back

← [`./navigation.md`](./navigation.md) (speech)
