# Recon — navigation

> You are in: `domains/security/recon/`. This folder covers **reconnaissance & OSINT tools**
> — subdomain enumeration, port scanning, technology fingerprinting, asset discovery, scope
> validation. Tools that map an attack surface passively before any testing begins. Distinct
> from `scanners/` (which examine code/configs for vulnerabilities) and `pentesting/` (which
> actively probes/exploits). Recon finds the targets; scanners find issues in them; pentesting
> verifies by attacking them.

## What's here

| Path | Type | What it is | Who it's for |
|------|------|------------|--------------|
| [`reconforge.md`](./reconforge.md) | tool entry | **ReconForge** — AI-assisted recon toolkit for bug bounty hunters and security researchers. Subdomain discovery (crt.sh), concurrent port scanning, tech detection, scope checking (wildcards/CIDR/IP ranges), markdown reports, AI triage prompts for analyzing HTTP responses/auth flows/APIs. Python, MIT, ~28 stars. | AI agents doing authorized security assessment or bug-bounty research: map an attack surface, fingerprint targets, then feed findings to an LLM via the bundled triage prompts. |

## Where to go next

- Need to **discover subdomains, scan ports, fingerprint tech, or validate bug-bounty scope** → [`./reconforge.md`](./reconforge.md).
- Need to **scan code for vulnerabilities or leaked secrets** → [`../scanners/navigation.md`](../scanners/navigation.md) (Medusa is there).
- Need **active penetration testing / exploitation** → `../pentesting/navigation.md` (once created).

## Back

← [`../navigation.md`](../navigation.md) (security domain)

## Last updated

2025-01-15 — subdomain created with ReconForge as the first entry.
