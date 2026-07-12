# Security — navigation

> You are in: `domains/security/`. This folder covers **security tooling** — scanners,
> vulnerability detectors, secret finders, supply-chain vetters, reconnaissance and
> penetration-testing tools, and AI-specific security (LLM/agent/MCP attack detection).
> Tools an AI agent uses to secure its own work, vet dependencies before using them, and
> find leaked credentials in its environment.

## What's here

Subdomains are created as tools are added. Current + planned subdomains:

| Path | Type | What it is | Who it's for |
|------|------|------------|--------------|
| [`scanners/`](./scanners/navigation.md) | folder | Static analysis, vulnerability scanners, secret scanners, supply-chain vetters. Tools that examine code/configs/data for security issues. **Live** — contains Medusa. | AI agents vetting repos before cloning, scanning code for vulns, finding leaked credentials, checking AI/ML apps for LLM-specific attacks. |
| `recon/` | folder (planned) | Reconnaissance & OSINT tools — subdomain enumeration, port scanning, asset discovery. | AI agents doing security assessment or bug-bounty research. |
| `pentesting/` | folder (planned) | Penetration-testing & exploitation frameworks. | AI agents performing authorized security testing. |
| `hardening/` | folder (planned) | Hardening & configuration-baseline tools — CIS benchmarks, policy-as-code. | AI agents locking down infrastructure configs. |

## Where to go next

- Need to **scan code for vulnerabilities or leaked secrets** → [`./scanners/navigation.md`](./scanners/navigation.md) (live — Medusa is there).
- Need **recon / OSINT** → `./recon/navigation.md` (once created).
- Need **pentesting / exploitation** → `./pentesting/navigation.md` (once created).
- Need **hardening / policy-as-code** → `./hardening/navigation.md` (once created).

## Back

← [`../navigation.md`](../navigation.md) (root)

## Last updated

2025-01-15 — domain created with `scanners/` subdomain + Medusa as the first entry.
