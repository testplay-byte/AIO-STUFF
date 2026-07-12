import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDomain, getSiteMap, stripAiGuidance } from "@/lib/content";
import { Breadcrumb } from "@/components/breadcrumb";
import { Markdown } from "@/components/markdown";
import {
  Sparkles,
  Code2,
  Palette,
  ListChecks,
  Folder,
  ArrowRight,
  FileText,
  type LucideIcon,
} from "lucide-react";

export const dynamicParams = false;

export function generateStaticParams() {
  return getSiteMap().domains.map((d) => ({ domain: d.slug }));
}

function domainIcon(slug: string): LucideIcon {
  switch (slug) {
    case "ai-tools":
      return Sparkles;
    case "dev-tools":
      return Code2;
    case "design":
      return Palette;
    case "productivity":
      return ListChecks;
    default:
      return Sparkles;
  }
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>;
}): Promise<Metadata> {
  return (async () => {
    const { domain } = await params;
    const d = getDomain(domain);
    if (!d) return { title: "Domain not found" };
    return {
      title: d.title,
      description: d.description || `Browse the ${d.title} domain.`,
    };
  })();
}

export default async function DomainPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const d = getDomain(domain);
  if (!d) notFound();

  const Icon = domainIcon(d.slug);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
      <Breadcrumb items={[{ label: d.title }]} />

      <header className="mb-8 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-secondary-foreground"
            aria-hidden="true"
          >
            <Icon className="h-6 w-6" />
          </span>
          <div className="flex flex-col">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Domain
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {d.title}
            </h1>
          </div>
        </div>
        {d.description && (
          <p className="max-w-3xl text-base sm:text-lg leading-relaxed text-muted-foreground">
            {d.description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center rounded-md border border-border bg-card px-2.5 py-1 font-medium">
            {d.subdomains.length}{" "}
            {d.subdomains.length === 1 ? "subdomain" : "subdomains"}
          </span>
          <span className="inline-flex items-center rounded-md border border-border bg-card px-2.5 py-1 font-medium">
            {d.subdomains.reduce((n, s) => n + s.tools.length, 0)} tools
          </span>
        </div>
      </header>

      {/* Subdomain cards */}
      {d.subdomains.length > 0 && (
        <section className="mb-10" aria-labelledby="subdomains-heading">
          <h2
            id="subdomains-heading"
            className="mb-4 text-lg font-semibold tracking-tight"
          >
            Subdomains
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {d.subdomains.map((s) => (
              <Link
                key={s.slug}
                href={`/${d.slug}/${s.slug}`}
                className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-foreground/30 hover:bg-accent/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground"
                      aria-hidden="true"
                    >
                      <Folder className="h-4 w-4" />
                    </span>
                    <h3 className="text-base font-semibold">{s.title}</h3>
                  </div>
                  <ArrowRight
                    className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                  {s.description || `Browse the ${s.title} subdomain.`}
                </p>
                <div className="mt-auto flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center rounded-md border border-border bg-background px-2 py-0.5 font-medium">
                    {s.tools.length} {s.tools.length === 1 ? "tool" : "tools"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Navigation.md content */}
      <section aria-labelledby="navigation-heading">
        <h2
          id="navigation-heading"
          className="mb-4 text-lg font-semibold tracking-tight"
        >
          Domain navigation
        </h2>
        <div className="rounded-xl border border-border bg-card p-5 sm:p-7">
          {d.navigationMarkdown ? (
            <Markdown>{stripAiGuidance(d.navigationMarkdown)}</Markdown>
          ) : (
            <p className="text-sm text-muted-foreground">
              No navigation.md found for this domain.
            </p>
          )}
        </div>
      </section>

      {/* Empty-state hint if no subdomains yet */}
      {d.subdomains.length === 0 && (
        <section className="mt-8">
          <div className="flex items-start gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-5 text-sm text-muted-foreground">
            <FileText
              className="mt-0.5 h-4 w-4 flex-shrink-0"
              aria-hidden="true"
            />
            <p>
              No subdomains have been populated yet. When tool entries are
              added under this domain, their subdomains will appear here as
              cards.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
