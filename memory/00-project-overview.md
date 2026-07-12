# 00 — Project Overview

> The single source of truth for **what** we are building and **why**.
> Read this first, every session.

## What we are building

**AIO-STUFF** (repo slug and display name) is a **curated, navigable directory of tools,
skills, and resources for AI**, published as a public GitHub repository at
https://github.com/testplay-byte/AIO-STUFF.

It is *not* a flat link list. It is an **organized knowledge map** where every domain is
broken into subdomains, and every level of the tree carries its own `navigation.md` that
tells the reader — in escalating, substantive detail — what lives there, what it is for,
and where to go next.

## The two audiences (IMPORTANT)

1. **The GitHub repository itself** (the `.md` files under `domains/` + `navigation.md`) is
   **for the AI**. An AI agent navigates the repo to find the right tool/skill/resource for
   its project. That is *why* the files are markdown and *why* every `navigation.md` is
   detailed enough for an AI to understand what a branch contains and decide if it is what
   it needs.
2. **The live preview / published site** is **for human users** — a beautiful, visual,
   easy-to-navigate webpage where they can see what the atlas offers and browse it
   comfortably.

These are two faces of the same content: machine-readable repo for AI, polished site for
humans.

## The core idea (one sentence)

> An AI (or human) lands at the root `navigation.md`, reads a *substantive* map of the
> domains, picks a branch, opens that branch's `navigation.md` for *more focused* context,
> and repeats until it lands on the exact tool it was looking for — **progressive disclosure
> by directory**. Each `navigation.md` is detailed enough to make the next decision
> confidently, never a vague one-liner.

## Who does what

- **You (the user)** provide:
  - The GitHub repository + a fine-grained access token with full control.
  - Resources to add — a tool, a skill, a website, a library, etc. You point; I do the rest.
- **I (the agent)** do **almost all of the work**:
  - Receive a resource, **deeply research and analyze it** (read its site/docs, scrape the
    web for facts, verify claims).
  - **Document it thoroughly** — write the entry + front-matter, never inventing facts.
  - **Classify and place it** in the right domain/subdomain, creating folders as needed.
  - Write and maintain every `navigation.md`.
  - Build and maintain the published site + the GitHub Actions → Pages pipeline.
  - Keep the live preview dashboard in sync with disk.
  - Back up the sandbox state to the repo regularly so nothing is lost on a reset.

## Non-goals (explicitly out of scope) — REVISED

- We are **not** writing exhaustive step-by-step tutorials per tool — but we **do** include
  short/vague tutorials when a tool genuinely needs one to be understood. Default: descriptive
  + navigational entry; add a brief how-to only when it adds real value.
- We **ARE** researching/scraping the web. When you hand me a tool or website, I analyze it,
  scrape its docs/site as needed, verify the facts, and write the documentation. This is a
  core activity, not a non-goal.
- We are **not** building auth, accounts, or a backend database. The atlas is static content;
  the live preview dashboard is a read-only build command-center (this workspace), and the
  published site is a static export.

## Success looks like

- An AI agent can clone the repo, open the root `navigation.md`, and reach the right tool in
  ≤ 3 branch decisions — reading only the context it needs at each step.
- A human user opens the published site and immediately sees, visually, what the atlas offers.
- The live preview always reflects the true current state of the repository.
- The design is clean, modern, responsive, dark-mode capable, and free of "AI slop".

## Mistake handling (see memory/08)

When you make a mistake or I need to flag something critical you may be missing, I will use
the **red-emoji must-read protocol** defined in `08-communication-protocol.md`. I also record
every flagged mistake in the worklog so we have a durable audit trail.
