// Structured workflow data for the /workflow timeline page.
// Mirrors memory/10-content-ingestion-workflow.md — if they drift, the
// memory file wins; update this to match.

export type StepKind = "main" | "detour" | "stop"

export interface WorkflowStep {
  id: number | string
  kind: StepKind
  title: string
  // Short explanation snippet shown on the timeline card (1–2 lines).
  snippet: string
  // Full detail (for hover/expand if needed).
  detail: string
  // For detours: which main step ID it branches from.
  branchFrom?: number
  // For detours: where it rejoins the main flow (step id), or null if hard stop.
  rejoins?: number | null
  // Short label for the detour badge (e.g. "A", "B")
  badge?: string
}

export const workflowSteps: WorkflowStep[] = [
  {
    id: 1,
    kind: "main",
    title: "Receive & capture",
    snippet: "Get the name / URL / repo from the user. Log it in recent activity.",
    detail:
      "Get a name / URL / repo / skill-id from the user. Record it in the dashboard's recent activity before doing anything else.",
  },
  {
    id: 2,
    kind: "main",
    title: "Existence check",
    snippet: "grep the repo for the slug, name, URL host, GitHub org/repo. Before any other work.",
    detail:
      "grep the repo for the slug, name, URL host, and GitHub org/repo. This runs before any other work — no exceptions.",
  },
  {
    id: "A",
    kind: "detour",
    badge: "A",
    branchFrom: 2,
    title: "Already exists → stop & ask",
    snippet: "Tell the user where it lives. Never create a duplicate.",
    detail:
      "If the resource is already in the repo, STOP. Tell the user where it lives and ask whether they want it updated, moved, or left alone.",
    rejoins: null,
  },
  {
    id: 3,
    kind: "main",
    title: "Research",
    snippet: "Open the site / docs / repo. Scrape the web. Cross-check via GitHub API.",
    detail:
      "Open the site / docs / repo. Read them. Scrape the web as needed. Cross-check claims against a second source (GitHub API for stars/license, etc.).",
  },
  {
    id: "B",
    kind: "detour",
    badge: "B",
    branchFrom: 3,
    title: "Facts missing → mark Unknown",
    snippet: "Never invent. Unknown / None is always preferable.",
    detail:
      "If a fact can't be verified after research, mark the field Unknown (or None for license). Never invent features, pricing, or stats.",
    rejoins: 4,
  },
  {
    id: 4,
    kind: "main",
    title: "Analyze & understand",
    snippet: "Distill what it is, best-for / not-for, quick facts, and the AI-use angle.",
    detail:
      "Distill: what it is, what it does, best-for / not-for, quick facts, how it works, and the AI-use angle (how an AI agent would use this tool).",
  },
  {
    id: 5,
    kind: "main",
    title: "Classify — pick domain + subdomain",
    snippet: "Decide the top-level domain and subdomain. Use the 3–12 sibling rule.",
    detail:
      "Decide the top-level domain and subdomain. Use the 3–12 sibling rule: if <3 or >12 siblings, flatten or split.",
  },
  {
    id: "C",
    kind: "detour",
    badge: "C",
    branchFrom: 5,
    title: "No domain → create one",
    snippet: "New top-level domain + root navigation.md + dashboard structure.",
    detail:
      "Create a new top-level domain. Add it to root navigation.md. Create the domain folder + navigation.md. Update dashboard structure + distribution.",
    rejoins: 6,
  },
  {
    id: "D",
    kind: "detour",
    badge: "D",
    branchFrom: 5,
    title: "No subdomain → create one",
    snippet: "New subdomain folder + navigation.md + parent domain nav.",
    detail:
      "Create a new subdomain under the best domain. Create the folder + navigation.md (substantive). Add it to the parent domain's navigation.md.",
    rejoins: 6,
  },
  {
    id: 6,
    kind: "main",
    title: "Write the entry",
    snippet: "Front-matter + body. Watch the multi-line **bold** bug.",
    detail:
      "Create domains/<domain>/<subdomain>/<slug>.md with front-matter + body (What it is, Best for / Not for, Quick facts, How it works, Brief tutorial, Where to learn more).",
  },
  {
    id: 7,
    kind: "main",
    title: "Update parent navigation.md",
    snippet: "Add to What's-here table + bump Last updated.",
    detail:
      "Add the tool to the parent subdomain/domain navigation.md What's-here table with a substantive description. Bump Last updated.",
  },
  {
    id: 8,
    kind: "main",
    title: "Update dashboard state",
    snippet: "Bump tools count, mark live in structure tree, refresh distribution.",
    detail:
      "Bump tools count, mark the entry live in the structure tree, refresh distribution, add a recent-activity entry. The dashboard must always match disk.",
  },
  {
    id: 9,
    kind: "main",
    title: "Rebuild the published site",
    snippet: "bun run build. Must succeed + no literal ** in output.",
    detail:
      "cd aio-repo/site && bun run build. Must succeed + produce out/. Verify the new tool page exists and has no literal ** (bold renders as <strong>).",
  },
  {
    id: "E",
    kind: "stop",
    badge: "E",
    branchFrom: 9,
    title: "Build fails → fix before push",
    snippet: "Don't push a broken build. Fix, rebuild, then continue.",
    detail:
      "Hard stop. Fix the error (common: multi-line **bold**, gitignored folder like build/, front-matter syntax). Rebuild. Do NOT push a broken build.",
    rejoins: 10,
  },
  {
    id: 10,
    kind: "main",
    title: "Lint + verify clean",
    snippet: "Dashboard lint passes. No token leak (grep github_pat_).",
    detail:
      "bun run lint (dashboard) must pass. Verify no token leak: grep -rl github_pat_ aio-repo/ must return nothing.",
  },
  {
    id: 11,
    kind: "main",
    title: "Sync memory + state to repo",
    snippet: "Sandbox backup so nothing is lost on a reset.",
    detail:
      "cp memory/*.md aio-repo/memory/ and cp state.ts aio-repo/sandbox-backup/state.ts. Sandbox backup so nothing is lost on a reset.",
  },
  {
    id: 12,
    kind: "main",
    title: "Commit + push to main",
    snippet: "add(tool): <slug> under <domain>/<subdomain>",
    detail:
      'git commit -m "add(tool): <slug> under <domain>/<subdomain> ...". Push via the token.',
  },
  {
    id: 13,
    kind: "main",
    title: "Monitor the Actions deploy",
    snippet: "Poll until completed / success. Pages goes live.",
    detail:
      "Poll the Actions API until the latest run is completed / success. The deploy workflow builds site/ and publishes to GitHub Pages.",
  },
  {
    id: "F",
    kind: "stop",
    badge: "F",
    branchFrom: 13,
    title: "Deploy fails → re-push",
    snippet: "Check the Actions logs. Fix, re-push, re-monitor.",
    detail:
      "Hard stop. Check the Actions logs. Fix the root cause, re-push, re-monitor. Don't report done until deploy is green.",
    rejoins: 13,
  },
  {
    id: 14,
    kind: "main",
    title: "Verify the tool page is live",
    snippet: "curl → HTTP 200. Confirm facts rendered in browser.",
    detail:
      "curl the live URL → must return 200. Open in agent-browser and confirm the key facts rendered (license, stars, name).",
  },
  {
    id: "G",
    kind: "detour",
    badge: "G",
    branchFrom: 14,
    title: "Live page wrong → re-verify",
    snippet: "Fix the source, rebuild, re-push, re-verify.",
    detail:
      "If the live page is wrong or missing content, investigate the source, fix, rebuild, re-push, re-verify. Don't report done until correct.",
    rejoins: 14,
  },
  {
    id: 15,
    kind: "main",
    title: "Verify /explore shows it",
    snippet: "Open /explore/ and confirm the new tool appears.",
    detail:
      "Open /explore/ in agent-browser. Confirm the new tool appears alongside the others.",
  },
  {
    id: 16,
    kind: "main",
    title: "Append worklog",
    snippet: "Task ID, Work Log, Stage Summary, Flagged issues. Append only.",
    detail:
      "Append a --- section with Task ID, Agent, Task, Work Log, Stage Summary, Flagged issues. Append, never overwrite.",
  },
  {
    id: 17,
    kind: "main",
    title: "Report done",
    snippet: "What was added, where it lives, verified facts, flagged issues. Be honest.",
    detail:
      "Tell the user: what was added, where it lives (path + live URL), the key verified facts, any flagged issues. Be honest — don't claim done if any step is incomplete.",
  },
]

// Helper: group detours with their parent step for rendering.
export function stepsWithDetours() {
  const mainSteps = workflowSteps.filter((s) => s.kind === "main")
  return mainSteps.map((step) => ({
    step,
    detours: workflowSteps.filter(
      (d) => d.kind !== "main" && d.branchFrom === step.id,
    ),
  }))
}
