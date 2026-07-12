# Scanners — navigation

> You are in: `domains/security/scanners/`. This folder covers **security scanners** — tools
> that examine source code, configs, chat histories, or entire repositories for
> vulnerabilities, leaked secrets, and supply-chain attacks. Distinct from recon (discovery)
> and pentesting (exploitation): scanners find issues passively by analysis, not by probing
> live systems.

## What's here

| Path | Type | What it is | Who it's for |
|------|------|------------|--------------|
| [`medusa.md`](./medusa.md) | tool entry | **MEDUSA** — AI-first security scanner with 40,000+ detection patterns. Scans AI/ML/agent/LLM/MCP code for vulnerabilities, vets any repo via `--git`, finds leaked API keys in AI chat histories. AGPL-3.0, Python, ~925 stars. | AI agents vetting repos before cloning, scanning code for vulns (Log4Shell, LangChain RCE, MCP RCE…), finding leaked credentials in Claude/Cursor/Copilot chat history, detecting Claude Code supply-chain compromise. |

## Where to go next

- Need to **scan a repo for AI supply-chain attacks before using it** → [`./medusa.md`](./medusa.md) (use `medusa scan --git <URL>`).
- Need to **find leaked API keys in AI chat histories** → [`./medusa.md`](./medusa.md) (use `medusa secrets scan`).
- Need **static analysis of your own AI/ML code** → [`./medusa.md`](./medusa.md) (40,000+ patterns, 200 CVE detections).

## Back

← [`../navigation.md`](../navigation.md) (security domain)

## Last updated

2025-01-15 — subdomain created with Medusa as the first entry.
