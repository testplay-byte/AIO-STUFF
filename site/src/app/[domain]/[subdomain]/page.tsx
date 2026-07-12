import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDomain, getSiteMap, getSubdomain } from "@/lib/content";
import { Breadcrumb } from "@/components/breadcrumb";
import { Markdown } from "@/components/markdown";
import { ArrowRight, ExternalLink, Tag } from "lucide-react";

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { domain: string; subdomain: string }[] = [];
  for (const d of getSiteMap().domains) {
    for (const s of d.subdomains) {
      params.push({ domain: d.slug, subdomain: s.slug });
    }
  }
  return params;
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string; subdomain: string }>;
}): Promise<Metadata> {
  return (async () => {
    const { domain, subdomain } = await params;
    const s = getSubdomain(domain, subdomain);
    const d = getDomain(domain);
    if (!s) return { title: "Subdomain not found" };
    return {
      title: `${s.title}`,
      description:
        s.description ||
        `${d?.title ?? ""} · ${s.title} — tool entries and navigation.`,
    };
  })();
}

export default async function SubdomainPage({
  params,
}: {
  params: Promise<{ domain: string; subdomain: string }>;
}) {
  const { domain, subdomain } = await params;
  const d = getDomain(domain);
  const s = getSubdomain(domain, subdomain);
  if (!d || !s) notFound();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
      <Breadcrumb
        items={[{ label: d.title, href: `/${d.slug}` }, { label: s.title }]}
      />

      <header className="mb-8 flex flex-col gap-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {d.title} · Subdomain
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {s.title}
        </h1>
        {s.description && (
          <p className="max-w-3xl text-base sm:text-lg leading-relaxed text-muted-foreground">
            {s.description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center rounded-md border border-border bg-card px-2.5 py-1 font-medium">
            {s.tools.length} {s.tools.length === 1 ? "tool entry" : "tool entries"}
          </span>
        </div>
      </header>

      {/* Tool cards */}
      {s.tools.length > 0 && (
        <section className="mb-10" aria-labelledby="tools-heading">
          <h2
            id="tools-heading"
            className="mb-4 text-lg font-semibold tracking-tight"
          >
            Tool entries
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {s.tools.map((t) => (
              <Link
                key={t.slug}
                href={`/${d.slug}/${s.slug}/${t.slug}`}
                className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-foreground/30 hover:bg-accent/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-semibold">{t.name}</h3>
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
                {t.tags.length > 0 && (
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
                )}
                {t.url && (
                  <div className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    <span className="truncate">{t.url}</span>
                  </div>
                )}
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
          Subdomain navigation
        </h2>
        <div className="rounded-xl border border-border bg-card p-5 sm:p-7">
          {s.navigationMarkdown ? (
            <Markdown>{s.navigationMarkdown}</Markdown>
          ) : (
            <p className="text-sm text-muted-foreground">
              No navigation.md found for this subdomain.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
