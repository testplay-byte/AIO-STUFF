---
name: ReconForge
slug: reconforge
type: tool
tags: [security, recon, osint, bug-bounty, penetration-testing, subdomain-enumeration, port-scanning, tech-detection, python, cli, ai-triage]
license: MIT
url: https://github.com/ferasbusiness666/ReconForge
repo: https://github.com/ferasbusiness666/ReconForge
pypi: https://pypi.org/project/reconforge/
author: ferasbusiness666
icon: assets/icons/reconforge.svg
ai_compatibility: 4
added: 2025-01-15
updated: 2025-01-15
---

## What it is

**ReconForge** is an AI-assisted reconnaissance toolkit for bug bounty hunters and security
researchers. It combines practical recon automation (subdomain discovery, port scanning,
tech fingerprinting, scope validation) with structured AI triage prompts so authorized
testers can move from raw findings to prioritized hypotheses faster. Source on
[GitHub (ferasbusiness666/ReconForge)](https://github.com/ferasbusiness666/ReconForge),
install via `pip install reconforge`. ~28 stars, MIT, Python 3.9+.

## Best for

- **AI agents doing authorized security assessment or bug-bounty research** — map an attack
  surface (subdomains, open ports, tech stack) then feed the findings to an LLM via the
  bundled AI triage prompts to prioritize next steps.
- **Bug bounty hunters validating scope** — `reconforge scopecheck` confirms targets against
  exact hosts, wildcards, IP ranges, and CIDR blocks before you touch them.
- **Quick recon of a single target** — subdomains → ports → tech → report in one CLI,
  with clean markdown output.

## Not for

- Vulnerability scanning of source code (use Medusa in `../scanners/` for that — ReconForge
  maps the surface, it doesn't audit code).
- Active exploitation / penetration testing (recon is passive discovery, not attacking).
- Unauthorized testing — only use against systems you own or are explicitly authorized to
  test. Scope checking is built in precisely to keep you within bounds.

## Quick facts

- **Recon capabilities:** subdomain discovery (via crt.sh certificate transparency logs),
  concurrent port scanning (ThreadPoolExecutor, configurable ports), technology detection
  (from headers, cookies, body signals), scope checking (exact hosts, wildcards, IP ranges,
  CIDR blocks).
- **AI angle:** structured AI triage prompts for analyzing HTTP responses, auth flows, APIs,
  and more — drop findings into an LLM to get prioritized hypotheses.
- **Reports:** professional markdown reports with findings, technologies, and collection notes.
- **Terminal UI:** rich tables, status indicators, progress spinners.
- **Platform:** cross-platform Python (3.9+).
- **Install:** `pip install reconforge` (PyPI) or from source.
- **License:** MIT (permissive — fine for commercial use).
- **Author:** ferasbusiness666.
- **Stars:** ~28 (as of early 2025 — newer project, actively maintained).

## How it works

ReconForge is a single Python CLI (`reconforge`) with subcommands per recon phase. Subdomain
discovery queries crt.sh certificate transparency logs. Port scanning uses a
ThreadPoolExecutor for concurrency across a configurable port list (defaults to the common
80/443/8080/8443/22/21/3306/6379). Technology detection fingerprints the stack from HTTP
headers, cookies, and response-body signals. Scope checking parses a scope file (exact hosts,
`*.wildcard` patterns, IP ranges, CIDR blocks) and validates target lists against it. Reports
are rendered as markdown. The AI triage prompts are structured text templates you feed, along
with collected findings, to an LLM to get prioritized next-step hypotheses.

## Brief tutorial

```bash
# Install
pip install reconforge

# Discover subdomains via certificate transparency
reconforge subdomains -d example.com

# Scan common ports (concurrent)
reconforge portscan -t api.example.com
# Custom ports
reconforge portscan -t api.example.com --ports 80,443,3000,5000

# Fingerprint web technologies
reconforge techdetect -u https://api.example.com

# Validate targets against your bug-bounty scope
reconforge scopecheck -t targets.txt -s scope.txt

# Generate a full markdown report
reconforge report -d example.com --output report.md
```

An AI agent workflow: run `reconforge report -d <target>` to gather the full recon picture,
then paste the markdown report + the bundled AI triage prompts into an LLM to get a
prioritized list of where to dig deeper.

## Where to learn more

- **GitHub:** [ferasbusiness666/ReconForge](https://github.com/ferasbusiness666/ReconForge) —
  README, issues, releases.
- **PyPI:** [reconforge](https://pypi.org/project/reconforge/)

## Back

← [`./navigation.md`](./navigation.md) (recon)
