"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Code2,
  Palette,
  ListChecks,
  ChevronRight,
  Folder,
  FileText,
  Layers,
  type LucideIcon,
} from "lucide-react";

// ────────────────────────────────────────────────────────────────────────────
// Types — slim tree shape, JSON-serializable, passed from the server page.
// ────────────────────────────────────────────────────────────────────────────

export type BlueprintTool = {
  slug: string;
  name: string;
  type: string;
  tags: string[];
  href: string;
};

export type BlueprintSubdomain = {
  slug: string;
  title: string;
  tools: BlueprintTool[];
};

export type BlueprintDomain = {
  slug: string;
  title: string;
  description: string;
  subdomains: BlueprintSubdomain[];
};

export type BlueprintTree = {
  domains: BlueprintDomain[];
};

// ────────────────────────────────────────────────────────────────────────────
// Iconography
// ────────────────────────────────────────────────────────────────────────────

const DOMAIN_ICONS: Record<string, LucideIcon> = {
  "ai-tools": Sparkles,
  "dev-tools": Code2,
  design: Palette,
  productivity: ListChecks,
};

function domainIcon(slug: string): LucideIcon {
  return DOMAIN_ICONS[slug] ?? Layers;
}

// ────────────────────────────────────────────────────────────────────────────
// Tree
// ────────────────────────────────────────────────────────────────────────────

export function BlueprintTree({ tree }: { tree: BlueprintTree }) {
  // All domains expanded by default — the tree is small enough that this is
  // a better first impression than collapsed.
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>(
    {},
  );

  const toggle = React.useCallback((id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const totalSubdomains = tree.domains.reduce(
    (n, d) => n + d.subdomains.length,
    0,
  );
  const totalTools = tree.domains.reduce(
    (n, d) =>
      n + d.subdomains.reduce((m, s) => m + s.tools.length, 0),
    0,
  );

  return (
    <div className="space-y-5">
      {/* Root node — project name as the tree's anchor */}
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 sm:p-5">
        <span
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold"
          aria-hidden="true"
        >
          A
        </span>
        <div className="flex flex-col">
          <span className="text-base font-bold tracking-tight">AIO-STUFF</span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {tree.domains.length} domains · {totalSubdomains} subdomains ·{" "}
            {totalTools} tool {totalTools === 1 ? "entry" : "entries"}
          </span>
        </div>
      </div>

      {/* Domain branches */}
      <ul className="space-y-2 border-l border-border pl-4 sm:pl-5 ml-5 sm:ml-6">
        {tree.domains.map((domain) => (
          <DomainBranch
            key={domain.slug}
            domain={domain}
            collapsed={!!collapsed[domain.slug]}
            onToggle={() => toggle(domain.slug)}
            collapsedState={collapsed}
            onToggleSub={(id) => toggle(id)}
          />
        ))}
      </ul>
    </div>
  );
}

function DomainBranch({
  domain,
  collapsed,
  onToggle,
  collapsedState,
  onToggleSub,
}: {
  domain: BlueprintDomain;
  collapsed: boolean;
  onToggle: () => void;
  collapsedState: Record<string, boolean>;
  onToggleSub: (id: string) => void;
}) {
  const Icon = domainIcon(domain.slug);
  const toolCount = domain.subdomains.reduce(
    (n, s) => n + s.tools.length,
    0,
  );

  return (
    <li className="relative">
      {/* Horizontal connector from parent vertical line to this node */}
      <span
        className="absolute -left-4 sm:-left-5 top-7 h-px w-4 sm:w-5 bg-border"
        aria-hidden="true"
      />
      <div className="rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent/30">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={!collapsed}
          aria-label={`${collapsed ? "Expand" : "Collapse"} ${domain.title}`}
          className="flex w-full items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md"
        >
          <ChevronRight
            className={[
              "h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform",
              collapsed ? "" : "rotate-90",
            ].join(" ")}
            aria-hidden="true"
          />
          <span
            className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground"
            aria-hidden="true"
          >
            <Icon className="h-4 w-4" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-base font-semibold leading-tight truncate">
              {domain.title}
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {domain.subdomains.length}{" "}
              {domain.subdomains.length === 1 ? "subdomain" : "subdomains"} ·{" "}
              {toolCount} {toolCount === 1 ? "tool" : "tools"}
            </span>
          </div>
          <span className="ml-auto hidden sm:inline-flex items-center rounded-md border border-border bg-background px-2 py-0.5 text-[11px] font-mono text-muted-foreground">
            /{domain.slug}
          </span>
        </button>
        {domain.description && (
          <p className="mt-3 pl-7 text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {domain.description}
          </p>
        )}
      </div>

      {/* Subdomains under this domain */}
      {!collapsed && domain.subdomains.length > 0 && (
        <ul className="mt-2 space-y-2 border-l border-border pl-4 sm:pl-5 ml-5 sm:ml-6">
          {domain.subdomains.map((sub) => (
            <SubdomainBranch
              key={sub.slug}
              domainSlug={domain.slug}
              subdomain={sub}
              collapsed={!!collapsedState[`${domain.slug}/${sub.slug}`]}
              onToggle={() =>
                onToggleSub(`${domain.slug}/${sub.slug}`)
              }
            />
          ))}
        </ul>
      )}
      {!collapsed && domain.subdomains.length === 0 && (
        <p className="mt-2 ml-7 text-xs italic text-muted-foreground">
          No subdomains yet — subdomains are created here as tools are added.
        </p>
      )}
    </li>
  );
}

function SubdomainBranch({
  domainSlug,
  subdomain,
  collapsed,
  onToggle,
}: {
  domainSlug: string;
  subdomain: BlueprintSubdomain;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <li className="relative">
      <span
        className="absolute -left-4 sm:-left-5 top-6 h-px w-4 sm:w-5 bg-border"
        aria-hidden="true"
      />
      <div className="rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent/30">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={!collapsed}
          aria-label={`${collapsed ? "Expand" : "Collapse"} ${subdomain.title}`}
          className="flex w-full items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md"
        >
          <ChevronRight
            className={[
              "h-3.5 w-3.5 flex-shrink-0 text-muted-foreground transition-transform",
              collapsed ? "" : "rotate-90",
            ].join(" ")}
            aria-hidden="true"
          />
          <span
            className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"
            aria-hidden="true"
          >
            <Folder className="h-3.5 w-3.5" />
          </span>
          <span className="text-sm font-semibold leading-tight truncate">
            {subdomain.title}
          </span>
          <span className="ml-auto inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground tabular-nums">
            {subdomain.tools.length}{" "}
            {subdomain.tools.length === 1 ? "tool" : "tools"}
          </span>
        </button>
      </div>

      {/* Tools under this subdomain */}
      {!collapsed && subdomain.tools.length > 0 && (
        <ul className="mt-2 space-y-1.5 border-l border-border pl-4 sm:pl-5 ml-4 sm:ml-5">
          {subdomain.tools.map((tool) => (
            <li key={tool.slug} className="relative">
              <span
                className="absolute -left-4 sm:-left-5 top-4 h-px w-4 sm:w-5 bg-border"
                aria-hidden="true"
              />
              <Link
                href={tool.href}
                className="group flex items-center gap-2.5 rounded-md border border-border bg-card px-3 py-2 transition-colors hover:bg-accent/40 hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span
                  className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-background text-muted-foreground group-hover:text-foreground"
                  aria-hidden="true"
                >
                  <FileText className="h-3 w-3" />
                </span>
                <span className="text-sm font-medium leading-tight truncate">
                  {tool.name}
                </span>
                {tool.type && (
                  <span className="ml-1 inline-flex items-center rounded border border-border bg-background px-1.5 py-0 text-[10px] font-medium capitalize text-muted-foreground">
                    {tool.type}
                  </span>
                )}
                {tool.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="hidden sm:inline-flex items-center rounded bg-muted px-1.5 py-0 text-[10px] font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
                <span className="ml-auto hidden sm:inline-flex items-center rounded bg-background px-1.5 py-0 text-[10px] font-mono text-muted-foreground">
                  /{domainSlug}/{subdomain.slug}/{tool.slug}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
