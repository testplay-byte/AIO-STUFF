---
name: MEDUSA
slug: medusa
type: tool
tags: [security, sast, scanner, ai-security, llm-security, mcp, secret-scanning, supply-chain, python, cli, cve-detection]
license: AGPL-3.0
url: https://pantheonsecurity.io
repo: https://github.com/Pantheon-Security/medusa
pypi: https://pypi.org/project/medusa-security/
author: Pantheon Security
ai_compatibility: 5
added: 2025-01-15
updated: 2025-01-15
---

## What it is

**MEDUSA** is an AI-first security scanner with 40,000+ detection patterns, built to secure
AI/ML applications, LLM agents, MCP servers, RAG pipelines, and traditional code. Install
via `pip install medusa-security` and scan immediately — no external tool installation
required. Source on [GitHub (Pantheon-Security/medusa)](https://github.com/Pantheon-Security/medusa),
homepage [pantheonsecurity.io](https://pantheonsecurity.io). ~925 stars, AGPL-3.0, Python 3.10+.

## Best for

- **AI agents vetting repos before cloning or depending on them** — `medusa scan --git <URL>`
  structurally checks for repo poisoning, prompt injection, MCP tool poisoning, and Claude
  Code `.claude/` compromise (poisoned hooks, over-broad permissions, dropper skills) *before*
  you clone.
- **Finding leaked credentials in your own AI chat history** — `medusa secrets scan` searches
  Claude / Cursor / Copilot / Zed / Gemini chat logs + bash/zsh/psql history for 21 issuer
  types (Anthropic, OpenAI, PyPI, GitHub PATs, AWS, GCP, Stripe, Slack…), with interactive
  `purge` + byte-identical backup.
- **Static analysis of AI/ML codebases** — 40,000+ patterns + 200 CVE detections (Log4Shell,
  Spring4Shell, XZ Utils, LangChain RCE, MCP-Remote RCE, React2Shell) across Python, JS/TS,
  Rust, PHP.

## Not for

- Dynamic / runtime penetration testing (it's a static scanner, not an active prober — see
  the planned `pentesting/` subdomain for that).
- Real-time WAF / network-level threat detection (it scans files, not traffic).
- Closed-source / proprietary redistribution (AGPL-3.0 requires source disclosure for
  distributed modifications).

## Quick facts

- **Detection patterns:** 40,000+ (harvested from 8,466 AI-security research papers,
  false-positive-hardened).
- **CVE coverage:** 200+ including Log4Shell, Spring4Shell, XZ Utils backdoor, LangChain RCE,
  MCP remote code execution, React2Shell.
- **Languages scanned:** Python, JavaScript/TypeScript, Rust (22 native rules), PHP (16 native
  rules), plus config/data files.
- **Secret scanning:** 21 issuer types across AI chat histories + shell REPL histories.
- **Platform:** Windows, macOS, Linux (cross-platform, multi-core parallel processing).
- **IDE integration:** Claude Code, Cursor, VS Code, Gemini CLI.
- **Reports:** JSON, HTML, Markdown, SARIF exports.
- **Config:** `.medusa.yml` for project-specific settings; smart content-hash caching for
  fast rescans.
- **Optional linters:** auto-detects `bandit`, `eslint`, `shellcheck`, etc. if installed.
- **License:** AGPL-3.0 (strong copyleft — source disclosure required for distributed derivatives).
- **Author:** Pantheon Security.
- **Stars:** ~925 (as of early 2025).

## How it works

MEDUSA ships 40,000+ built-in detection patterns as a pip-installable Python package — no
external toolchain needed. It walks your codebase (or a cloned remote repo) in parallel across
cores, applying pattern rules + structural rules (Rust/PHP/JS/Python) + an always-on
attack-signature scanner that catches jailbreak/prompt-injection payloads in data files and
prose. Findings are deduplicated, severity-ranked, and exportable to JSON/HTML/MD/SARIF. The
`secrets` subcommand separately greps AI chat histories and shell logs for credential patterns,
with an interactive purge flow that backs up before redacting.

## Brief tutorial

```bash
# Install
pip install medusa-security

# Scan any repo for AI supply-chain attacks BEFORE cloning
medusa scan --git https://github.com/some/repo

# Scan your current project
medusa scan

# Find leaked API keys in your AI chat + shell history
medusa secrets scan

# Interactive redaction with backup
medusa secrets purge

# Export findings as SARIF for CI
medusa scan --format sarif -o findings.sarif
```

An AI agent workflow: before using an unfamiliar repo, run `medusa scan --git <URL>` to vet
it; before committing, run `medusa scan` on your own code; periodically run
`medusa secrets scan` to catch credentials you may have pasted into chat.

## Where to learn more

- **Official site:** [pantheonsecurity.io](https://pantheonsecurity.io)
- **GitHub:** [Pantheon-Security/medusa](https://github.com/Pantheon-Security/medusa) — README,
  issues, releases.
- **PyPI:** [medusa-security](https://pypi.org/project/medusa-security/)

## Back

← [`./navigation.md`](./navigation.md) (scanners)
