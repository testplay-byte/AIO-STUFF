import {
  Sparkles,
  Code2,
  Palette,
  ListChecks,
  Layers,
  FolderTree,
  Package,
  type LucideIcon,
} from "lucide-react";
import { getAllTools, getSiteMap } from "@/lib/content";
import { ToolBrowser } from "@/components/tool-browser";

const DOMAIN_ICONS: Record<string, LucideIcon> = {
  "ai-tools": Sparkles,
  "dev-tools": Code2,
  design: Palette,
  productivity: ListChecks,
};

function domainIcon(slug: string): LucideIcon {
  return DOMAIN_ICONS[slug] ?? Sparkles;
}

function StatTile({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <span
          className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground"
          aria-hidden="true"
        >
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight tabular-nums">
          {value}
        </span>
        {hint && (
          <span className="text-xs text-muted-foreground">{hint}</span>
        )}
      </div>
    </div>
  );
}

function ToolsPerDomainBar({
  domains,
  totalTools,
}: {
  domains: {
    slug: string;
    title: string;
    toolCount: number;
  }[];
  totalTools: number;
}) {
  const maxCount = Math.max(1, ...domains.map((d) => d.toolCount));
  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold tracking-tight">
          Tools per domain
        </h2>
        <span className="text-[11px] text-muted-foreground tabular-nums">
          {totalTools} total
        </span>
      </div>
      <ul className="space-y-2.5">
        {domains.map((d) => {
          const pct = (d.toolCount / maxCount) * 100;
          const Icon = domainIcon(d.slug);
          return (
            <li
              key={d.slug}
              className="flex items-center gap-3"
            >
              <span
                className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"
                aria-hidden="true"
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span className="w-24 sm:w-28 flex-shrink-0 text-xs sm:text-sm font-medium truncate">
                {d.title}
              </span>
              <div
                className="h-2 flex-1 overflow-hidden rounded-full bg-muted"
                role="presentation"
              >
                <div
                  className="h-full rounded-full bg-foreground/70 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-6 flex-shrink-0 text-right text-xs sm:text-sm tabular-nums text-muted-foreground">
                {d.toolCount}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function HomePage() {
  const { domains } = getSiteMap();
  const allTools = getAllTools();

  const totalTools = allTools.length;
  const totalSubdomains = domains.reduce(
    (n, d) => n + d.subdomains.length,
    0,
  );
  const totalDomains = domains.length;

  const domainChips = domains.map((d) => ({
    slug: d.slug,
    title: d.title,
    description: d.description,
    toolCount: d.subdomains.reduce((n, s) => n + s.tools.length, 0),
    subdomainCount: d.subdomains.length,
  }));

  // Most recently updated tool across the whole tree — used as a small hint
  // in the stats hero ("Last updated"). Falls back to "—" if none have dates.
  const lastUpdated = allTools
    .map((t) => t.updated || t.added)
    .filter(Boolean)
    .sort()
    .reverse()[0];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
      {/* Stats hero */}
      <section className="mb-12 sm:mb-16" aria-labelledby="hero-heading">
        <p className="mb-3 text-sm font-medium text-muted-foreground">
          A curated, navigable atlas
        </p>
        <h1
          id="hero-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance"
        >
          Tools, skills, and resources for AI.
        </h1>
        <p className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground text-pretty">
          A growing directory of carefully documented tools — AI models,
          dev frameworks, design libraries, and productivity automation —
          organized into domains and subdomains. Every entry is researched
          and written up so you can decide if it fits your workflow in under
          a minute.
        </p>

        {/* Stats grid */}
        <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatTile icon={Layers} label="Domains" value={totalDomains} />
          <StatTile
            icon={FolderTree}
            label="Subdomains"
            value={totalSubdomains}
          />
          <StatTile
            icon={Package}
            label="Tool entries"
            value={totalTools}
            hint="and growing"
          />
          <StatTile
            icon={Sparkles}
            label="Last updated"
            value={lastUpdated ?? "—"}
          />
        </div>

        {/* Tools-per-domain bar (simple, no chart lib) */}
        <div className="mt-4">
          <ToolsPerDomainBar
            domains={domainChips.map((d) => ({
              slug: d.slug,
              title: d.title,
              toolCount: d.toolCount,
            }))}
            totalTools={totalTools}
          />
        </div>
      </section>

      {/* Tool entries browser (main content) */}
      <ToolBrowser domains={domainChips} tools={allTools} />
    </div>
  );
}
