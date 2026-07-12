"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  LayoutGrid,
  List as ListIcon,
  type LucideIcon,
} from "lucide-react";
import {
  Sparkles,
  Code2,
  Palette,
  ListChecks,
} from "lucide-react";

// ────────────────────────────────────────────────────────────────────────────
// Types — kept structurally compatible with FlatTool from lib/content.
// Duplicated here (rather than imported) so this file stays a leaf client
// module with no server-only imports leaking into the client bundle.
// ────────────────────────────────────────────────────────────────────────────

type FlatTool = {
  slug: string;
  name: string;
  type: string;
  tags: string[];
  license: string;
  url: string;
  repo: string;
  oneLiner: string;
  domainSlug: string;
  domainTitle: string;
  subdomainSlug: string;
  subdomainTitle: string;
  href: string;
  iconSvg?: string;
};

type DomainChip = {
  slug: string;
  title: string;
  description: string;
  toolCount: number;
  subdomainCount: number;
};

const DOMAIN_ICONS: Record<string, LucideIcon> = {
  "ai-tools": Sparkles,
  "dev-tools": Code2,
  design: Palette,
  productivity: ListChecks,
};

function domainIcon(slug: string): LucideIcon {
  return DOMAIN_ICONS[slug] ?? Sparkles;
}

// ────────────────────────────────────────────────────────────────────────────
// Tool entries browser
// ────────────────────────────────────────────────────────────────────────────

type ViewMode = "grid" | "list";

export function ToolBrowser({
  domains,
  tools,
}: {
  domains: DomainChip[];
  tools: FlatTool[];
}) {
  const [activeDomain, setActiveDomain] = React.useState<string | null>(null);
  const [view, setView] = React.useState<ViewMode>("grid");

  const filteredTools = React.useMemo(() => {
    if (!activeDomain) return tools;
    return tools.filter((t) => t.domainSlug === activeDomain);
  }, [activeDomain, tools]);

  return (
    <section aria-labelledby="browser-heading" className="space-y-6">
      {/* "What we provide" — domain chips */}
      <div className="space-y-3">
        <h2
          id="provide-heading"
          className="text-base font-semibold tracking-tight text-muted-foreground"
        >
          What we provide
        </h2>
        <div className="flex flex-wrap gap-2">
          <DomainChipButton
            active={activeDomain === null}
            onClick={() => setActiveDomain(null)}
            label="All"
            count={tools.length}
          />
          {domains.map((d) => {
            const Icon = domainIcon(d.slug);
            return (
              <DomainChipButton
                key={d.slug}
                active={activeDomain === d.slug}
                onClick={() => setActiveDomain(d.slug)}
                label={d.title}
                count={d.toolCount}
                icon={<Icon className="h-3.5 w-3.5" aria-hidden="true" />}
              />
            );
          })}
        </div>
      </div>

      {/* Tool entries browser header + view toggle */}
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
        <div className="flex flex-col gap-0.5">
          <h2
            id="browser-heading"
            className="text-xl sm:text-2xl font-semibold tracking-tight"
          >
            Tool entries
          </h2>
          <p className="text-xs text-muted-foreground tabular-nums">
            {filteredTools.length}{" "}
            {filteredTools.length === 1 ? "entry" : "entries"}
            {activeDomain
              ? ` in ${domains.find((d) => d.slug === activeDomain)?.title ?? activeDomain}`
              : " across all domains"}
          </p>
        </div>
        <ViewToggle view={view} onChange={setView} />
      </div>

      {/* Entries */}
      {filteredTools.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">
            No tool entries {activeDomain ? "in this domain" : "yet"}. Add
            content under{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              domains/
            </code>{" "}
            and rebuild.
          </p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((t) => (
            <ToolGridCard key={t.href} tool={t} />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <ul className="divide-y divide-border">
            {filteredTools.map((t) => (
              <li key={t.href}>
                <ToolListRow tool={t} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Pieces
// ────────────────────────────────────────────────────────────────────────────

function DomainChipButton({
  active,
  onClick,
  label,
  count,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? "border-foreground/40 bg-foreground text-background hover:bg-foreground/90"
          : "border-border bg-card text-foreground hover:bg-accent hover:border-foreground/30",
      ].join(" ")}
    >
      {icon}
      <span>{label}</span>
      <span
        className={[
          "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] tabular-nums",
          active ? "bg-background/20 text-background" : "bg-muted text-muted-foreground",
        ].join(" ")}
      >
        {count}
      </span>
    </button>
  );
}

function ViewToggle({
  view,
  onChange,
}: {
  view: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  return (
    <div
      className="inline-flex items-center rounded-md border border-border bg-card p-0.5"
      role="group"
      aria-label="View mode"
    >
      <ViewToggleButton
        active={view === "grid"}
        onClick={() => onChange("grid")}
        label="Grid view"
      >
        <LayoutGrid className="h-4 w-4" aria-hidden="true" />
      </ViewToggleButton>
      <ViewToggleButton
        active={view === "list"}
        onClick={() => onChange("list")}
        label="List view"
      >
        <ListIcon className="h-4 w-4" aria-hidden="true" />
      </ViewToggleButton>
    </div>
  );
}

function ViewToggleButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={[
        "inline-flex h-8 w-9 items-center justify-center rounded-[5px] transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:text-foreground hover:bg-accent",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Breadcrumb({
  domainTitle,
  subdomainTitle,
}: {
  domainTitle: string;
  subdomainTitle: string;
}) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground">
      <span className="font-medium">{domainTitle}</span>
      <span className="text-muted-foreground/50" aria-hidden="true">
        /
      </span>
      <span className="font-medium">{subdomainTitle}</span>
    </span>
  );
}

function ToolGridCard({ tool }: { tool: FlatTool }) {
  return (
    <Link
      href={tool.href}
      className="group flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-foreground/30 hover:bg-accent/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center gap-2 min-w-0">
            {tool.iconSvg && (
              <span
                className="size-6 shrink-0 overflow-hidden rounded text-foreground"
                dangerouslySetInnerHTML={{ __html: tool.iconSvg }}
              />
            )}
            <h3 className="text-base font-semibold leading-tight truncate">
              {tool.name}
            </h3>
          </div>
          <Breadcrumb
            domainTitle={tool.domainTitle}
            subdomainTitle={tool.subdomainTitle}
          />
        </div>
        <ArrowRight
          className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
          aria-hidden="true"
        />
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
        {tool.oneLiner}
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
        {tool.type && (
          <span className="inline-flex items-center rounded-md border border-border bg-background px-2 py-0.5 text-[11px] font-medium capitalize">
            {tool.type}
          </span>
        )}
        {tool.license && (
          <span className="inline-flex items-center rounded-md border border-border bg-background px-2 py-0.5 text-[11px] font-medium">
            {tool.license}
          </span>
        )}
        {tool.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground"
          >
            {tag}
          </span>
        ))}
        {tool.tags.length > 3 && (
          <span className="text-[11px] text-muted-foreground">
            +{tool.tags.length - 3}
          </span>
        )}
      </div>
    </Link>
  );
}

function ToolListRow({ tool }: { tool: FlatTool }) {
  return (
    <Link
      href={tool.href}
      className="group flex items-start gap-4 p-4 transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:bg-accent/40 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {tool.iconSvg && (
            <span
              className="size-6 shrink-0 overflow-hidden rounded text-foreground self-center"
              dangerouslySetInnerHTML={{ __html: tool.iconSvg }}
            />
          )}
          <h3 className="text-base font-semibold leading-tight">
            {tool.name}
          </h3>
          <Breadcrumb
            domainTitle={tool.domainTitle}
            subdomainTitle={tool.subdomainTitle}
          />
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {tool.oneLiner}
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          {tool.type && (
            <span className="inline-flex items-center rounded-md border border-border bg-background px-2 py-0.5 text-[11px] font-medium capitalize">
              {tool.type}
            </span>
          )}
          {tool.license && (
            <span className="inline-flex items-center rounded-md border border-border bg-background px-2 py-0.5 text-[11px] font-medium">
              {tool.license}
            </span>
          )}
          {tool.tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {tool.tags.length > 5 && (
            <span className="text-[11px] text-muted-foreground">
              +{tool.tags.length - 5}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-shrink-0 flex-col items-end gap-2">
        {tool.url && (
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
            <span className="max-w-[12rem] truncate">{tool.url}</span>
          </span>
        )}
        <ArrowRight
          className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
