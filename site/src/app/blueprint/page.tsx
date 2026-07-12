import type { Metadata } from "next";
import Link from "next/link";
import { getSiteMap } from "@/lib/content";
import { Breadcrumb } from "@/components/breadcrumb";
import { BlueprintTree, type BlueprintTree as BlueprintTreeType } from "@/components/blueprint-tree";
import { ArrowLeft, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Structure blueprint",
  description:
    "A visual map of the full AIO-STUFF domains/ tree — every domain, subdomain, and tool entry at a glance.",
  robots: {
    // Hidden easter-egg page — don't surface in search results.
    index: false,
    follow: false,
  },
};

export default function BlueprintPage() {
  const sitemap = getSiteMap();

  // Slim the tree down to just the structural shape — drop the markdown
  // bodies and per-tool metadata that the blueprint view doesn't render.
  // Keeps the JSON payload shipped to the client small.
  const tree: BlueprintTreeType = {
    domains: sitemap.domains.map((d) => ({
      slug: d.slug,
      title: d.title,
      description: d.description,
      subdomains: d.subdomains.map((s) => ({
        slug: s.slug,
        title: s.title,
        tools: s.tools.map((t) => ({
          slug: t.slug,
          name: t.name,
          type: t.type,
          tags: t.tags,
          href: `/${d.slug}/${s.slug}/${t.slug}`,
        })),
      })),
    })),
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Structure blueprint" }]} />

      <header className="mb-8 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Hidden page · easter egg
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance">
            Structure blueprint
          </h1>
          <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground text-pretty">
            The full{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
              domains/
            </code>{" "}
            tree, visualized. Expand or collapse any branch to audit the
            atlas's structure at a glance. Tool entries link straight to
            their write-up.
          </p>
        </div>
        <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
          <Info
            className="mt-0.5 h-4 w-4 flex-shrink-0"
            aria-hidden="true"
          />
          <p>
            This page is intentionally unlinked from the main navigation.
            It was discovered by clicking the AIO-STUFF name in the header
            five times rapidly — a small easter egg for anyone auditing the
            structure.
          </p>
        </div>
      </header>

      <section aria-label="Structure tree">
        <BlueprintTree tree={tree} />
      </section>

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
