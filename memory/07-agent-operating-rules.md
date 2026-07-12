# 07 — Agent Operating Rules

> The rules I (the agent) follow on every single turn. Non-negotiable.

## 1. Read before writing

- Before doing any work, read `/home/z/my-project/worklog.md` to see what previous turns
  produced.
- Read the relevant `memory/*.md` file(s) for the task at hand.
- Re-read `00-project-overview.md` at the start of every session — it is cheap and prevents
  drift.

## 2. Update memory when corrected

When you correct my understanding, I update the affected `memory/*.md` file **that same
turn** and note the change in the live preview's recent-activity feed. Memory is the
durable record; the chat is ephemeral.

## 3. Never claim done without browser proof

"It compiles" / "server is up" is never sufficient. I must run the agent-browser
self-check on `/` and confirm: renders, interactions work, responsive, sticky footer, no
console/runtime errors. Only then report done.

## 4. The dashboard is the contract

If the live preview says "3 tools" but `domains/` has 2, that is a bug I fix immediately.
The dashboard must always match disk. Hardcoded dashboard numbers that drift from reality
are the #1 trust failure mode.

## 5. No slop

Before reporting any UI done, run the "would a human designer ship this?" test from
`03-ui-design-language.md`. If it fails, cut decoration and tighten — do not add more.

## 6. Small, named commits

Every content change is one logical commit with the convention from
`04-adding-content-workflow.md` Step 6. No mega-commits.

## 7. Append, never overwrite, the worklog

Every turn ends by **appending** a `---` section to `/home/z/my-project/worklog.md` with
Task ID, Agent, Task, Work Log, Stage Summary. Never overwrite previous sections.

## 8. Ask when blocked on facts

If a tool's facts are missing or a placement is genuinely ambiguous, I ask — I do not
guess and ship. `Unknown` in a field is always preferable to a fabricated value.

## 9. Keep the live preview running

`bun run dev` stays running in the background on port 3000. I check `dev.log` after
meaningful changes. No duplicate dev instances.

## 10. One route only

The user only sees `/` (`src/app/page.tsx`). No extra routes for the live preview. Sub-pages
of the published *atlas site* (in `site/`) are a separate concern and live in the repo, not
here.

## 11. Highlight the user's mistakes (per user request)

The user explicitly asked: "I might make some mistakes. I want you to properly and clearly
highlight my mistakes and also document it in your reports." So when I notice a mistake or a
misunderstanding on the user's side, I:
- Flag it clearly using the red-emoji must-read protocol in `08-communication-protocol.md`.
- Record it in the worklog under a "Flagged mistakes" note so we have a durable audit trail.
- Do not silently comply with a harmful instruction; surface the issue first.

## 12. Token security

- Never commit the GitHub token in plaintext. It lives only in `/home/z/my-project/.gh-token`
  (gitignored) for the session.
- Storing the token in a PUBLIC repo is an active vulnerability — flag it (see `05` and `08`).
- Do not push secrets until the user confirms the security decision.

## 13. Regular sandbox backups

After each meaningful update, sync workspace state to the AIO-STUFF repo per the backup
protocol in `05-github-workflow.md`. Do not let work be lost to a sandbox reset.
