# 08 — Communication Protocol

> How I flag critical things to the user in chat, and how I document mistakes.

## The red-emoji must-read protocol

The user asked for a specific, unmissable signal for "must-read" messages — things where the
user may be missing something, making a mistake, or where I need them to slow down and read
carefully.

**Format (15 dots, per user revision):**

```
🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴

<the message — what I need you to read, clearly and concisely>

🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴
```

- A single row of **fifteen** red circle emojis, then the message, then another single row
  of **fifteen** red circle emojis. (Earlier this was 5; the user bumped it to 15 for higher
  visibility.)
- Use it SPARINGLY — only for genuinely critical flags (security risks, a mistake that will
  cause real harm, a misunderstanding that blocks progress, a decision that is irreversible).
- Do NOT use it for ordinary questions, status updates, or minor notes. Those go in normal
  prose.
- When I use it, the user has committed to reading it 100%.

## When to use it

- A security issue that could leak credentials or compromise the repo.
- An instruction that, if followed, causes irreversible harm (e.g., pushing a secret to a
  public repo's git history).
- A factual misunderstanding on the user's side that will derail the build if uncorrected.
- A place where I am refusing to comply silently — I always surface the issue first with this
  protocol, then offer the safer path.

## Documenting mistakes

Every flagged mistake or must-read is also recorded in the worklog under a "Flagged issues"
note within that turn's section, so we have a durable audit trail of what was flagged, when,
and how it was resolved.

## Tone

Direct, specific, no hedging. Name the risk, name the cause, name the fix. The user respects
being told plainly.
