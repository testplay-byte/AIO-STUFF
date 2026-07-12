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
  ArrowRight,
  ExternalLink,
  Tag,
  FileText,
  FolderOpen,
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

  const totalTools = d.subdomains.reduce((n, s) => n + s.tools.length, 0);

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
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              {d.title}
            </h1>
          </div>
        </div>
        {d.description && (
          <p className="max-w-3xl text-base sm:text-lg leading-relaxed text-muted-foreground text-pretty">
            {d.description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center rounded-md border border-border bg-card px-2.5 py-1 font-medium">
            {d.subdomains.length}{" "}
            {d.subdomains.length === 1 ? "subdomain" : "subdomains"}
          </span>
          <span className="inline-flex items-center rounded-md border border-border bg-card px-2.5 py-1 font-medium">
            {totalTools} {totalTools === 1 ? "tool" : "tools"}
          </span>
        </div>
      </header>

      {/* Tools grouped under subdomain headings (subdomain heading is NOT
          a link — just a label). The domain page is a dedicated standalone
          page showing every tool in the domain. */}
      {totalTools > 0 ? (
        <section className="mb-10" aria-labelledby="tools-heading">
          <h2
            id="tools-heading"
            className="mb-5 text-lg sm:text-xl font-semibold tracking-tight"
          >
            Tool entries
          </h2>
          <div className="space-y-8">
            {d.subdomains.map((s) => (
              <div key={s.slug} className="space-y-3">
                {/* Subdomain heading — label only, NOT a link */}
                <div className="flex flex-wrap items-baseline gap-2.5 border-b border-border pb-2">
                  <span
                    className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-muted text-muted-foreground"
                    aria-hidden="true"
                  >
                    <FolderOpen className="h-3.5 w-3.5" />
                  </span>
                  <h3 className="text-base font-semibold tracking-tight">
                    {s.title}
                  </h3>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {s.tools.length}{" "}
                    {s.tools.length === 1 ? "tool" : "tools"}
                  </span>
                  {s.description && (
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      · {s.description}
                    </span>
                  )}
                </div>

                {/* Tools under this subdomain */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {s.tools.map((t) => (
                    <Link
                      key={t.slug}
                      href={`/${d.slug}/${s.slug}/${t.slug}`}
                      className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-foreground/30 hover:bg-accent/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 flex-col gap-1.5">
                          <div className="flex items-center gap-2 min-w-0">
                            {t.iconSvg && (
                              <div
                                className="size-5 shrink-0 overflow-hidden rounded text-foreground"
                                dangerouslySetInnerHTML={{ __html: t.iconSvg }}
                              />
                            )}
                            <h4 className="text-base font-semibold leading-tight truncate">
                              {t.name}
                            </h4>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span className="inline-flex items-center rounded-md border border-border bg-background px-2 py-0.5 font-medium capitalize">
                              {t.type}
                            </span>
                            {t.license && (
                              <span className="inline-flex items-center rounded-md border border-border bg-background px-2 py-0.5 font-medium">
                                {t.license}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight
                          className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                          aria-hidden="true"
                        />
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                        {t.oneLiner}
                      </p>
                      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
                        <Tag
                          className="h-3 w-3 text-muted-foreground/60"
                          aria-hidden="true"
                        />
                        {t.tags.slice(0, 5).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                        {t.tags.length > 5 && (
                          <span className="text-[11px] text-muted-foreground">
                            +{t.tags.length - 5}
                          </span>
                        )}
                      </div>
                      {t.url && (
                        <div className="flex items-center gap-1.5 pt-0.5 text-xs text-muted-foreground">
                          <ExternalLink className="h-3 w-3" aria-hidden="true" />
                          <span className="truncate">{t.url}</span>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="mb-10">
          <div className="flex items-start gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-5 text-sm text-muted-foreground">
            <FileText
              className="mt-0.5 h-4 w-4 flex-shrink-0"
              aria-hidden="true"
            />
            <p>
              No tool entries have been added to this domain yet. When
              entries are added under its subdomains, they will appear
              here as cards.
            </p>
          </div>
        </section>
      )}

      {/* Navigation.md content (AI guidance stripped) */}
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
    </div>
  );
}
