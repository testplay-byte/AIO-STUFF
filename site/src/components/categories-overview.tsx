import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { DomainTooltipData } from "@/components/home-graphs";
import { domainColor } from "@/lib/domain-style";
import {
  getDomainIconSvg,
  getSubdomainIconSvg,
  hasSubdomainIcon,
} from "@/lib/icons";

/**
 * Categories overview — structured taxonomy view shown on the home page.
 *
 * Each domain renders as a card with its subdomains listed (always visible
 * — not hidden behind a click), and each subdomain's tool names appear as
 * chips inside that subdomain block. Hover on a card lifts it slightly and
 * recolors the border to the domain accent (CSS-only — no client state).
 *
 * This is intentionally NOT a full tool browser (that's /explore). It's a
 * glanceable overview of the taxonomy itself: domain → subdomains → tools.
 */
export function CategoriesOverview({
  domains,
}: {
  domains: DomainTooltipData[];
}) {
  if (domains.length === 0) return null;

  return (
    <section
      className="mt-14 sm:mt-16"
      aria-labelledby="categories-heading"
    >
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            The taxonomy
          </p>
          <h2
            id="categories-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-balance"
          >
            Domains &amp; subdomains at a glance
          </h2>
        </div>
        <p className="max-w-md text-sm text-muted-foreground text-pretty">
          Every domain below groups its subdomains — and every tool lives
          inside one subdomain. Hover a card to highlight it; click a tool
          chip to jump to its write-up.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {domains.map((d) => {
          const color = domainColor(d.slug);
          return (
            <article
              key={d.slug}
              className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              style={{ ["--domain-color" as string]: color }}
            >
              {/* Card header — domain icon, title, counts */}
              <header className="mb-4 flex items-start gap-3">
                <span
                  className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                >
                  <div
                    className="size-5 shrink-0"
                    style={{ color: "white" }}
                    dangerouslySetInnerHTML={{
                      __html: getDomainIconSvg(d.slug),
                    }}
                  />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight truncate">
                      <Link
                        href={`/${d.slug}`}
                        className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        {d.title}
                      </Link>
                    </h3>
                    <span
                      className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground"
                    >
                      /{d.slug}
                    </span>
                  </div>
                  {d.description && (
                    <p className="text-xs sm:text-sm text-muted-foreground leading-snug line-clamp-2">
                      {d.description}
                    </p>
                  )}
                  <p className="mt-0.5 text-[11px] tabular-nums text-muted-foreground">
                    {d.subdomainCount}{" "}
                    {d.subdomainCount === 1 ? "subdomain" : "subdomains"} ·{" "}
                    {d.toolCount} {d.toolCount === 1 ? "tool" : "tools"}
                  </p>
                </div>
              </header>

              {/* Body — subdomains with their tools */}
              {d.subdomains.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border bg-muted/30 px-3 py-4 text-center text-xs italic text-muted-foreground">
                  No subdomains yet — subdomains appear here as tools are
                  added.
                </p>
              ) : (
                <ul className="space-y-3">
                  {d.subdomains.map((s) => (
                    <li
                      key={s.slug}
                      className="rounded-lg border border-border/80 bg-background/50 p-3"
                    >
                      <div className="flex items-center gap-2">
                        {hasSubdomainIcon(s.slug) && (
                          <div
                            className="size-4 shrink-0 text-foreground"
                            aria-hidden="true"
                            dangerouslySetInnerHTML={{
                              __html: getSubdomainIconSvg(s.slug),
                            }}
                          />
                        )}
                        <span className="text-sm font-semibold leading-tight">
                          {s.title}
                        </span>
                        <span className="ml-auto inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-muted-foreground">
                          {s.toolCount}{" "}
                          {s.toolCount === 1 ? "tool" : "tools"}
                        </span>
                      </div>
                      {s.tools.length > 0 ? (
                        <ul className="mt-2.5 flex flex-wrap gap-1.5 pl-8">
                          {s.tools.map((t) => (
                            <li key={t.slug}>
                              <Link
                                href={t.href}
                                className="group/chip inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[11px] font-medium transition-colors hover:border-foreground/40 hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              >
                                {t.iconSvg && (
                                  <span
                                    className="size-4 shrink-0 overflow-hidden rounded text-foreground"
                                    dangerouslySetInnerHTML={{
                                      __html: t.iconSvg,
                                    }}
                                  />
                                )}
                                <span>{t.name}</span>
                                <ArrowUpRight
                                  className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover/chip:opacity-100"
                                  aria-hidden="true"
                                />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 pl-8 text-[11px] italic text-muted-foreground">
                          No tool entries yet.
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {/* Card footer — link to the domain page */}
              <footer className="mt-4 pt-3 border-t border-border/70">
                <Link
                  href={`/${d.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                >
                  Browse {d.title}
                  <ArrowUpRight
                    className="h-3 w-3"
                    aria-hidden="true"
                  />
                </Link>
              </footer>
            </article>
          );
        })}
      </div>
    </section>
  );
}
