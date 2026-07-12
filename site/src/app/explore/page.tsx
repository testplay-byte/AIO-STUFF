import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { getAllTools, getSiteMap } from "@/lib/content";
import { Breadcrumb } from "@/components/breadcrumb";
import { ToolBrowser } from "@/components/tool-browser";

export const metadata: Metadata = {
  title: "Explore",
  description:
    "Browse every tool entry in the AIO-STUFF atlas — filter by domain, switch between grid and list views, click into a write-up.",
};

export default function ExplorePage() {
  const { domains } = getSiteMap();
  const allTools = getAllTools();

  const domainChips = domains.map((d) => ({
    slug: d.slug,
    title: d.title,
    description: d.description,
    toolCount: d.subdomains.reduce((n, s) => n + s.tools.length, 0),
    subdomainCount: d.subdomains.length,
  }));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Explore" }]} />

      <header className="mb-8 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-secondary-foreground"
            aria-hidden="true"
          >
            <Compass className="h-6 w-6" />
          </span>
          <div className="flex flex-col">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Browse the atlas
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Explore every tool entry
            </h1>
          </div>
        </div>
        <p className="max-w-3xl text-base sm:text-lg leading-relaxed text-muted-foreground text-pretty">
          Filter by domain to narrow the view, switch between grid and list
          layouts, and click into any entry for the full write-up. Each
          entry is researched and written up so you can decide if it fits
          your workflow in under a minute.
        </p>
      </header>

      <ToolBrowser domains={domainChips} tools={allTools} />

      <nav className="mt-10" aria-label="Back to home">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to home
        </Link>
      </nav>
    </div>
  );
}
