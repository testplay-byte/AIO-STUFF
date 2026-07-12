'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Lightbulb,
  Milestone,
  FolderTree,
  Gauge,
  BookOpen,
  Palette,
  CheckCircle2,
  Loader,
  Circle,
  AlertTriangle,
  ArrowRight,
  Layers,
  GitBranch,
  Sparkles,
  Compass,
  Ban,
  ShieldCheck,
  Activity,
  FileText,
  Wrench,
  Github,
  Workflow as WorkflowIcon,
} from 'lucide-react'
import { projectState } from '@/lib/atlas/state'
import { ModeToggle } from '@/components/mode-toggle'
import { CoverageRadar, DistributionDonut } from '@/components/atlas/charts'
import { StructureTree } from '@/components/atlas/structure-tree'
import { MemoryTab } from '@/components/atlas/memory-tab'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { PhaseStatus } from '@/lib/atlas/state'

const TONE_DOT: Record<string, string> = {
  done: 'bg-[var(--chart-2)]',
  partial: 'bg-[var(--chart-4)]',
  pending: 'bg-muted-foreground/40',
  neutral: 'bg-muted-foreground/40',
}

const TONE_ACCENT: Record<string, string> = {
  done: 'var(--chart-2)',
  partial: 'var(--chart-4)',
  pending: 'var(--muted-foreground)',
  neutral: 'var(--muted-foreground)',
}

const STAT_ICONS: Record<string, React.ElementType> = {
  file: FileText,
  milestone: Milestone,
  layers: Layers,
  wrench: Wrench,
}

function StatusBadge({ status }: { status: PhaseStatus }) {
  const map = {
    done: { icon: CheckCircle2, label: 'Done', cls: 'text-[var(--chart-2)] border-[var(--chart-2)]/30 bg-[var(--chart-2)]/10' },
    in_progress: { icon: Loader, label: 'In progress', cls: 'text-[var(--chart-4)] border-[var(--chart-4)]/30 bg-[var(--chart-4)]/10' },
    pending: { icon: Circle, label: 'Pending', cls: 'text-muted-foreground border-border bg-muted/50' },
    blocked: { icon: AlertTriangle, label: 'Blocked', cls: 'text-destructive border-destructive/30 bg-destructive/10' },
  }[status]
  const Icon = map.icon
  return (
    <Badge variant="outline" className={cn('gap-1 rounded-full', map.cls)}>
      <Icon className={cn('size-3', status === 'in_progress' && 'animate-spin')} />
      {map.label}
    </Badge>
  )
}

function SectionHeader({
  icon: Icon,
  title,
  desc,
  right,
}: {
  icon: React.ElementType
  title: string
  desc?: string
  right?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center rounded-md border bg-muted/50">
          <Icon className="size-4 text-foreground/80" />
        </div>
        <div>
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
        </div>
      </div>
      {right}
    </div>
  )
}

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
}

export default function Home() {
  const s = projectState
  const donePhases = s.roadmap.filter((p) => p.status === 'done').length
  const activePhases = s.roadmap.filter((p) => p.status === 'in_progress').length

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header banner */}
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg border bg-foreground text-background">
              <Compass className="size-5" />
            </div>
            <div className="leading-tight">
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                {s.title}
              </h1>
              <p className="text-[11px] text-muted-foreground">
                <span className="font-medium text-foreground/70">{s.subtitle}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/workflow"
              aria-label="View the content ingestion workflow"
              className="inline-flex h-8 items-center gap-1.5 rounded-md border bg-card px-2.5 text-xs font-medium transition-colors hover:bg-accent"
            >
              <WorkflowIcon className="size-3.5" />
              <span className="hidden sm:inline">Workflow</span>
            </Link>
            <a
              href={s.repoUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="AIO-STUFF repository on GitHub"
              className="inline-flex h-8 items-center gap-1.5 rounded-md border bg-card px-2.5 text-xs font-medium transition-colors hover:bg-accent"
            >
              <Github className="size-3.5" />
              <span className="hidden sm:inline">Repo</span>
            </a>
            <Badge
              variant="outline"
              className="gap-1.5 rounded-full border-[var(--chart-4)]/30 bg-[var(--chart-4)]/10 text-[var(--chart-4)]"
            >
              <span className="size-1.5 rounded-full bg-[var(--chart-4)]" />
              {activePhases} active · {donePhases} done
            </Badge>
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {/* Executive summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Sparkles className="size-4 text-foreground/70" />
              Executive summary
            </CardTitle>
            <CardDescription className="text-foreground/70">
              {s.tagline}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {s.stats.map((stat) => {
                const Icon = STAT_ICONS[stat.icon] ?? FileText
                const accent = TONE_ACCENT[stat.tone]
                return (
                  <div
                    key={stat.label}
                    className="relative overflow-hidden rounded-lg border bg-card p-3.5"
                  >
                    <div
                      className="absolute inset-x-0 top-0 h-0.5"
                      style={{ background: accent, opacity: stat.progress > 0 ? 1 : 0.25 }}
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                        {stat.label}
                      </span>
                      <Icon
                        className="size-3.5"
                        style={{ color: accent }}
                      />
                    </div>
                    <div className="mt-2 text-3xl font-bold tracking-tight tabular-nums">
                      {stat.value}
                    </div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">
                      {stat.hint}
                    </div>
                    <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${stat.progress}%`,
                          background: accent,
                          opacity: stat.progress > 0 ? 1 : 0.3,
                        }}
                      />
                    </div>
                    <div className="mt-1 font-mono text-[10px] tracking-tight text-muted-foreground/80">
                      {stat.progressLabel}
                    </div>
                  </div>
                )
              })}
            </div>
            <div
              className="flex items-start gap-3 rounded-lg border border-l-4 bg-card px-4 py-3"
              style={{ borderLeftColor: 'var(--chart-4)' }}
            >
              <Activity
                className="mt-0.5 size-4 shrink-0"
                style={{ color: 'var(--chart-4)' }}
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {s.headline.title}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {s.headline.body}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="understanding" className="gap-4">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="understanding" className="gap-1.5 text-xs">
              <Lightbulb className="size-3.5" />
              Understanding
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="gap-1.5 text-xs">
              <Milestone className="size-3.5" />
              Roadmap
            </TabsTrigger>
            <TabsTrigger value="structure" className="gap-1.5 text-xs">
              <FolderTree className="size-3.5" />
              Structure
            </TabsTrigger>
            <TabsTrigger value="progress" className="gap-1.5 text-xs">
              <Gauge className="size-3.5" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="memory" className="gap-1.5 text-xs">
              <BookOpen className="size-3.5" />
              Memory
            </TabsTrigger>
            <TabsTrigger value="design" className="gap-1.5 text-xs">
              <Palette className="size-3.5" />
              Design
            </TabsTrigger>
          </TabsList>

          {/* UNDERSTANDING */}
          <TabsContent value="understanding" className="mt-4 space-y-6">
            <motion.div {...fade} transition={{ duration: 0.2 }} className="space-y-6">
              <Card>
                <CardHeader>
                  <SectionHeader
                    icon={Lightbulb}
                    title="What I understand we are building"
                    desc="Confirm or correct this on the next message — I will update memory immediately."
                  />
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {s.understanding.whatItIs}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-foreground/15">
                <CardHeader>
                  <SectionHeader
                    icon={Compass}
                    title="The core principle"
                    desc="Progressive disclosure by directory"
                  />
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-l-4 bg-foreground/[0.03] p-4" style={{ borderLeftColor: 'var(--foreground)' }}>
                    <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                      Key idea
                    </p>
                    <p className="mt-1.5 text-[15px] font-medium leading-relaxed text-foreground">
                      {s.understanding.corePrinciple}
                    </p>
                  </div>
                  <div className="mt-4 space-y-2">
                    {s.understanding.navigationWalkthrough.map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">
                          {i + 1}
                        </span>
                        <span className="pt-0.5 text-sm text-foreground/80">{step}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <SectionHeader icon={Layers} title="The two deliverables" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {s.understanding.twoDeliverables.map((d) => (
                      <div key={d.name} className="rounded-lg border p-3">
                        <p className="text-sm font-semibold">{d.name}</p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {d.body}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <SectionHeader icon={ShieldCheck} title="Who does what" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {s.understanding.roles.map((r) => (
                      <div key={r.who} className="rounded-lg border p-3">
                        <p className="text-sm font-semibold">{r.who}</p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {r.role}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <SectionHeader
                    icon={Ban}
                    title="Explicit non-goals"
                    desc="What this project is deliberately NOT"
                  />
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {s.understanding.explicitNonGoals.map((g, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-foreground/80"
                      >
                        <Ban className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/60" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* ROADMAP */}
          <TabsContent value="roadmap" className="mt-4 space-y-4">
            <motion.div {...fade} transition={{ duration: 0.2 }} className="space-y-4">
              {s.roadmap.map((phase) => (
                <Card key={phase.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted/50 font-mono text-sm font-semibold tabular-nums">
                          {phase.index}
                        </div>
                        <div>
                          <CardTitle className="text-base">{phase.title}</CardTitle>
                          <CardDescription className="mt-0.5 text-foreground/70">
                            {phase.summary}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <StatusBadge status={phase.status} />
                        <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                          {phase.owner}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3 text-xs text-muted-foreground">{phase.detail}</p>
                    <div className="grid gap-1.5 sm:grid-cols-2">
                      {phase.steps.map((step, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 rounded-md border bg-muted/20 px-2.5 py-1.5 text-xs"
                        >
                          {phase.status === 'done' ? (
                            <CheckCircle2 className="size-3.5 shrink-0 text-[var(--chart-2)]" />
                          ) : phase.status === 'in_progress' ? (
                            <Loader className="size-3.5 shrink-0 animate-spin text-[var(--chart-4)]" />
                          ) : (
                            <Circle className="size-3.5 shrink-0 text-muted-foreground/40" />
                          )}
                          <span
                            className={cn(
                              phase.status === 'pending'
                                ? 'text-muted-foreground'
                                : 'text-foreground/80'
                            )}
                          >
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </TabsContent>

          {/* STRUCTURE */}
          <TabsContent value="structure" className="mt-4 space-y-4">
            <motion.div {...fade} transition={{ duration: 0.2 }} className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
                <Card>
                  <CardHeader>
                    <SectionHeader
                      icon={FolderTree}
                      title="Repository tree"
                      desc="Target shape — 'live' items already exist on disk"
                    />
                  </CardHeader>
                  <CardContent>
                    <StructureTree root={s.structure} />
                    <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <span className="rounded-sm bg-[var(--chart-2)]/15 px-1 py-px text-[10px] font-medium text-[var(--chart-2)]">
                          live
                        </span>
                        exists now
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="rounded-sm bg-muted px-1 py-px text-[10px] font-medium text-muted-foreground">
                          planned
                        </span>
                        scaffolds next
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <SectionHeader
                      icon={Compass}
                      title="How navigation.md recurses"
                      desc="The reader's zoom-in journey"
                    />
                  </CardHeader>
                  <CardContent className="space-y-2.5">
                    {s.understanding.navigationWalkthrough.map((step, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 rounded-lg border bg-muted/20 p-2.5"
                      >
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">
                          {i + 1}
                        </span>
                        <span className="pt-0.5 text-xs leading-relaxed text-foreground/80">
                          {step}
                        </span>
                      </div>
                    ))}
                    <Separator className="my-3" />
                    <div className="rounded-lg border border-foreground/15 bg-foreground/[0.03] p-3">
                      <p className="text-xs font-semibold">The rule</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        Every folder carries its own <code className="font-mono">navigation.md</code>,
                        scoped to only that branch. Each level adds resolution — never
                        repetition. A reader reaches any tool in ≤ 3 branch decisions.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* PROGRESS */}
          <TabsContent value="progress" className="mt-4 space-y-4">
            <motion.div {...fade} transition={{ duration: 0.2 }} className="space-y-4">
              <Card>
                <CardHeader>
                  <SectionHeader
                    icon={Gauge}
                    title="Build-health radar"
                    desc="Six dimensions of the build, scored 0–100"
                  />
                </CardHeader>
                <CardContent>
                  <CoverageRadar data={s.dimensions} />
                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
                    {s.dimensions.map((d) => (
                      <div key={d.dimension} className="flex items-center justify-between gap-2 text-xs">
                        <span className="text-muted-foreground">{d.dimension}</span>
                        <span className="font-mono font-medium tabular-nums">{d.score}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <SectionHeader
                      icon={Layers}
                      title="Planned content distribution"
                      desc="Target share per domain — updates as tools land"
                    />
                  </CardHeader>
                  <CardContent>
                    <DistributionDonut data={s.distribution} />
                    <div className="mt-3 space-y-1.5">
                      {s.distribution.map((d) => (
                        <div
                          key={d.name}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className="size-2.5 rounded-sm"
                              style={{ background: `var(--${d.tone})` }}
                            />
                            {d.name}
                          </span>
                          <span className="font-mono tabular-nums text-muted-foreground">
                            {d.value}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <SectionHeader
                      icon={Milestone}
                      title="Phase scorecard"
                      desc="Roadmap status at a glance"
                    />
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-8 text-xs">#</TableHead>
                          <TableHead className="text-xs">Phase</TableHead>
                          <TableHead className="text-xs">Owner</TableHead>
                          <TableHead className="text-right text-xs">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {s.roadmap.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell className="font-mono text-xs tabular-nums">
                              {p.index}
                            </TableCell>
                            <TableCell className="text-xs font-medium">
                              {p.title}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {p.owner}
                            </TableCell>
                            <TableCell className="text-right">
                              <StatusBadge status={p.status} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <SectionHeader
                    icon={Activity}
                    title="Recent activity"
                    desc="Rolling log — newest first"
                  />
                </CardHeader>
                <CardContent>
                  <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                    {s.recentActivity.map((ev, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-md border bg-muted/20 px-3 py-2"
                      >
                        <span className="mt-1 size-1.5 shrink-0 rounded-full bg-foreground/40" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-foreground/85">{ev.text}</p>
                          <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                            {ev.ts} · {ev.kind}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* MEMORY */}
          <TabsContent value="memory" className="mt-4">
            <motion.div {...fade} transition={{ duration: 0.2 }}>
              <div className="mb-4">
                <SectionHeader
                  icon={BookOpen}
                  title="Workflow memory"
                  desc="The real memory/*.md files — read live from disk, rendered as markdown"
                />
              </div>
              <MemoryTab />
            </motion.div>
          </TabsContent>

          {/* DESIGN */}
          <TabsContent value="design" className="mt-4 space-y-4">
            <motion.div {...fade} transition={{ duration: 0.2 }} className="space-y-4">
              <Card>
                <CardHeader>
                  <SectionHeader
                    icon={Palette}
                    title="Design language"
                    desc="Derived from analyzing the reference site — same register, adapted to this build"
                  />
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {s.design.principles.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                        <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <SectionHeader
                    icon={Sparkles}
                    title="Color tokens"
                    desc="shadcn neutral structure + chart tokens for data"
                  />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {s.design.tokens.map((t) => (
                      <div key={t.role} className="rounded-lg border p-2.5">
                        <div
                          className={cn(
                            'mb-2 h-10 w-full rounded-md border',
                            t.cls
                          )}
                        />
                        <p className="text-xs font-semibold">{t.role}</p>
                        <p className="font-mono text-[10px] text-muted-foreground">
                          {t.token}
                        </p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          {t.note}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <SectionHeader
                    icon={GitBranch}
                    title="Components in use"
                    desc="Existing shadcn/ui — never rebuilt from scratch"
                  />
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {s.design.componentsUsed.map((c) => (
                      <Badge
                        key={c}
                        variant="secondary"
                        className="rounded-md font-mono text-[11px]"
                      >
                        {c}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Sticky footer */}
      <footer className="mt-auto border-t bg-background">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-2">
            <Compass className="size-3.5" />
            <span>
              <span className="font-medium text-foreground/80">{s.title}</span> · {s.subtitle}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px]">{s.phaseTag}</span>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[var(--chart-4)]" />
              Awaiting your confirmation
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
