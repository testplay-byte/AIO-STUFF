import Link from "next/link";
import { getSiteMap, type Domain } from "@/lib/content";
import {
  Sparkles,
  Code2,
  Palette,
  ListChecks,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

// Static icon map for the four well-known top-level domains. New domains
// fall back to a generic icon.
const DOMAIN_ICONS: Record<string, LucideIcon> = {
  "ai-tools": Sparkles,
  "dev-tools": Code2,
  design: Palette,
  productivity: ListChecks,
};

function DomainCard({ domain }: { domain: Domain }) {
  const Icon = DOMAIN_ICONS[domain.slug] ?? Sparkles;
  const subdomainCount = domain.subdomains.length;
  const toolCount = domain.subdomains.reduce(
    (n, s) => n + s.tools.length,
    0,
  );

  return (
    <Link
      href={`/${domain.slug}`}
      className="group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-6 transition-all hover:border-foreground/30 hover:bg-accent/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-secondary-foreground"
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" />
        </div>
        <ArrowRight
          className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
          aria-hidden="true"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold tracking-tight">
          {domain.title}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-4">
          {domain.description || "Browse this domain's navigation."}
        </p>
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center rounded-md border border-border bg-background px-2 py-1 font-medium">
          {subdomainCount} {subdomainCount === 1 ? "subdomain" : "subdomains"}
        </span>
        <span className="inline-flex items-center rounded-md border border-border bg-background px-2 py-1 font-medium">
          {toolCount} {toolCount === 1 ? "tool" : "tools"}
        </span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const { domains } = getSiteMap();
  const totalTools = domains.reduce(
    (n, d) => n + d.subdomains.reduce((m, s) => m + s.tools.length, 0),
    0,
  );
  const totalSubdomains = domains.reduce((n, d) => n + d.subdomains.length, 0);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
      {/* Hero */}
      <section className="mb-10 sm:mb-14">
        <p className="mb-3 text-sm font-medium text-muted-foreground">
          A curated, navigable atlas
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance">
          Tools, skills, and resources for AI.
        </h1>
        <p className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground text-pretty">
          A growing directory of carefully documented tools — AI models,
          dev frameworks, design libraries, and productivity automation —
          organized into domains and subdomains with progressive-disclosure
          navigation. Every entry is researched and written up so you can
          decide if it fits your workflow in under a minute.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <span className="inline-flex items-center rounded-md border border-border bg-card px-3 py-1.5 font-medium">
            {domains.length} domains
          </span>
          <span className="inline-flex items-center rounded-md border border-border bg-card px-3 py-1.5 font-medium">
            {totalSubdomains} {totalSubdomains === 1 ? "subdomain" : "subdomains"}
          </span>
          <span className="inline-flex items-center rounded-md border border-border bg-card px-3 py-1.5 font-medium">
            {totalTools} {totalTools === 1 ? "tool entry" : "tool entries"}
          </span>
        </div>
      </section>

      {/* Domains */}
      <section aria-labelledby="domains-heading">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2
            id="domains-heading"
            className="text-xl sm:text-2xl font-semibold tracking-tight"
          >
            Browse by domain
          </h2>
        </div>
        {domains.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
            <p className="text-sm text-muted-foreground">
              No domains found. Add content under{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                domains/
              </code>{" "}
              and rebuild.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
            {domains.map((domain) => (
              <DomainCard key={domain.slug} domain={domain} />
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="mt-14 sm:mt-20" aria-labelledby="how-heading">
        <h2
          id="how-heading"
          className="mb-4 text-xl sm:text-2xl font-semibold tracking-tight"
        >
          How this atlas is organized
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-2 text-sm font-semibold text-muted-foreground">
              Step 1
            </div>
            <h3 className="text-base font-semibold mb-1.5">Pick a domain</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Domains are top-level categories — AI tooling, dev tools, design,
              productivity. Each has a substantive overview.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-2 text-sm font-semibold text-muted-foreground">
              Step 2
            </div>
            <h3 className="text-base font-semibold mb-1.5">Drill into a subdomain</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Subdomains narrow the domain — e.g.{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                design/component-libraries
              </code>
              . Each one has its own signpost.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-2 text-sm font-semibold text-muted-foreground">
              Step 3
            </div>
            <h3 className="text-base font-semibold mb-1.5">Read the tool entry</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Each tool gets a full write-up: what it is, best for, not for,
              quick facts, and a drop-in tutorial where useful.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
