import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getDomain,
  getSiteMap,
  getSubdomain,
  getTool,
} from "@/lib/content";
import { Breadcrumb } from "@/components/breadcrumb";
import { Markdown } from "@/components/markdown";
import {
  ExternalLink,
  Github,
  Tag,
  User,
  Calendar,
  Scale,
  Boxes,
  Globe,
  ArrowLeft,
  Bot,
} from "lucide-react";

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { domain: string; subdomain: string; tool: string }[] = [];
  for (const d of getSiteMap().domains) {
    for (const s of d.subdomains) {
      for (const t of s.tools) {
        params.push({ domain: d.slug, subdomain: s.slug, tool: t.slug });
      }
    }
  }
  return params;
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string; subdomain: string; tool: string }>;
}): Promise<Metadata> {
  return (async () => {
    const { domain, subdomain, tool } = await params;
    const t = getTool(domain, subdomain, tool);
    if (!t) return { title: "Tool not found" };
    return {
      title: t.name,
      description: t.oneLiner || `${t.name} — ${t.type}.`,
    };
  })();
}

function MetaRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-5 last:border-b-0">
      <dt className="flex w-full items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:w-40 sm:flex-shrink-0">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </dt>
      <dd className="text-sm font-medium text-foreground break-words min-w-0">
        {children}
      </dd>
    </div>
  );
}

// AI-compatibility rating: 1-5 dots with a short label.
// 5 = full AI autonomy, 1 = user-only.
const AI_COMPAT_LABELS: Record<number, string> = {
  1: "User-only",
  2: "Low",
  3: "Moderate",
  4: "High",
  5: "Full autonomy",
};

function AiCompatRating({ value }: { value: number }) {
  const label = AI_COMPAT_LABELS[value] ?? "Not rated";
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5" role="img" aria-label={`AI compatibility: ${value} out of 5 — ${label}`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={
              n <= value
                ? "inline-block size-3 rounded-full bg-foreground"
                : "inline-block size-3 rounded-full bg-muted"
            }
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {value}/5 · {label}
      </span>
    </div>
  );
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ domain: string; subdomain: string; tool: string }>;
}) {
  const { domain, subdomain, tool } = await params;
  const d = getDomain(domain);
  const s = getSubdomain(domain, subdomain);
  const t = getTool(domain, subdomain, tool);
  if (!d || !s || !t) notFound();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
      <Breadcrumb
        items={[
          { label: d.title, href: `/${d.slug}` },
          { label: t.name },
        ]}
      />

      <header className="mb-8 flex flex-col gap-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {d.title} · {s.title} · Tool entry
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance">
          {t.name}
        </h1>
        <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground text-pretty">
          {t.oneLiner}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {t.url && (
            <a
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Visit site
            </a>
          )}
          {t.repo && (
            <a
              href={t.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              Source
            </a>
          )}
        </div>
      </header>

      {/* Metadata table */}
      <section className="mb-10" aria-labelledby="metadata-heading">
        <h2
          id="metadata-heading"
          className="mb-3 text-lg font-semibold tracking-tight"
        >
          At a glance
        </h2>
        <dl className="overflow-hidden rounded-xl border border-border bg-card">
          <MetaRow icon={Boxes} label="Type">
            <span className="capitalize">{t.type}</span>
          </MetaRow>
          {t.license && (
            <MetaRow icon={Scale} label="License">
              {t.license}
            </MetaRow>
          )}
          {t.author && (
            <MetaRow icon={User} label="Author">
              {t.author}
            </MetaRow>
          )}
          {t.aiCompatibility > 0 && (
            <MetaRow icon={Bot} label="AI compatibility">
              <AiCompatRating value={t.aiCompatibility} />
            </MetaRow>
          )}
          {t.url && (
            <MetaRow icon={Globe} label="URL">
              <a
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground break-all"
              >
                {t.url}
                <ExternalLink className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
              </a>
            </MetaRow>
          )}
          {t.repo && (
            <MetaRow icon={Github} label="Repository">
              <a
                href={t.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground break-all"
              >
                {t.repo}
                <ExternalLink className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
              </a>
            </MetaRow>
          )}
          {t.tags.length > 0 && (
            <MetaRow icon={Tag} label="Tags">
              <div className="flex flex-wrap gap-1.5">
                {t.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </MetaRow>
          )}
          {(t.added || t.updated) && (
            <MetaRow icon={Calendar} label="Dates">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                {t.added && (
                  <span>
                    <span className="text-muted-foreground">Added:</span>{" "}
                    <time dateTime={t.added}>{t.added}</time>
                  </span>
                )}
                {t.updated && (
                  <span>
                    <span className="text-muted-foreground">Updated:</span>{" "}
                    <time dateTime={t.updated}>{t.updated}</time>
                  </span>
                )}
              </div>
            </MetaRow>
          )}
        </dl>
      </section>

      {/* Markdown body */}
      <section aria-labelledby="body-heading">
        <h2 id="body-heading" className="sr-only">
          Full write-up
        </h2>
        <div className="rounded-xl border border-border bg-card p-5 sm:p-8">
          <Markdown>{t.bodyMarkdown}</Markdown>
        </div>
      </section>

      {/* Back link — the subdomain index page no longer exists, so back
          goes to the domain page (which lists this tool under its
          subdomain heading). */}
      <nav className="mt-8" aria-label="Back to domain">
        <Link
          href={`/${d.slug}`}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to {d.title}
        </Link>
      </nav>
    </div>
  );
}
