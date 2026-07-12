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
  Network,
  ListTree,
  CircleDot,
  LayoutGrid,
  Plus,
  Minus,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";
import { domainColor, domainSwatchStyle } from "@/lib/domain-style";

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
// View switcher
// ────────────────────────────────────────────────────────────────────────────

type ViewMode = "mindmap" | "tree" | "radial" | "grid";

const STORAGE_KEY = "aio-stuff:blueprint-view";

const VIEW_OPTIONS: { id: ViewMode; label: string; icon: LucideIcon }[] = [
  { id: "mindmap", label: "Mind Map", icon: Network },
  { id: "tree", label: "Tree", icon: ListTree },
  { id: "radial", label: "Radial", icon: CircleDot },
  { id: "grid", label: "Grid", icon: LayoutGrid },
];

// ────────────────────────────────────────────────────────────────────────────
// Root canvas — owns the view state, persists to localStorage.
// ────────────────────────────────────────────────────────────────────────────

export function BlueprintCanvas({ tree }: { tree: BlueprintTree }) {
  const [view, setView] = React.useState<ViewMode>("mindmap");
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && VIEW_OPTIONS.some((v) => v.id === saved)) {
        setView(saved as ViewMode);
      }
    } catch {
      // localStorage may be unavailable (privacy mode) — fall back to default.
    }
    setHydrated(true);
  }, []);

  const changeView = React.useCallback((v: ViewMode) => {
    setView(v);
    try {
      localStorage.setItem(STORAGE_KEY, v);
    } catch {
      // ignore — view still works in-memory for this session.
    }
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
      {/* Toolbar: view switcher + legend */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ViewSwitcher
          view={view}
          onChange={changeView}
          hydrated={hydrated}
        />
        <Legend domains={tree.domains} />
      </div>

      {/* Totals row */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">
        <span
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm"
          aria-hidden="true"
        >
          A
        </span>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight">AIO-STUFF</span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {tree.domains.length} domains · {totalSubdomains} subdomains ·{" "}
            {totalTools} tool {totalTools === 1 ? "entry" : "entries"}
          </span>
        </div>
      </div>

      {/* Active view */}
      <div aria-live="polite">
        {view === "mindmap" && <MindMapView tree={tree} />}
        {view === "tree" && <TreeView tree={tree} />}
        {view === "radial" && <RadialView tree={tree} />}
        {view === "grid" && <GridView tree={tree} />}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// View switcher + legend
// ────────────────────────────────────────────────────────────────────────────

function ViewSwitcher({
  view,
  onChange,
  hydrated,
}: {
  view: ViewMode;
  onChange: (v: ViewMode) => void;
  hydrated: boolean;
}) {
  return (
    <div
      className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-border bg-card p-1.5 shadow-sm"
      role="tablist"
      aria-label="Blueprint view"
      suppressHydrationWarning
    >
      {VIEW_OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const active = hydrated && view === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.id)}
            className={[
              "inline-flex h-9 items-center gap-2 rounded-lg px-3.5 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-accent",
            ].join(" ")}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function Legend({ domains }: { domains: BlueprintDomain[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {domains.map((d) => (
        <li key={d.slug} className="flex items-center gap-2 text-xs">
          <span
            className="inline-block h-3 w-3 flex-shrink-0 rounded-full"
            style={domainSwatchStyle(d.slug)}
            aria-hidden="true"
          />
          <span className="font-medium">{d.title}</span>
        </li>
      ))}
    </ul>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Shared canvas — large scrollable area for the pannable views.
// Includes a zoom control. The inner content is sized by the view.
// ────────────────────────────────────────────────────────────────────────────

function CanvasScroll({
  width,
  height,
  zoom,
  onZoom,
  children,
}: {
  width: number;
  height: number;
  zoom: number;
  onZoom: (z: number) => void;
  children: React.ReactNode;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Wheel-to-zoom (ctrl/cmd + wheel). Plain wheel scrolls the canvas.
  const handleWheel = React.useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const next = Math.min(2, Math.max(0.4, +(zoom + delta).toFixed(2)));
        onZoom(next);
      }
    },
    [zoom, onZoom],
  );

  return (
    <div className="relative">
      {/* Zoom controls */}
      <div className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-lg border border-border bg-card/90 p-1 shadow-sm backdrop-blur">
        <button
          type="button"
          onClick={() => onZoom(Math.max(0.4, +(zoom - 0.1).toFixed(2)))}
          aria-label="Zoom out"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="min-w-12 text-center text-xs font-medium tabular-nums text-muted-foreground">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={() => onZoom(Math.min(2, +(zoom + 0.1).toFixed(2)))}
          aria-label="Zoom in"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onZoom(1)}
          aria-label="Reset zoom"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      <div
        ref={containerRef}
        onWheel={handleWheel}
        className="atlas-scroll max-h-[70vh] overflow-auto rounded-xl border border-border bg-card/30 p-4"
      >
        <div
          style={{
            width: width * zoom,
            height: height * zoom,
            position: "relative",
          }}
        >
          <div
            style={{
              width,
              height,
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Mind Map view — horizontal orthogonal tree.
// Root on the left, domains → subdomains → tools fanning out to the right.
// ────────────────────────────────────────────────────────────────────────────

const MM = {
  TOOL_H: 32,
  TOOL_GAP: 8,
  SUB_HEADER_H: 44,
  SUB_GAP: 16,
  DOM_HEADER_H: 60,
  DOM_TO_SUB_GAP: 16,
  DOM_BOTTOM_PAD: 16,
  DOM_GAP: 32,
  NODE_W: 200,
  COL_GAP: 80, // horizontal gap between columns (connector length)
  PAD_X: 40,
  PAD_TOP: 40,
};

function MindMapView({ tree }: { tree: BlueprintTree }) {
  const [zoom, setZoom] = React.useState(1);

  // Compute column x positions: root, domain, subdomain, tool
  const colX = [
    MM.PAD_X,
    MM.PAD_X + MM.NODE_W + MM.COL_GAP,
    MM.PAD_X + 2 * (MM.NODE_W + MM.COL_GAP),
    MM.PAD_X + 3 * (MM.NODE_W + MM.COL_GAP),
  ];

  // Compute slot heights bottom-up. The mind-map is a 4-column layout:
  //   col 0 = root, col 1 = domain header, col 2 = subdomain header,
  //   col 3 = tool cards.
  // Each subdomain "slot" is tall enough to fit its tools (col 3) so the
  // connectors fan out cleanly. The subdomain header (col 2) is vertically
  // centered within its slot. Each domain "branch" is tall enough to fit
  // its subdomain slots stacked below the domain header. The domain header
  // is vertically centered within its branch.
  const domainsLaid = tree.domains.map((d) => {
    const subsLaid = d.subdomains.map((s) => {
      const toolsH =
        s.tools.length > 0
          ? s.tools.length * MM.TOOL_H +
            Math.max(0, s.tools.length - 1) * MM.TOOL_GAP
          : 0;
      // Slot must fit at least the sub header, plus the tools block (with
      // a little padding on each side) if there are tools.
      const slotH = Math.max(
        MM.SUB_HEADER_H,
        toolsH > 0 ? toolsH + 12 : MM.SUB_HEADER_H,
      );
      return { sub: s, toolsH, slotH };
    });
    const subsBlockH =
      subsLaid.reduce((n, s) => n + s.slotH, 0) +
      Math.max(0, subsLaid.length - 1) * MM.SUB_GAP;
    const branchH =
      MM.DOM_HEADER_H +
      (subsLaid.length > 0
        ? MM.DOM_TO_SUB_GAP + subsBlockH + MM.DOM_BOTTOM_PAD
        : 0);
    return { dom: d, subsLaid, subsBlockH, branchH };
  });

  const totalHeight =
    domainsLaid.reduce((n, d) => n + d.branchH, 0) +
    Math.max(0, domainsLaid.length - 1) * MM.DOM_GAP +
    MM.PAD_TOP * 2;
  const totalWidth = colX[3] + MM.NODE_W + MM.PAD_X;

  // Place domains (header centered within branch) and their subs/tools.
  // Pre-compute each branch's Y origin via a cumulative sum so we don't
  // mutate a cursor inside the .map() callback (which the
  // react-hooks/immutability lint rule forbids).
  const branchYs: number[] = [];
  {
    let y = MM.PAD_TOP;
    for (const d of domainsLaid) {
      branchYs.push(y);
      y += d.branchH + MM.DOM_GAP;
    }
  }

  const placedDomains = domainsLaid.map((d, i) => {
    const branchY = branchYs[i];
    // Domain header vertically centered within its branch slot.
    const domY = branchY + (d.branchH - MM.DOM_HEADER_H) / 2;
    const domCenterY = domY + MM.DOM_HEADER_H / 2;

    // Subs block starts below the domain header area.
    const subsBlockY = branchY + MM.DOM_HEADER_H + MM.DOM_TO_SUB_GAP;
    // Pre-compute each sub slot's Y origin within the subs block.
    const subSlotYs: number[] = [];
    {
      let sy = subsBlockY;
      for (const sl of d.subsLaid) {
        subSlotYs.push(sy);
        sy += sl.slotH + MM.SUB_GAP;
      }
    }
    const placedSubs = d.subsLaid.map((sl, j) => {
      const slotY = subSlotYs[j];
      // Sub header vertically centered within its slot.
      const subY = slotY + (sl.slotH - MM.SUB_HEADER_H) / 2;
      const subCenterY = subY + MM.SUB_HEADER_H / 2;
      // Tools vertically centered within the slot.
      const toolsStartY = slotY + (sl.slotH - sl.toolsH) / 2;
      const placedTools = sl.sub.tools.map((t, k) => {
        const ty = toolsStartY + k * (MM.TOOL_H + MM.TOOL_GAP);
        return {
          tool: t,
          x: colX[3],
          y: ty,
          centerY: ty + MM.TOOL_H / 2,
        };
      });
      return {
        ...sl,
        x: colX[2],
        y: subY,
        centerY: subCenterY,
        tools: placedTools,
      };
    });
    return {
      ...d,
      x: colX[1],
      y: domY,
      centerY: domCenterY,
      subdomains: placedSubs,
    };
  });

  const rootY = totalHeight / 2 - 30;
  const rootX = colX[0];
  const rootCenterY = rootY + 30;

  // Build orthogonal connector lines (horizontal-vertical-horizontal).
  type Line = { d: string; color: string; key: string };
  const lines: Line[] = [];
  for (const d of placedDomains) {
    const rMidX = (rootX + MM.NODE_W + d.x) / 2;
    lines.push({
      key: `r-${d.dom.slug}`,
      color: domainColor(d.dom.slug),
      d: `M ${rootX + MM.NODE_W} ${rootCenterY} H ${rMidX} V ${d.centerY} H ${d.x}`,
    });
    for (const s of d.subdomains) {
      const dMidX = (d.x + MM.NODE_W + s.x) / 2;
      lines.push({
        key: `d-${d.dom.slug}-${s.sub.slug}`,
        color: domainColor(d.dom.slug),
        d: `M ${d.x + MM.NODE_W} ${d.centerY} H ${dMidX} V ${s.centerY} H ${s.x}`,
      });
      for (const t of s.tools) {
        const sMidX = (s.x + MM.NODE_W + t.x) / 2;
        lines.push({
          key: `s-${d.dom.slug}-${s.sub.slug}-${t.tool.slug}`,
          color: domainColor(d.dom.slug),
          d: `M ${s.x + MM.NODE_W} ${s.centerY} H ${sMidX} V ${t.centerY} H ${t.x}`,
        });
      }
    }
  }

  return (
    <CanvasScroll
      width={totalWidth}
      height={totalHeight}
      zoom={zoom}
      onZoom={setZoom}
    >
      {/* SVG connector layer */}
      <svg
        width={totalWidth}
        height={totalHeight}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        {lines.map((l) => (
          <path
            key={l.key}
            d={l.d}
            stroke={l.color}
            strokeWidth={1.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.55}
          />
        ))}
      </svg>

      {/* Root node */}
      <div
        style={{
          position: "absolute",
          left: rootX,
          top: rootY,
          width: MM.NODE_W,
          height: 60,
        }}
        className="flex items-center gap-2.5 rounded-xl border-2 border-foreground/40 bg-card px-3 shadow-sm"
      >
        <span
          className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm"
          aria-hidden="true"
        >
          A
        </span>
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="text-sm font-bold tracking-tight">AIO-STUFF</span>
          <span className="text-[10px] text-muted-foreground">root</span>
        </div>
      </div>

      {/* Domain header nodes (just the header — branches extend to col 2/3) */}
      {placedDomains.map((d) => {
        const Icon = domainIcon(d.dom.slug);
        const toolCount = d.dom.subdomains.reduce(
          (n, s) => n + s.tools.length,
          0,
        );
        return (
          <div
            key={d.dom.slug}
            style={{
              position: "absolute",
              left: d.x,
              top: d.y,
              width: MM.NODE_W,
              height: MM.DOM_HEADER_H,
              borderColor: domainColor(d.dom.slug),
            }}
            className="rounded-xl border-2 bg-card p-2.5 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md text-white"
                style={{ backgroundColor: domainColor(d.dom.slug) }}
                aria-hidden="true"
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="flex min-w-0 flex-col leading-tight">
                <span className="truncate text-sm font-bold tracking-tight">
                  {d.dom.title}
                </span>
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  {d.dom.subdomains.length} sub · {toolCount} tools
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Subdomain header nodes (just the header — tools extend to col 3) */}
      {placedDomains.flatMap((d) =>
        d.subdomains.map((s) => (
          <div
            key={`${d.dom.slug}-${s.sub.slug}`}
            style={{
              position: "absolute",
              left: s.x,
              top: s.y,
              width: MM.NODE_W,
              height: MM.SUB_HEADER_H,
              borderColor: domainColor(d.dom.slug),
            }}
            className="rounded-lg border bg-card shadow-sm"
          >
            <div className="flex h-full items-center gap-2 px-2.5 py-2">
              <span
                className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md"
                style={{
                  backgroundColor: domainColor(d.dom.slug),
                  opacity: 0.15,
                }}
                aria-hidden="true"
              >
                <Folder
                  className="h-3.5 w-3.5"
                  style={{ color: domainColor(d.dom.slug) }}
                />
              </span>
              <div className="flex min-w-0 flex-col leading-tight">
                <span className="truncate text-xs font-semibold">
                  {s.sub.title}
                </span>
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  {s.sub.tools.length} tools
                </span>
              </div>
            </div>
          </div>
        )),
      )}

      {/* Tool nodes */}
      {placedDomains.flatMap((d) =>
        d.subdomains.flatMap((s) =>
          s.tools.map((t) => (
            <Link
              key={`${d.dom.slug}-${s.sub.slug}-${t.tool.slug}`}
              href={t.tool.href}
              style={{
                position: "absolute",
                left: t.x,
                top: t.y,
                width: MM.NODE_W,
                height: MM.TOOL_H,
                borderColor: domainColor(d.dom.slug),
              }}
              className="group flex items-center gap-2 rounded-md border bg-card px-2 shadow-sm transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded"
                style={{
                  backgroundColor: domainColor(d.dom.slug),
                  opacity: 0.15,
                }}
                aria-hidden="true"
              >
                <FileText
                  className="h-3 w-3"
                  style={{ color: domainColor(d.dom.slug) }}
                />
              </span>
              <span className="truncate text-xs font-medium">{t.tool.name}</span>
              {t.tool.type && (
                <span className="ml-auto inline-flex items-center rounded border border-border bg-background px-1 text-[9px] font-medium capitalize text-muted-foreground">
                  {t.tool.type}
                </span>
              )}
            </Link>
          )),
        ),
      )}
    </CanvasScroll>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Tree view — vertical indented tree with collapse/expand.
// Color-coded per domain, counts on every node.
// ────────────────────────────────────────────────────────────────────────────

function TreeView({ tree }: { tree: BlueprintTree }) {
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>(
    {},
  );
  const toggle = React.useCallback((id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  return (
    <div className="space-y-2 rounded-xl border border-border bg-card p-4 sm:p-5">
      {/* Root node */}
      <div className="flex items-center gap-3 rounded-lg border-2 border-foreground/30 bg-background/50 p-3">
        <span
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold"
          aria-hidden="true"
        >
          A
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-base font-bold tracking-tight">AIO-STUFF</span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {tree.domains.length} domains ·{" "}
            {tree.domains.reduce((n, d) => n + d.subdomains.length, 0)}{" "}
            subdomains ·{" "}
            {tree.domains.reduce(
              (n, d) => n + d.subdomains.reduce((m, s) => m + s.tools.length, 0),
              0,
            )}{" "}
            tools
          </span>
        </div>
      </div>

      <ul className="space-y-2 border-l-2 border-border pl-4 sm:pl-5 ml-5 sm:ml-6">
        {tree.domains.map((domain) => {
          const isCollapsed = !!collapsed[domain.slug];
          const toolCount = domain.subdomains.reduce(
            (n, s) => n + s.tools.length,
            0,
          );
          const Icon = domainIcon(domain.slug);
          return (
            <li key={domain.slug} className="relative">
              <span
                className="absolute -left-4 sm:-left-5 top-7 h-0.5 w-4 sm:w-5"
                style={{ backgroundColor: domainColor(domain.slug) }}
                aria-hidden="true"
              />
              <div
                className="rounded-lg border bg-card p-3 transition-colors hover:bg-accent/20"
                style={{ borderColor: domainColor(domain.slug) }}
              >
                <button
                  type="button"
                  onClick={() => toggle(domain.slug)}
                  aria-expanded={!isCollapsed}
                  className="flex w-full items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md"
                >
                  <ChevronRight
                    className={[
                      "h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform",
                      isCollapsed ? "" : "rotate-90",
                    ].join(" ")}
                    aria-hidden="true"
                  />
                  <span
                    className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-white"
                    style={{ backgroundColor: domainColor(domain.slug) }}
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
                      {domain.subdomains.length === 1
                        ? "subdomain"
                        : "subdomains"}{" "}
                      · {toolCount} {toolCount === 1 ? "tool" : "tools"}
                    </span>
                  </div>
                  <span
                    className="ml-auto hidden sm:inline-flex items-center rounded-md border border-border bg-background px-2 py-0.5 text-[11px] font-mono text-muted-foreground"
                  >
                    /{domain.slug}
                  </span>
                </button>
              </div>

              {!isCollapsed && domain.subdomains.length > 0 && (
                <ul
                  className="mt-2 space-y-2 border-l-2 pl-4 sm:pl-5 ml-5 sm:ml-6"
                  style={{ borderColor: domainColor(domain.slug) }}
                >
                  {domain.subdomains.map((sub) => {
                    const subCollapsed =
                      !!collapsed[`${domain.slug}/${sub.slug}`];
                    return (
                      <li key={sub.slug} className="relative">
                        <span
                          className="absolute -left-4 sm:-left-5 top-6 h-0.5 w-4 sm:w-5"
                          style={{
                            backgroundColor: domainColor(domain.slug),
                            opacity: 0.5,
                          }}
                          aria-hidden="true"
                        />
                        <div className="rounded-lg border border-border bg-card p-2.5">
                          <button
                            type="button"
                            onClick={() =>
                              toggle(`${domain.slug}/${sub.slug}`)
                            }
                            aria-expanded={!subCollapsed}
                            className="flex w-full items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
                          >
                            <ChevronRight
                              className={[
                                "h-3.5 w-3.5 flex-shrink-0 text-muted-foreground transition-transform",
                                subCollapsed ? "" : "rotate-90",
                              ].join(" ")}
                              aria-hidden="true"
                            />
                            <span
                              className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md"
                              style={{
                                backgroundColor: domainColor(domain.slug),
                                opacity: 0.18,
                              }}
                              aria-hidden="true"
                            >
                              <Folder
                                className="h-3.5 w-3.5"
                                style={{ color: domainColor(domain.slug) }}
                              />
                            </span>
                            <span className="text-sm font-semibold leading-tight truncate">
                              {sub.title}
                            </span>
                            <span className="ml-auto inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground tabular-nums">
                              {sub.tools.length}{" "}
                              {sub.tools.length === 1 ? "tool" : "tools"}
                            </span>
                          </button>
                        </div>

                        {!subCollapsed && sub.tools.length > 0 && (
                          <ul
                            className="mt-2 space-y-1.5 border-l pl-4 sm:pl-5 ml-4 sm:ml-5"
                            style={{
                              borderColor: domainColor(domain.slug),
                              opacity: 1,
                            }}
                          >
                            {sub.tools.map((tool) => (
                              <li
                                key={tool.slug}
                                className="relative"
                              >
                                <span
                                  className="absolute -left-4 sm:-left-5 top-4 h-0.5 w-4 sm:w-5"
                                  style={{
                                    backgroundColor: domainColor(domain.slug),
                                    opacity: 0.4,
                                  }}
                                  aria-hidden="true"
                                />
                                <Link
                                  href={tool.href}
                                  className="group flex items-center gap-2.5 rounded-md border border-border bg-card px-3 py-2 transition-colors hover:bg-accent/40 hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                  <span
                                    className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded"
                                    style={{
                                      backgroundColor: domainColor(domain.slug),
                                      opacity: 0.15,
                                    }}
                                    aria-hidden="true"
                                  >
                                    <FileText
                                      className="h-3 w-3"
                                      style={{
                                        color: domainColor(domain.slug),
                                      }}
                                    />
                                  </span>
                                  <span className="text-sm font-medium leading-tight truncate">
                                    {tool.name}
                                  </span>
                                  {tool.type && (
                                    <span className="ml-1 inline-flex items-center rounded border border-border bg-background px-1.5 py-0 text-[10px] font-medium capitalize text-muted-foreground">
                                      {tool.type}
                                    </span>
                                  )}
                                  <span className="ml-auto hidden sm:inline-flex items-center rounded bg-background px-1.5 py-0 text-[10px] font-mono text-muted-foreground">
                                    /{domain.slug}/{sub.slug}/{tool.slug}
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}

              {!isCollapsed && domain.subdomains.length === 0 && (
                <p className="mt-2 ml-7 text-xs italic text-muted-foreground">
                  No subdomains yet — subdomains are created here as tools are
                  added.
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Radial view — concentric rings (root center, domains ring 1, subdomains
// ring 2, tools ring 3). SVG-based. Tools fold into their subdomain node if
// the layout would be too dense.
// ────────────────────────────────────────────────────────────────────────────

const RAD = {
  ROOT_R: 44,
  R1: 200, // domain ring radius (center-to-center)
  R2: 360, // subdomain ring
  R3: 500, // tool ring
  DOM_R: 32,
  SUB_R: 24,
  TOOL_R: 8,
};

function RadialView({ tree }: { tree: BlueprintTree }) {
  const [zoom, setZoom] = React.useState(1);

  const size = (RAD.R3 + 80) * 2;
  const cx = size / 2;
  const cy = size / 2;

  // Allocate angles: each domain gets an equal slice of 360°.
  const numDomains = Math.max(tree.domains.length, 1);
  const domainArc = (2 * Math.PI) / numDomains;

  // For each domain, distribute its subdomains within its arc.
  type PlacedSub = {
    sub: BlueprintSubdomain;
    angle: number;
    tools: { tool: BlueprintTool; angle: number }[];
  };
  type PlacedDom = {
    dom: BlueprintDomain;
    angle: number;
    subs: PlacedSub[];
  };

  const placed: PlacedDom[] = tree.domains.map((dom, di) => {
    const domAngle = di * domainArc + domainArc / 2 - Math.PI / 2;
    const numSubs = Math.max(dom.subdomains.length, 1);
    const subArc = domainArc / numSubs;
    const subs: PlacedSub[] = dom.subdomains.map((sub, si) => {
      const subAngle =
        domAngle - (domainArc / 2) + subArc / 2 + si * subArc;
      const numTools = Math.max(sub.tools.length, 1);
      const toolArc = subArc / numTools;
      const tools = sub.tools.map((tool, ti) => ({
        tool,
        angle: subAngle - (subArc / 2) + toolArc / 2 + ti * toolArc,
      }));
      return { sub, angle: subAngle, tools };
    });
    return { dom, angle: domAngle, subs };
  });

  // Helper: polar to cartesian
  const p2c = (r: number, a: number) => ({
    x: cx + r * Math.cos(a),
    y: cy + r * Math.sin(a),
  });

  // Connector lines: root→domain, domain→sub, sub→tool
  type Seg = { x1: number; y1: number; x2: number; y2: number; color: string };
  const segs: Seg[] = [];
  for (const d of placed) {
    const dpos = p2c(RAD.R1, d.angle);
    segs.push({ x1: cx, y1: cy, x2: dpos.x, y2: dpos.y, color: domainColor(d.dom.slug) });
    for (const s of d.subs) {
      const spos = p2c(RAD.R2, s.angle);
      segs.push({
        x1: dpos.x,
        y1: dpos.y,
        x2: spos.x,
        y2: spos.y,
        color: domainColor(d.dom.slug),
      });
      for (const t of s.tools) {
        const tpos = p2c(RAD.R3, t.angle);
        segs.push({
          x1: spos.x,
          y1: spos.y,
          x2: tpos.x,
          y2: tpos.y,
          color: domainColor(d.dom.slug),
        });
      }
    }
  }

  return (
    <CanvasScroll
      width={size}
      height={size}
      zoom={zoom}
      onZoom={setZoom}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ position: "absolute", top: 0, left: 0 }}
        role="img"
        aria-label="Radial structure of AIO-STUFF domains, subdomains, and tools"
      >
        {/* Faint ring guides */}
        <circle cx={cx} cy={cy} r={RAD.R1} fill="none" stroke="var(--border)" strokeWidth={1} strokeDasharray="3 5" opacity={0.5} />
        <circle cx={cx} cy={cy} r={RAD.R2} fill="none" stroke="var(--border)" strokeWidth={1} strokeDasharray="3 5" opacity={0.5} />
        <circle cx={cx} cy={cy} r={RAD.R3} fill="none" stroke="var(--border)" strokeWidth={1} strokeDasharray="3 5" opacity={0.5} />

        {/* Connectors */}
        {segs.map((s, i) => (
          <line
            key={i}
            x1={s.x1}
            y1={s.y1}
            x2={s.x2}
            y2={s.y2}
            stroke={s.color}
            strokeWidth={1.2}
            opacity={0.5}
          />
        ))}

        {/* Root center */}
        <circle
          cx={cx}
          cy={cy}
          r={RAD.ROOT_R}
          fill="var(--primary)"
          stroke="var(--primary-foreground)"
          strokeWidth={2}
        />
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--primary-foreground)"
          fontSize={18}
          fontWeight={700}
        >
          AIO
        </text>

        {/* Domain nodes */}
        {placed.map((d) => {
          const pos = p2c(RAD.R1, d.angle);
          const Icon = domainIcon(d.dom.slug);
          const toolCount = d.dom.subdomains.reduce(
            (n, s) => n + s.tools.length,
            0,
          );
          const color = domainColor(d.dom.slug);
          return (
            <g key={d.dom.slug}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={RAD.DOM_R}
                fill={color}
                stroke="var(--card)"
                strokeWidth={2}
              />
              <foreignObject
                x={pos.x - RAD.DOM_R}
                y={pos.y - RAD.DOM_R}
                width={RAD.DOM_R * 2}
                height={RAD.DOM_R * 2}
                style={{ pointerEvents: "none" }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  <Icon size={18} aria-hidden="true" />
                </div>
              </foreignObject>
              {/* Label outside the ring */}
              <text
                x={cx + (RAD.R1 + RAD.DOM_R + 8) * Math.cos(d.angle)}
                y={cy + (RAD.R1 + RAD.DOM_R + 8) * Math.sin(d.angle)}
                textAnchor={
                  Math.cos(d.angle) > 0.1
                    ? "start"
                    : Math.cos(d.angle) < -0.1
                    ? "end"
                    : "middle"
                }
                dominantBaseline="central"
                fill="var(--foreground)"
                fontSize={13}
                fontWeight={700}
              >
                {d.dom.title}
              </text>
              <text
                x={cx + (RAD.R1 + RAD.DOM_R + 8) * Math.cos(d.angle)}
                y={cy + (RAD.R1 + RAD.DOM_R + 8) * Math.sin(d.angle) + 14}
                textAnchor={
                  Math.cos(d.angle) > 0.1
                    ? "start"
                    : Math.cos(d.angle) < -0.1
                    ? "end"
                    : "middle"
                }
                fill="var(--muted-foreground)"
                fontSize={10}
              >
                {toolCount} tools
              </text>
            </g>
          );
        })}

        {/* Subdomain nodes */}
        {placed.flatMap((d) =>
          d.subs.map((s) => {
            const pos = p2c(RAD.R2, s.angle);
            const color = domainColor(d.dom.slug);
            return (
              <g key={`${d.dom.slug}-${s.sub.slug}`}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={RAD.SUB_R}
                  fill="var(--card)"
                  stroke={color}
                  strokeWidth={2}
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={color}
                  fontSize={9}
                  fontWeight={700}
                >
                  {s.sub.tools.length}
                </text>
                <title>{`${d.dom.title} · ${s.sub.title} — ${s.sub.tools.length} tools`}</title>
              </g>
            );
          }),
        )}

        {/* Tool nodes */}
        {placed.flatMap((d) =>
          d.subs.flatMap((s) =>
            s.tools.map((t) => {
              const pos = p2c(RAD.R3, t.angle);
              const color = domainColor(d.dom.slug);
              return (
                <g key={`${d.dom.slug}-${s.sub.slug}-${t.tool.slug}`}>
                  <a
                    href={t.tool.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={RAD.TOOL_R}
                      fill={color}
                      stroke="var(--card)"
                      strokeWidth={1.5}
                    >
                      <title>{t.tool.name}</title>
                    </circle>
                  </a>
                </g>
              );
            }),
          ),
        )}
      </svg>
    </CanvasScroll>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Grid view — card grid grouped by domain. Color-coded domain headers.
// ────────────────────────────────────────────────────────────────────────────

function GridView({ tree }: { tree: BlueprintTree }) {
  return (
    <div className="space-y-6">
      {tree.domains.map((d) => {
        const Icon = domainIcon(d.slug);
        const color = domainColor(d.slug);
        const toolCount = d.subdomains.reduce(
          (n, s) => n + s.tools.length,
          0,
        );
        const allTools = d.subdomains.flatMap((s) =>
          s.tools.map((t) => ({ t, s })),
        );
        return (
          <section
            key={d.slug}
            className="overflow-hidden rounded-xl border bg-card"
            style={{ borderColor: color }}
          >
            {/* Domain header */}
            <div
              className="flex items-center gap-3 border-b px-4 py-3 sm:px-5"
              style={{
                backgroundColor: color,
                borderColor: color,
              }}
            >
              <span
                className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/15 text-white"
                aria-hidden="true"
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col leading-tight">
                <h3 className="text-base font-bold tracking-tight text-white">
                  {d.title}
                </h3>
                <span className="text-[11px] text-white/80 tabular-nums">
                  {d.subdomains.length}{" "}
                  {d.subdomains.length === 1 ? "subdomain" : "subdomains"} ·{" "}
                  {toolCount} {toolCount === 1 ? "tool" : "tools"}
                </span>
              </div>
            </div>

            {/* Tools */}
            {allTools.length > 0 ? (
              <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
                {allTools.map(({ t, s }) => (
                  <Link
                    key={`${d.slug}-${s.slug}-${t.slug}`}
                    href={t.href}
                    className="group flex h-full flex-col gap-1 bg-card p-4 transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-semibold leading-tight">
                        {t.name}
                      </span>
                      <span
                        className="inline-flex h-2 w-2 flex-shrink-0 mt-1.5 rounded-full"
                        style={{ backgroundColor: color }}
                        aria-hidden="true"
                      />
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {s.title}
                    </span>
                    {t.type && (
                      <span className="mt-1 inline-flex w-fit items-center rounded border border-border bg-background px-1.5 py-0 text-[10px] font-medium capitalize text-muted-foreground">
                        {t.type}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                No tool entries yet.
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
