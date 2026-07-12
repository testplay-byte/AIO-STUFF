import Link from "next/link";
import {
  Sparkles,
  Code2,
  Palette,
  ListChecks,
  Layers,
  FolderTree,
  Package,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { getAllTools, getSiteMap } from "@/lib/content";
import { domainColor, domainSwatchStyle } from "@/lib/domain-style";

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

type DomainStat = {
  slug: string;
  title: string;
  toolCount: number;
  subdomainCount: number;
};

function ToolsPerDomainBar({
  domains,
  totalTools,
}: {
  domains: DomainStat[];
  totalTools: number;
}) {
  const maxCount = Math.max(1, ...domains.map((d) => d.toolCount));
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 sm:p-6">
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
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: domainColor(d.slug),
                  }}
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

/**
 * Pure-SVG donut chart showing the share of tool entries per domain.
 * Each segment is colored with that domain's accent. Empty domains still
 * appear in the legend (with a 0 count) so the structure stays readable
 * even when the atlas is sparse.
 */
function DistributionDonut({
  domains,
  totalTools,
}: {
  domains: DomainStat[];
  totalTools: number;
}) {
  const size = 180;
  const stroke = 28;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  // Build segments from non-zero domains. If everything is 0, render an
  // empty donut with a faint ring.
  const segments = domains
    .filter((d) => d.toolCount > 0)
    .map((d) => ({
      slug: d.slug,
      title: d.title,
      value: d.toolCount,
      color: domainColor(d.slug),
    }));

  let offset = 0;
  const arcs = segments.map((s) => {
    const fraction = totalTools > 0 ? s.value / totalTools : 0;
    const dash = fraction * circumference;
    const arc = {
      ...s,
      dash,
      gap: circumference - dash,
      offset: -offset,
    };
    offset += dash;
    return arc;
  });

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold tracking-tight">
          Distribution
        </h2>
        <span className="text-[11px] text-muted-foreground tabular-nums">
          share of {totalTools}
        </span>
      </div>
      <div className="flex flex-1 flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            role="img"
            aria-label="Tool entry distribution across domains"
          >
            {/* Faint background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              strokeWidth={stroke}
              className="stroke-muted"
            />
            {/* Segments */}
            {totalTools > 0 &&
              arcs.map((a, i) => (
                <circle
                  key={a.slug}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={a.color}
                  strokeWidth={stroke}
                  strokeDasharray={`${a.dash} ${a.gap}`}
                  strokeDashoffset={a.offset}
                  transform={`rotate(-90 ${size / 2} ${size / 2})`}
                  strokeLinecap="butt"
                >
                  <title>{`${a.title}: ${a.value}`}</title>
                </circle>
              ))}
          </svg>
          {/* Center label */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold tabular-nums">
              {totalTools}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              tools
            </span>
          </div>
        </div>
        {/* Legend */}
        <ul className="w-full flex-1 space-y-1.5">
          {domains.map((d) => (
            <li
              key={d.slug}
              className="flex items-center gap-2.5 text-xs sm:text-sm"
            >
              <span
                className="inline-block h-3 w-3 flex-shrink-0 rounded-full"
                style={domainSwatchStyle(d.slug)}
                aria-hidden="true"
              />
              <span className="flex-1 truncate font-medium">{d.title}</span>
              <span className="tabular-nums text-muted-foreground">
                {d.toolCount}
              </span>
            </li>
          ))}
        </ul>
      </div>
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

  const domainStats: DomainStat[] = domains.map((d) => ({
    slug: d.slug,
    title: d.title,
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
      <section className="mb-10 sm:mb-12" aria-labelledby="hero-heading">
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
          and written up so you can decide if it fits your workflow in
          under a minute.
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

        {/* Two distinct graphs side-by-side */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ToolsPerDomainBar
            domains={domainStats}
            totalTools={totalTools}
          />
          <DistributionDonut
            domains={domainStats}
            totalTools={totalTools}
          />
        </div>

        {/* Explore CTA */}
        <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link
            href="/explore"
            className="group inline-flex h-12 items-center gap-2.5 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground shadow-sm transition-all hover:shadow-md hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Explore the atlas
            <ArrowRight
              className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
          <p className="text-sm text-muted-foreground">
            Browse all {totalTools} {totalTools === 1 ? "entry" : "entries"}{" "}
            with filters and grid/list views.
          </p>
        </div>
      </section>
    </div>
  );
}
