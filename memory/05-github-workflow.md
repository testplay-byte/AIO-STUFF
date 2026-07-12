# 05 — GitHub Workflow

> How the repository is created, built, published, and backed up.
> The repo now exists: **https://github.com/testplay-byte/AIO-STUFF**

## Repository facts

- **URL:** https://github.com/testplay-byte/AIO-STUFF
- **Owner:** testplay-byte
- **Visibility:** ⚠️ **PUBLIC** (as of setup). This matters for the token decision below.
- **Default branch:** `main`
- **Token:** fine-grained PAT with admin/push, stored locally at `/home/z/my-project/.gh-token`
  (gitignored, NEVER committed in plaintext).

## What the user did

You created the empty public repo and handed me the URL + a full-control PAT. You do NOT
need to create README/.gitignore/LICENSE — I do all of that.

## Repository layout (lives in `/home/z/my-project/aio-repo/` as a separate git working tree)

```
AIO-STUFF/                        ← the GitHub repo root
├── README.md
├── navigation.md                 ← ROOT signpost (substantive map of all domains)
├── LICENSE
├── .gitignore
├── memory/                       ← agent workflow memory (mirrored from the workspace)
├── domains/                      ← ALL curated content (for the AI)
├── site/                         ← the published Next.js site (for human users)
├── dashboard/                    ← backup of this build-dashboard workspace (sandbox recovery)
├── sandbox-backup/               ← manifest + snapshots of sandbox state
├── access/                       ← the token zip (PENDING — see security flag below)
└── .github/workflows/
    ├── deploy.yml                ← builds site/ → GitHub Pages
    └── validate.yml              ← lints nav tree + build check
```

The workspace at `/home/z/my-project` is the **dashboard dev environment** (this Next.js
app). It is a separate local git repo with NO remote. The AIO-STUFF repo lives in
`/home/z/my-project/aio-repo/` and is pushed to GitHub. The two are synced by the backup
protocol below.

## ⚠️ TOKEN STORAGE — SECURITY FLAG (pending user decision)

You asked me to store the GitHub token in the repo (main branch, root) inside a
password-protected zip whose password is embedded reversed in the filename.

**The problem:** the repo is PUBLIC. Storing a full-control token in a public repo — even
zipped with a reversed-password-in-filename — is effectively publishing it. The obfuscation
(reversed password in the filename) provides no real security: anyone reading the repo can
see the scheme, and the scheme itself is documented in this chat. A leaked token = full
admin control of the repo by anyone.

**Git history makes this irreversible:** even if we delete the file later, the token stays
in history unless we rewrite it (and GitHub's public mirror may already be cached).

**My recommendation (pick one):**
1. **Make the repo PRIVATE** (Settings → General → Danger Zone → Change visibility). Then
   the zip scheme is acceptable (still not best practice, but contained to collaborators).
2. **Do NOT store the token in the repo at all.** Keep it only in the sandbox `.gh-token`
   (gitignored). For sandbox-recovery, you re-paste the token after a reset, OR I store it
   in the zip but ONLY in a private repo. For CI automation, use GitHub Actions secrets.
3. **Rotate the token now** (it was shared in chat, so treat it as exposed) and issue a new
   one stored via option 1 or 2.

I have NOT pushed the token zip yet. I am waiting for your decision per the red-emoji
must-read protocol in `08-communication-protocol.md`.

## Sandbox backup protocol (REGULAR, after each update)

The sandbox environment can be wiped/reset. To survive that, I back up workspace state to
the repo regularly:

1. After each meaningful update (content add, dashboard change, memory edit), I sync:
   - `memory/` → `aio-repo/memory/` (the workflow files).
   - `src/lib/atlas/state.ts` → `aio-repo/sandbox-backup/state.ts`.
   - key dashboard source → `aio-repo/dashboard/` (on milestone pushes).
   - `aio-repo/sandbox-backup/MANIFEST.md` notes what was backed up + when.
2. Commit with `backup(sandbox): <summary>` and push to `main`.
3. On a sandbox reset, I clone AIO-STUFF, restore `memory/` + `state.ts` + dashboard source,
   reinstall deps, and resume.

This is the user's explicit requirement: "back up your sandbox environment to the GitHub
repository regularly. After each update you might push these updates."

## The deploy workflow (`.github/workflows/deploy.yml`)

Trigger: `push` to `main` that touches `domains/**` or `site/**`.

Steps:
1. Checkout.
2. `cd site && bun install && bun run build` with `basePath: /AIO-STUFF`.
3. `next.config.ts` sets `output: 'export'`, `images: { unoptimized: true }`.
4. Upload `site/out/` as the Pages artifact.
5. `actions/deploy-pages` publishes to `https://testplay-byte.github.io/AIO-STUFF/`.

`validate.yml` runs on PRs: lints the navigation tree (every folder has a `navigation.md`,
no orphan leaves, no broken relative links) + builds the site to catch errors before merge.

## Local → remote flow

- I author content in the workspace, then sync to `aio-repo/` and push to `main`.
- GitHub Actions builds + publishes the site.
- The live preview dashboard reads the workspace state (always ahead of the published site
  by exactly one push).

## Branching

- `main` is the source of truth and always deployable.
- For multi-step additions I use a `content/<slug>` branch + PR; for single-tool adds I push
  to `main` directly (small, reviewable commits).

## What I will NOT do

- Force-push `main`.
- Commit the access token in plaintext anywhere (no `.env` in git, no hardcoded strings).
- Push the token zip until you confirm the security decision above.
- Enable unnecessary Actions (only `deploy.yml` + `validate.yml`).
- Touch repo settings beyond Pages source (and visibility, if you approve) once configured.
