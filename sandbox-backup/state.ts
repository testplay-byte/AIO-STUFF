// Single source of truth for the Tool Atlas live-preview dashboard.
// Per memory/06-live-preview-protocol.md: when a phase completes, update this object.

export type PhaseStatus = 'done' | 'in_progress' | 'pending' | 'blocked'

export interface Phase {
  id: string
  index: number
  title: string
  status: PhaseStatus
  summary: string
  detail: string
  owner: 'agent' | 'user' | 'shared'
}

export interface Stat {
  label: string
  value: string
  hint: string
  tone: 'done' | 'partial' | 'pending' | 'neutral'
}

export interface RoadmapPhase extends Phase {
  steps: string[]
}

export interface ActivityEvent {
  ts: string
  kind: 'add' | 'update' | 'fix' | 'note' | 'design' | 'memory'
  text: string
}

export interface DimensionStat {
  dimension: string
  full: string
  score: number // 0..100
}

export interface StructureNode {
  name: string
  type: 'folder' | 'file'
  note?: string
  children?: StructureNode[]
  status?: 'live' | 'planned'
}

export const projectState = {
  title: 'AIO-STUFF',
  subtitle: 'tools · skills · resources for AI',
  phaseTag: 'Phase 2 · Repository scaffolding',
  repoUrl: 'https://github.com/testplay-byte/AIO-STUFF',
  tagline:
    'A curated, navigable directory of tools, skills, and resources for AI. The repository (.md files) is for the AI to navigate; this dashboard is for you to see progress, structure, and state at a glance.',

  headline: {
    ok: false,
    title: 'Repo connected · awaiting your call on the token',
    body:
      'AIO-STUFF is linked and the foundation is pushed (README, root navigation.md, memory, .gitignore, LICENSE, workflows). The repo is currently PUBLIC, so I have NOT pushed the token zip yet — see the red-emoji flag in chat. Tell me how to proceed and I wire up Phase 4 automation.',
  },

  stats: [
    {
      label: 'Memory files',
      value: '9',
      hint: 'workflow .md written to disk',
      tone: 'done' as const,
      icon: 'file' as const,
      progress: 100,
      progressLabel: '9 of 9 written',
    },
    {
      label: 'Phases',
      value: '2/6',
      hint: 'in progress, 4 pending',
      tone: 'partial' as const,
      icon: 'milestone' as const,
      progress: 33,
      progressLabel: '2 of 6 started',
    },
    {
      label: 'Domains',
      value: '5',
      hint: 'ai · dev · design · security · productivity',
      tone: 'partial' as const,
      icon: 'layers' as const,
      progress: 60,
      progressLabel: '4 of 5 have tools',
    },
    {
      label: 'Tools indexed',
      value: '11',
      hint: 'reactbits · medusa · reconforge · noctisnova · knip · ponytail · brag · jitter · free-for-dev · ideavo · lovart',
      tone: 'done' as const,
      icon: 'wrench' as const,
      progress: 100,
      progressLabel: '11 tools across 4 domains',
    },
  ],

  understanding: {
    whatItIs:
      'AIO-STUFF is a public GitHub repository that organizes tools, skills, and resources for AI into a deep, browsable folder tree. It is a directory, not a tutorial — the value is navigation and curation. The repository (.md files) is for the AI to navigate; the published site + this dashboard are for human users.',
    corePrinciple:
      'Every folder carries its own navigation.md, scoped to only that branch. Each navigation.md is DETAILED — not a vague one-liner — so an AI can understand what is in the branch, what it is for, and decide confidently whether to go deeper or backtrack. A reader reaches any tool in ≤ 3 branch decisions.',
    twoDeliverables: [
      {
        name: 'The repository (for the AI)',
        body:
          'A folder tree of detailed navigation.md files + tool entries under domains/. An AI agent navigates the markdown to find the right tool/skill/resource for its project. That is why the files are markdown and why every navigation.md is substantive.',
      },
      {
        name: 'The live preview + published site (for users)',
        body:
          'This dashboard is the build command-center. The published site (in site/) is a beautiful, visual, easy-to-navigate webpage where human users see what the atlas offers and browse it comfortably.',
      },
    ],
    roles: [
      {
        who: 'You',
        role:
          'Provide the GitHub repo + full-control access token, and point me at resources to add (a tool, a skill, a website, a library). You make the high-level calls.',
      },
      {
        who: 'Me (agent)',
        role:
          'Do almost all of the work: deeply research and analyze each resource (scrape the web, read docs, verify facts), document it thoroughly, classify and place it, write every navigation.md, build + maintain the published site and the Actions → Pages pipeline, keep this dashboard in sync, and back up sandbox state to the repo regularly.',
      },
    ],
    navigationWalkthrough: [
      'Open root navigation.md → read substantive descriptions of each domain (not one-liners).',
      'Pick a domain, open its navigation.md → focused, detailed context for that domain only.',
      'Pick a subdomain, open its navigation.md → detailed descriptions of actual tools.',
      'Open a tool entry → the leaf with the researched, verified info.',
    ],
    explicitNonGoals: [
      'Not exhaustive step-by-step tutorials per tool — but short/vague tutorials are included when a tool genuinely needs one. Default: descriptive entry; add a brief how-to only when it adds real value.',
      'We ARE researching and scraping the web. When you hand me a resource, I analyze it, scrape its docs/site as needed, verify facts, and write the documentation. This is core work, not a non-goal.',
      'Not building auth, accounts, or a backend database. The atlas is static content; the dashboard is a read-only command-center; the published site is a static export.',
    ],
  },

  roadmap: [
    {
      id: 'p1',
      index: 1,
      title: 'Foundation',
      status: 'done',
      summary:
        'Understand the brief, analyze the reference UI, write memory/workflow files, scaffold this dashboard.',
      detail:
        'Encodes my understanding into durable memory files and surfaces it on the live preview for your review.',
      owner: 'agent',
      steps: [
        'Analyze reference site design language',
        'Write memory/*.md workflow files',
        'Build live-preview dashboard skeleton',
        'Self-verify with agent-browser',
      ],
    },
    {
      id: 'p2',
      index: 2,
      title: 'Repository scaffolding',
      status: 'in_progress',
      summary:
        'Create the repo shape: root navigation.md, README, LICENSE, .gitignore, domains/ skeleton with the 4 planned domains.',
      detail:
        'Establishes the folder contract from memory/02 before any tools are added.',
      owner: 'agent',
      steps: [
        'Root navigation.md + README',
        'domains/{ai-tools,dev,design,productivity}/navigation.md',
        'memory/ mirrored into the repo',
      ],
    },
    {
      id: 'p3',
      index: 3,
      title: 'Live preview build-out',
      status: 'in_progress',
      summary:
        'Make the dashboard read real files: memory via /api/memory, domains/ walk for the Structure tab, live counters.',
      detail:
        'Turns the dashboard from a static mock into a true mirror of disk state.',
      owner: 'agent',
      steps: [
        '/api/memory reads real memory folder',
        'Structure tab renders real domains/ tree',
        'Progress counters driven by state.ts',
      ],
    },
    {
      id: 'p4',
      index: 4,
      title: 'GitHub setup & automation',
      status: 'in_progress',
      summary:
        'Wire the repo: push to main, add .github/workflows/deploy.yml (build site/ → Pages) + validate.yml (lint nav tree).',
      detail:
        'Begins the moment you hand me the repo URL + PAT. Pages goes live at <user>.github.io/<repo>/.',
      owner: 'shared',
      steps: [
        'Receive repo URL + fine-grained PAT',
        'Push scaffold to main',
        'Add deploy.yml + validate.yml',
        'Confirm first green Pages deploy',
      ],
    },
    {
      id: 'p5',
      index: 5,
      title: 'Content ingestion',
      status: 'pending',
      summary:
        'Add tools one-by-one per memory/04. Each addition: classify, gather facts, write leaf, update parent navigation.md, bump dashboard.',
      detail:
        'The loop that runs every time you hand me something. Recurs as deep as needed.',
      owner: 'shared',
      steps: [
        'You send a tool/site/skill',
        'I classify + place it',
        'I write entry + update navigation.md',
        'Dashboard + Structure tab refresh',
      ],
    },
    {
      id: 'p6',
      index: 6,
      title: 'Polish & iterate',
      status: 'pending',
      summary:
        'Tighten copy, refine the published site UI, prune stale branches, keep the dashboard honest.',
      detail:
        'Continuous. The "would a human designer ship this?" test from memory/03 governs exit criteria.',
      owner: 'agent',
      steps: [
        'Audit every navigation.md for drift',
        'Polish published site visuals',
        'Final responsive + a11y pass',
      ],
    },
  ] as RoadmapPhase[],

  // Dimensions rendered on the radar — current build-health snapshot.
  dimensions: [
    { dimension: 'Navigation', full: 'Navigation system design', score: 91 },
    { dimension: 'Design', full: 'UI design language', score: 82 },
    { dimension: 'Content', full: 'Content indexed', score: 35 },
    { dimension: 'Automation', full: 'CI / Pages automation', score: 55 },
    { dimension: 'Memory', full: 'Workflow memory', score: 96 },
    { dimension: 'UX', full: 'Dashboard UX', score: 78 },
  ] as DimensionStat[],

  // Actual distribution (updates as tools are added).
  distribution: [
    { name: 'AI Tools', value: 36, tone: 'chart-1' },
    { name: 'Dev Tools', value: 18, tone: 'chart-2' },
    { name: 'Design', value: 27, tone: 'chart-4' },
    { name: 'Security', value: 18, tone: 'chart-3' },
    { name: 'Productivity', value: 0, tone: 'chart-5' },
  ],

  structure: {
    name: 'AIO-STUFF/',
    type: 'folder',
    children: [
      { name: 'README.md', type: 'file', note: 'project intro → points to navigation.md', status: 'live' },
      { name: 'navigation.md', type: 'file', note: 'ROOT signpost — substantive map of all domains', status: 'live' },
      { name: 'LICENSE', type: 'file', note: 'MIT', status: 'live' },
      { name: '.gitignore', type: 'file', note: 'node, next, env, .gh-token', status: 'live' },
      {
        name: 'memory/',
        type: 'folder',
        note: 'agent workflow memory (mirrored, not published)',
        status: 'live',
        children: [
          { name: '00-project-overview.md', type: 'file', note: 'what & why', status: 'live' },
          { name: '01-navigation-system.md', type: 'file', note: 'the core feature', status: 'live' },
          { name: '02-repository-structure.md', type: 'file', note: 'folder contract', status: 'live' },
          { name: '03-ui-design-language.md', type: 'file', note: 'design system', status: 'live' },
          { name: '04-adding-content-workflow.md', type: 'file', note: 'how to add a tool', status: 'live' },
          { name: '05-github-workflow.md', type: 'file', note: 'repo + Pages setup', status: 'live' },
          { name: '06-live-preview-protocol.md', type: 'file', note: 'dashboard sync rules', status: 'live' },
          { name: '07-agent-operating-rules.md', type: 'file', note: 'my non-negotiables', status: 'live' },
          { name: '08-communication-protocol.md', type: 'file', note: 'red-emoji must-read + mistake logging', status: 'live' },
        ],
      },
      {
        name: 'domains/',
        type: 'folder',
        note: 'ALL curated content lives here',
        status: 'planned',
        children: [
          {
            name: 'ai-tools/',
            type: 'folder',
            status: 'live',
            children: [
              { name: 'navigation.md', type: 'file', note: 'AI domain only', status: 'live' },
              {
                name: 'studios/',
                type: 'folder',
                status: 'live',
                children: [
                  { name: 'navigation.md', type: 'file', status: 'live' },
                  { name: 'noctisnova.md', type: 'file', note: 'AI tech studio (custom AI systems)', status: 'live' },
                ],
              },
              {
                name: 'agent-skills/',
                type: 'folder',
                status: 'live',
                children: [
                  { name: 'navigation.md', type: 'file', status: 'live' },
                  { name: 'ponytail.md', type: 'file', note: 'Lazy-senior-dev agent skill (81k stars)', status: 'live' },
                  { name: 'brag.md', type: 'file', note: 'Project → launch video skill (833 stars)', status: 'live' },
                ],
              },
              {
                name: 'app-builders/',
                type: 'folder',
                status: 'live',
                children: [
                  { name: 'navigation.md', type: 'file', status: 'live' },
                  { name: 'ideavo.md', type: 'file', note: 'AI app builder (BYOK, Next.js/Expo)', status: 'live' },
                ],
              },
              { name: 'llm/', type: 'folder', status: 'planned' },
              { name: 'image-generation/', type: 'folder', status: 'planned' },
              { name: 'speech/', type: 'folder', status: 'planned' },
            ],
          },
          {
            name: 'dev-tools/',
            type: 'folder',
            status: 'live',
            children: [
              { name: 'navigation.md', type: 'file', status: 'live' },
              {
                name: 'build/',
                type: 'folder',
                status: 'live',
                children: [
                  { name: 'navigation.md', type: 'file', status: 'live' },
                  { name: 'knip.md', type: 'file', note: 'Unused deps/exports/files linter (11.7k stars)', status: 'live' },
                ],
              },
              {
                name: 'resources/',
                type: 'folder',
                status: 'live',
                children: [
                  { name: 'navigation.md', type: 'file', status: 'live' },
                  { name: 'free-for-dev.md', type: 'file', note: 'Free-tier SaaS/PaaS/IaaS list (129k stars)', status: 'live' },
                ],
              },
            ],
          },
          {
            name: 'design/',
            type: 'folder',
            status: 'live',
            children: [
              { name: 'navigation.md', type: 'file', status: 'live' },
              {
                name: 'component-libraries/',
                type: 'folder',
                status: 'live',
                children: [
                  { name: 'navigation.md', type: 'file', status: 'live' },
                  { name: 'reactbits.md', type: 'file', note: 'React Bits — 130+ animated components', status: 'live' },
                ],
              },
              {
                name: 'prototyping/',
                type: 'folder',
                status: 'live',
                children: [
                  { name: 'navigation.md', type: 'file', status: 'live' },
                  { name: 'jitter.md', type: 'file', note: 'Motion design tool (20k+ teams)', status: 'live' },
                ],
              },
              {
                name: 'ai-design/',
                type: 'folder',
                status: 'live',
                children: [
                  { name: 'navigation.md', type: 'file', status: 'live' },
                  { name: 'lovart.md', type: 'file', note: 'AI design agent (100k+ creators)', status: 'live' },
                ],
              },
            ],
          },
          {
            name: 'productivity/',
            type: 'folder',
            status: 'planned',
            children: [{ name: 'navigation.md', type: 'file', status: 'planned' }],
          },
          {
            name: 'security/',
            type: 'folder',
            status: 'live',
            children: [
              { name: 'navigation.md', type: 'file', status: 'live' },
              {
                name: 'scanners/',
                type: 'folder',
                status: 'live',
                children: [
                  { name: 'navigation.md', type: 'file', status: 'live' },
                  { name: 'medusa.md', type: 'file', note: 'AI-first security scanner (40k+ patterns)', status: 'live' },
                ],
              },
              {
                name: 'recon/',
                type: 'folder',
                status: 'live',
                children: [
                  { name: 'navigation.md', type: 'file', status: 'live' },
                  { name: 'reconforge.md', type: 'file', note: 'AI-assisted recon toolkit (bug bounty)', status: 'live' },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'site/',
        type: 'folder',
        note: 'Next.js site that renders the atlas',
        status: 'planned',
        children: [
          { name: 'src/', type: 'folder', status: 'planned' },
          { name: 'next.config.ts', type: 'file', note: "output: 'export', basePath", status: 'planned' },
          { name: 'package.json', type: 'file', status: 'planned' },
        ],
      },
      {
        name: 'dashboard/',
        type: 'folder',
        note: 'backup of the build-dashboard workspace (sandbox recovery)',
        status: 'planned',
      },
      {
        name: 'sandbox-backup/',
        type: 'folder',
        note: 'manifest + snapshots of sandbox state',
        status: 'planned',
        children: [{ name: 'MANIFEST.md', type: 'file', status: 'planned' }],
      },
      {
        name: 'access/',
        type: 'folder',
        note: 'token zip (PENDING security decision — see 05)',
        status: 'planned',
      },
      {
        name: '.github/',
        type: 'folder',
        status: 'planned',
        children: [
          {
            name: 'workflows/',
            type: 'folder',
            children: [
              { name: 'deploy.yml', type: 'file', note: 'build site/ → GitHub Pages', status: 'planned' },
              { name: 'validate.yml', type: 'file', note: 'lint nav tree + build check', status: 'planned' },
            ],
          },
        ],
      },
    ],
  } as StructureNode,

  design: {
    tokens: [
      { role: 'Background', token: '--background', cls: 'bg-background', note: 'page chrome' },
      { role: 'Card surface', token: '--card', cls: 'bg-card', note: 'panels' },
      { role: 'Muted surface', token: '--muted', cls: 'bg-muted', note: 'tab lists, chips' },
      { role: 'Border', token: '--border', cls: 'border-border', note: 'all dividers' },
      { role: 'Primary', token: '--primary', cls: 'bg-primary', note: 'active tab, primary btn' },
      { role: 'Success', token: '--chart-2', cls: 'bg-[var(--chart-2)]', note: 'done / completed' },
      { role: 'Warning', token: '--chart-4', cls: 'bg-[var(--chart-4)]', note: 'in-progress / partial' },
      { role: 'Danger', token: '--destructive', cls: 'bg-destructive', note: 'errors / blocked' },
    ],
    principles: [
      'Calm, dense, legible, credible — reads like an engineering report, not a marketing page.',
      'Warm-tinted neutral palette for structure (off-black dark, coffee-cream light — never pure black/white).',
      'Chart tokens reserved for data only. No indigo/blue brand color unless explicitly requested.',
      'Bigger, bolder headings for clear hierarchy; pair with generous whitespace.',
      'Subtle motion only: tab fade/slide, list stagger. Respect prefers-reduced-motion.',
      'Sticky footer via min-h-screen flex flex-col + mt-auto. Responsive, a11y-first.',
      'The "would a human designer ship this?" test gates every UI handoff.',
    ],
    componentsUsed: [
      'Card', 'Tabs', 'Table', 'Badge', 'Alert', 'Progress',
      'Separator', 'ScrollArea', 'Tooltip', 'Button',
    ],
  },

  recentActivity: [
    { ts: 'just now', kind: 'design', text: 'Built /workflow page — center-spine timeline, 17 steps alternating L/R, detours branching off, scroll-animated' },
    { ts: 'just now', kind: 'update', text: 'Removed Workflow tab from dashboard; added Workflow link button in header' },
    { ts: 'just now', kind: 'memory', text: 'Updated workflow.ts with branchFrom + short snippets for each step' },
    { ts: 'prev', kind: 'memory', text: 'Created memory/10-content-ingestion-workflow.md — canonical timeline workflow' },
    { ts: 'prev', kind: 'fix', text: 'Reverted header swap + blueprint right-grouped + single home hover popover' },
    { ts: 'prev', kind: 'design', text: 'Home: categories overview + hover-with-names on graphs' },
    { ts: 'prev', kind: 'fix', text: 'Blueprint Mind Map + Radial: wheel=zoom, drag-pan, fullscreen' },
    { ts: 'prev', kind: 'fix', text: 'Blueprint Tree: last-child connector └' },
  ] as ActivityEvent[],
} as const

export type ProjectState = typeof projectState
