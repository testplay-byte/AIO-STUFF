"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronRight,
  FileText,
  Network,
  ListTree,
  LayoutGrid,
  Plus,
  Minus,
  RotateCcw,
  Maximize2,
  Minimize2,
  type LucideIcon,
} from "lucide-react";
import { domainColor, domainSwatchStyle } from "@/lib/domain-style";
import {
  getDomainIconSvg,
  getSubdomainIconSvg,
  hasSubdomainIcon,
} from "@/lib/icons";

// ────────────────────────────────────────────────────────────────────────────
// Types — slim tree shape, JSON-serializable, passed from the server page.
// ────────────────────────────────────────────────────────────────────────────

export type BlueprintTool = {
  slug: string;
  name: string;
  type: string;
  tags: string[];
  href: string;
  iconSvg?: string;
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
// View switcher
// ────────────────────────────────────────────────────────────────────────────

type ViewMode = "mindmap" | "tree" | "grid";

const STORAGE_KEY = "aio-stuff:blueprint-view";

const VIEW_OPTIONS: { id: ViewMode; label: string; icon: LucideIcon }[] = [
  { id: "mindmap", label: "Mind Map", icon: Network },
  { id: "tree", label: "Tree", icon: ListTree },
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
// Shared canvas — large pannable/zoomable area for the pannable views.
// Includes: wheel-to-zoom (no modifier needed), drag-to-pan on empty
// canvas, zoom buttons (+/−/reset), zoom %, and a fullscreen toggle.
// Wheel: zooms toward the cursor position. Drag: pans the inner content
// via a translate offset (applied on top of the zoom scale).
// Clicking a node inside the canvas does NOT pan — node interaction wins.
// ────────────────────────────────────────────────────────────────────────────

const MIN_ZOOM = 0.4;
const MAX_ZOOM = 2;

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
  const wrapRef = React.useRef<HTMLDivElement>(null);

  // Pan state — the translate offset applied to the inner content. The
  // outer container is `overflow: hidden` (not `auto`) because we drive
  // all panning ourselves via translateX/Y.
  const [pan, setPan] = React.useState({ x: 0, y: 0 });

  // Fullscreen state — toggled by the Maximize2/Minimize2 button.
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  // Drag tracking — when the user presses the mouse button on EMPTY
  // canvas (not on a node), we start a pan gesture.
  const dragStateRef = React.useRef<{
    active: boolean;
    pointerId: number | null;
    startClientX: number;
    startClientY: number;
    startPanX: number;
    startPanY: number;
    moved: boolean;
  }>({
    active: false,
    pointerId: null,
    startClientX: 0,
    startClientY: 0,
    startPanX: 0,
    startPanY: 0,
    moved: false,
  });

  // ─── Fullscreen: toggle the browser Fullscreen API + a CSS class that
  // makes the canvas container fill the viewport. ───
  const toggleFullscreen = React.useCallback(async () => {
    const el = wrapRef.current;
    if (!el) return;
    const doc = document as Document & {
      webkitFullscreenElement?: Element | null;
      webkitExitFullscreen?: () => Promise<void>;
    };
    const elWithVendor = el as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void>;
    };
    const isFs =
      document.fullscreenElement != null ||
      doc.webkitFullscreenElement != null;
    if (isFs) {
      try {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
      } catch {
        // ignore — best effort
      }
      return;
    }
    try {
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (elWithVendor.webkitRequestFullscreen)
        await elWithVendor.webkitRequestFullscreen();
    } catch {
      // If the Fullscreen API is unavailable or denied, the CSS class
      // still gives a "maximized" feel — flip the state regardless.
    }
    // Fallback: if requestFullscreen failed silently, still toggle the
    // CSS maximized state so the user sees something happen.
    setIsFullscreen((v) => !v);
  }, []);

  // Sync isFullscreen with the browser's fullscreen state. The user can
  // exit fullscreen via Esc or browser chrome — we listen for the
  // `fullscreenchange` event and update accordingly.
  React.useEffect(() => {
    const handler = () => {
      const doc = document as Document & {
        webkitFullscreenElement?: Element | null;
      };
      const isFs =
        document.fullscreenElement != null ||
        doc.webkitFullscreenElement != null;
      setIsFullscreen(isFs);
    };
    document.addEventListener("fullscreenchange", handler);
    document.addEventListener("webkitfullscreenchange", handler);
    return () => {
      document.removeEventListener("fullscreenchange", handler);
      document.removeEventListener("webkitfullscreenchange", handler);
    };
  }, []);

  // Reset pan whenever zoom returns to 1 — keeps the canvas feeling sane
  // when the user hits "reset".
  // (Note: we intentionally don't reset on every zoom change; only reset
  // when explicitly snapping back to 1.0 from the reset button.)
  const handleResetZoom = React.useCallback(() => {
    onZoom(1);
    setPan({ x: 0, y: 0 });
  }, [onZoom]);

  // ─── Wheel: zoom without modifier. deltaY > 0 = zoom out, < 0 = zoom in.
  // We preventDefault on the wheel event so the page does NOT scroll
  // while the cursor is over the canvas — even when at min/max zoom.
  // Zoom anchor = cursor position relative to the inner content's origin,
  // so the point under the cursor stays put as the zoom changes. ───
  // We use refs for zoom + pan to avoid stale closures + jitter from
  // the parent-child state split (zoom is a prop from parent, pan is
  // local). The ref always has the latest value, so the wheel handler
  // computes pan' + next zoom atomically and applies both at once.
  const zoomRef = React.useRef(zoom);
  zoomRef.current = zoom;
  const panRef = React.useRef(pan);
  panRef.current = pan;

  const handleWheel = React.useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      e.preventDefault();
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;
      const curZoom = zoomRef.current;
      const curPan = panRef.current;

      // Smoother zoom: scale the delta by the current zoom so zooming
      // feels consistent at all zoom levels (not jittery).
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      const next = Math.min(
        MAX_ZOOM,
        Math.max(MIN_ZOOM, +(curZoom + delta).toFixed(3)),
      );
      if (next === curZoom) return;

      // Zoom toward cursor: keep the point under the cursor stationary.
      const ratio = next / curZoom;
      const nextPanX = cursorX - (cursorX - curPan.x) * ratio;
      const nextPanY = cursorY - (cursorY - curPan.y) * ratio;

      // Apply both updates atomically to avoid the jitter caused by
      // zoom (parent state) and pan (local state) updating in different
      // render cycles.
      onZoom(next);
      setPan({ x: nextPanX, y: nextPanY });
    },
    [onZoom],
  );

  // ─── Pointer drag: pan on empty canvas. ───
  // We attach pointerdown to the container; if the target is the container
  // itself (or one of the decorative layers — the SVG connector layer),
  // we treat it as a pan gesture. If the user pressed on a node (which is
  // a real DOM element with its own click handler), we do NOT start a pan
  // — node interaction wins.
  const isPanTarget = (target: EventTarget | null): boolean => {
    if (!(target instanceof Element)) return false;
    // The container itself, the inner sizing div, the SVG connector layer,
    // and the dashed ring guides are all "empty canvas". Anything with a
    // `[data-node]` attribute (or that lives inside one) is a node.
    if (target.closest("[data-node]")) return false;
    if (target.closest("a")) return false;
    if (target.closest("button")) return false;
    if (target.hasAttribute("data-canvas")) return true;
    if (target.closest("[data-canvas]")) return true;
    return false;
  };

  const handlePointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return; // only left button
      if (!isPanTarget(e.target)) return;
      const container = containerRef.current;
      if (!container) return;
      // Capture the pointer so we keep getting move events even if the
      // cursor leaves the container.
      try {
        container.setPointerCapture(e.pointerId);
      } catch {
        // ignore — pointer capture is best-effort
      }
      dragStateRef.current = {
        active: true,
        pointerId: e.pointerId,
        startClientX: e.clientX,
        startClientY: e.clientY,
        startPanX: pan.x,
        startPanY: pan.y,
        moved: false,
      };
      // Set a "grabbing" cursor while dragging.
      container.style.cursor = "grabbing";
    },
    [pan.x, pan.y],
  );

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const st = dragStateRef.current;
      if (!st.active || st.pointerId !== e.pointerId) return;
      const dx = e.clientX - st.startClientX;
      const dy = e.clientY - st.startClientY;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) st.moved = true;
      setPan({ x: st.startPanX + dx, y: st.startPanY + dy });
    },
    [],
  );

  const endDrag = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const st = dragStateRef.current;
      if (!st.active || st.pointerId !== e.pointerId) return;
      const container = containerRef.current;
      if (container) container.style.cursor = "";
      try {
        if (container && st.pointerId != null)
          container.releasePointerCapture(st.pointerId);
      } catch {
        // ignore
      }
      dragStateRef.current = {
        active: false,
        pointerId: null,
        startClientX: 0,
        startClientY: 0,
        startPanX: 0,
        startPanY: 0,
        moved: false,
      };
    },
    [],
  );

  // Inner content size — fits the natural width/height plus a generous
  // margin so panning has headroom in every direction.
  const innerW = width + 200;
  const innerH = height + 200;

  return (
    <div
      ref={wrapRef}
      className={[
        "relative",
        isFullscreen
          ? "fixed inset-0 z-50 bg-background"
          : "",
      ].join(" ")}
      data-fullscreen={isFullscreen ? "true" : "false"}
    >
      {/* Zoom + fullscreen controls */}
      <div
        className={[
          "absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-lg border border-border bg-card/90 p-1 shadow-sm backdrop-blur",
          isFullscreen ? "right-4 top-4" : "",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={() => onZoom(Math.max(MIN_ZOOM, +(zoom - 0.1).toFixed(2)))}
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
          onClick={() => onZoom(Math.min(MAX_ZOOM, +(zoom + 0.1).toFixed(2)))}
          aria-label="Zoom in"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={handleResetZoom}
          aria-label="Reset zoom"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
        <span
          className="mx-1 h-5 w-px bg-border"
          aria-hidden="true"
        />
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          aria-pressed={isFullscreen}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Maximize2 className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>

      <div
        ref={containerRef}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        data-canvas="true"
        className={[
          "atlas-scroll rounded-xl border border-border bg-card/30",
          isFullscreen
            ? "h-full w-full overflow-hidden touch-none"
            : "max-h-[80vh] overflow-auto touch-none cursor-grab",
        ].join(" ")}
        // hint to the browser that we handle wheel ourselves
        style={{ overscrollBehavior: "contain" }}
      >
        {/* Inner sizing div — gives the content headroom for panning. */}
        <div
          style={{
            width: innerW,
            height: innerH,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Translated+scaled content layer.
              transformOrigin is 0 0 so the math in handleWheel (cursor
              anchoring) holds. */}
          <div
            style={{
              width,
              height,
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "0 0",
              position: "absolute",
              top: 100,
              left: 100,
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
        data-node="root"
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
        const toolCount = d.dom.subdomains.reduce(
          (n, s) => n + s.tools.length,
          0,
        );
        return (
          <div
            key={d.dom.slug}
            data-node={`domain-${d.dom.slug}`}
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
                <div
                  className="size-4 shrink-0"
                  style={{ color: "white" }}
                  dangerouslySetInnerHTML={{
                    __html: getDomainIconSvg(d.dom.slug),
                  }}
                />
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
            data-node={`sub-${d.dom.slug}-${s.sub.slug}`}
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
              {hasSubdomainIcon(s.sub.slug) && (
                <div
                  className="size-4 shrink-0 text-foreground"
                  dangerouslySetInnerHTML={{
                    __html: getSubdomainIconSvg(s.sub.slug),
                  }}
                />
              )}
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
              data-node={`tool-${d.dom.slug}-${s.sub.slug}-${t.tool.slug}`}
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
              {t.tool.iconSvg ? (
                <span
                  className="size-5 shrink-0 overflow-hidden rounded text-foreground"
                  dangerouslySetInnerHTML={{ __html: t.tool.iconSvg }}
                />
              ) : (
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
              )}
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
//
// Connector convention (standard tree-drawing): non-last children get a
// T-shaped (├) connector (vertical line continues below the stub to the
// next sibling); the LAST child gets an L-shaped (└) connector (vertical
// line stops at the stub). The parent <ul> still draws the vertical line
// via `border-l`; for the last child we add a `LastChildMask` that paints
// over the parent's border below the horizontal stub so the L visually
// closes. The mask color is `var(--card)` — the same background the
// parent ul's padding shows through, so it blends seamlessly.
// ────────────────────────────────────────────────────────────────────────────

function LastChildMask({
  stubY,
  variant,
}: {
  stubY: number;
  variant: "thick" | "thin";
}) {
  // `thick` = parent ul has border-l-2 (2px); li's left is at 18/22px from
  //          ul's left, so the border sits at -18/-22px from li.
  // `thin`  = parent ul has border-l (1px); li's left is at 17/21px from
  //          ul's left, so the border sits at -17/-21px from li.
  const leftClass =
    variant === "thick"
      ? "-left-[18px] sm:-left-[22px]"
      : "-left-[17px] sm:-left-[21px]";
  const widthClass = variant === "thick" ? "w-[3px]" : "w-[2px]";
  return (
    <span
      aria-hidden="true"
      className={`absolute ${leftClass} ${widthClass} block`}
      style={{
        backgroundColor: "var(--card)",
        // The horizontal stub is 2px tall (h-0.5). Mask starts just below
        // it so the stub itself stays visible (it draws the corner of the L).
        top: stubY + 2,
        bottom: 0,
      }}
    />
  );
}

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
        {tree.domains.map((domain, domIdx) => {
          const isCollapsed = !!collapsed[domain.slug];
          const toolCount = domain.subdomains.reduce(
            (n, s) => n + s.tools.length,
            0,
          );
          const isLastDomain = domIdx === tree.domains.length - 1;
          return (
            <li key={domain.slug} className="relative">
              <span
                className="absolute -left-4 sm:-left-5 top-7 h-0.5 w-4 sm:w-5"
                style={{ backgroundColor: domainColor(domain.slug) }}
                aria-hidden="true"
              />
              {/* L-shaped (└) connector for the last domain — mask the
                  parent ul's border-l below the horizontal stub. */}
              {isLastDomain && (
                <LastChildMask stubY={28} variant="thick" />
              )}
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
                    <div
                      className="size-4 shrink-0"
                      style={{ color: "white" }}
                      dangerouslySetInnerHTML={{
                        __html: getDomainIconSvg(domain.slug),
                      }}
                    />
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
                  {domain.subdomains.map((sub, subIdx) => {
                    const subCollapsed =
                      !!collapsed[`${domain.slug}/${sub.slug}`];
                    const isLastSub = subIdx === domain.subdomains.length - 1;
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
                        {/* L-shaped (└) connector for the last subdomain. */}
                        {isLastSub && (
                          <LastChildMask stubY={24} variant="thick" />
                        )}
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
                              {hasSubdomainIcon(sub.slug) && (
                                <div
                                  className="size-4 shrink-0"
                                  style={{ color: domainColor(domain.slug) }}
                                  dangerouslySetInnerHTML={{
                                    __html: getSubdomainIconSvg(sub.slug),
                                  }}
                                />
                              )}
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
                            {sub.tools.map((tool, toolIdx) => {
                              const isLastTool = toolIdx === sub.tools.length - 1;
                              return (
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
                                  {/* L-shaped (└) connector for the last tool. */}
                                  {isLastTool && (
                                    <LastChildMask stubY={16} variant="thin" />
                                  )}
                                  <Link
                                    href={tool.href}
                                    className="group flex items-center gap-2.5 rounded-md border border-border bg-card px-3 py-2 transition-colors hover:bg-accent/40 hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                  >
                                  {tool.iconSvg ? (
                                    <span
                                      className="size-5 shrink-0 overflow-hidden rounded text-foreground"
                                      dangerouslySetInnerHTML={{
                                        __html: tool.iconSvg,
                                      }}
                                    />
                                  ) : (
                                    <span
                                      className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded"
                                      style={{
                                        backgroundColor:
                                          domainColor(domain.slug),
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
                                  )}
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
                              );
                            })}
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
// Grid view — card grid grouped by domain. Color-coded domain headers.
// ────────────────────────────────────────────────────────────────────────────

function GridView({ tree }: { tree: BlueprintTree }) {
  return (
    <div className="space-y-6">
      {tree.domains.map((d) => {
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
                <div
                  className="size-4 shrink-0"
                  style={{ color: "white" }}
                  dangerouslySetInnerHTML={{
                    __html: getDomainIconSvg(d.slug),
                  }}
                />
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
                      <div className="flex items-center gap-2 min-w-0">
                        {t.iconSvg && (
                          <span
                            className="size-6 shrink-0 overflow-hidden rounded text-foreground"
                            dangerouslySetInnerHTML={{ __html: t.iconSvg }}
                          />
                        )}
                        <span className="text-sm font-semibold leading-tight truncate">
                          {t.name}
                        </span>
                      </div>
                      <span
                        className="inline-flex h-2 w-2 flex-shrink-0 mt-1.5 rounded-full"
                        style={{ backgroundColor: color }}
                        aria-hidden="true"
                      />
                    </div>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      {hasSubdomainIcon(s.slug) && (
                        <span
                          className="size-3.5 shrink-0 text-foreground inline-flex items-center justify-center"
                          dangerouslySetInnerHTML={{
                            __html: getSubdomainIconSvg(s.slug),
                          }}
                        />
                      )}
                      <span className="truncate">{s.title}</span>
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
