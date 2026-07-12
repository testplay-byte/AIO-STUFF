import Link from "next/link";
import {
  Layers,
  FolderTree,
  Package,
  ArrowRight,
  History,
  type LucideIcon,
} from "lucide-react";
import { getAllTools, getSiteMap } from "@/lib/content";
import {
  HomeGraphs,
  type DomainTooltipData,
} from "@/components/home-graphs";
import { CategoriesOverview } from "@/components/categories-overview";

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

export default function HomePage() {
  const { domains } = getSiteMap();
  const allTools = getAllTools();

  const totalTools = allTools.length;
  const totalSubdomains = domains.reduce(
    (n, d) => n + d.subdomains.length,
    0,
  );
  const totalDomains = domains.length;

  // Stats + per-domain tooltip data (subdomain names + tool names). The
  // tooltip data is JSON-serializable and shipped to the client so the
  // hover popovers on the bar/donut/category cards can show names, not
  // just counts.
  const domainTooltipData: DomainTooltipData[] = domains.map((d) => ({
    slug: d.slug,
    title: d.title,
    description: d.description,
    toolCount: d.subdomains.reduce((n, s) => n + s.tools.length, 0),
    subdomainCount: d.subdomains.length,
    subdomains: d.subdomains.map((s) => ({
      slug: s.slug,
      title: s.title,
      toolCount: s.tools.length,
      tools: s.tools.map((t) => ({
        slug: t.slug,
        name: t.name,
        href: `/${d.slug}/${s.slug}/${t.slug}`,
        iconSvg: t.iconSvg,
      })),
    })),
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
            icon={History}
            label="Last updated"
            value={lastUpdated ?? "—"}
          />
        </div>

        {/* Two distinct graphs side-by-side — client component so the
            hover popovers (subdomain + tool names) work. */}
        <HomeGraphs
          domains={domainTooltipData}
          totalTools={totalTools}
        />

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

      {/* Categories overview — structured taxonomy of domains, subdomains,
          and tools. Always visible (not behind a click); hover lifts the
          card. Tool chips link straight to the tool write-up. */}
      <CategoriesOverview domains={domainTooltipData} />
    </div>
  );
}
