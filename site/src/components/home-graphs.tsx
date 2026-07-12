"use client";

import * as React from "react";
import { domainColor, domainSwatchStyle, subdomainColor, subdomainIconBg } from "@/lib/domain-style";
import {
  getDomainIconSvg,
  getSubdomainIconSvg,
  hasSubdomainIcon,
} from "@/lib/icons";

// ────────────────────────────────────────────────────────────────────────────
// Types — slim, JSON-serializable, passed from the server home page.
// ────────────────────────────────────────────────────────────────────────────

export type DomainTooltipTool = {
  slug: string;
  name: string;
  href: string;
  iconSvg?: string;
};

export type DomainTooltipSubdomain = {
  slug: string;
  title: string;
  toolCount: number;
  tools: DomainTooltipTool[];
};

export type DomainTooltipData = {
  slug: string;
  title: string;
  description: string;
  toolCount: number;
  subdomainCount: number;
  subdomains: DomainTooltipSubdomain[];
};

// ────────────────────────────────────────────────────────────────────────────
// Shared tooltip content — the subdomain names + tool names popover.
// ────────────────────────────────────────────────────────────────────────────

function DomainTooltipContent({
  domain,
}: {
  domain: DomainTooltipData;
}) {
  const color = domainColor(domain.slug);
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span
          className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded"
          style={{ backgroundColor: color, opacity: 0.18 }}
          aria-hidden="true"
        >
          <div
            className="size-3 shrink-0"
            style={{ color }}
            dangerouslySetInnerHTML={{
              __html: getDomainIconSvg(domain.slug),
            }}
          />
        </span>
        <span className="text-sm font-bold tracking-tight">
          {domain.title}
        </span>
        <span className="ml-auto text-[10px] font-medium uppercase tracking-wider text-muted-foreground tabular-nums">
          {domain.subdomainCount} sub · {domain.toolCount} tools
        </span>
      </div>
      {domain.subdomains.length === 0 ? (
        <p className="text-xs italic text-muted-foreground">
          No subdomains yet — subdomains appear here as tools are added.
        </p>
      ) : (
        <ul className="max-h-64 space-y-2 overflow-y-auto atlas-scroll pr-1">
          {domain.subdomains.map((s) => (
            <li key={s.slug} className="space-y-0.5">
              <div className="flex items-center gap-2">
                {hasSubdomainIcon(s.slug) ? (
                  <div
                    className="flex size-5 shrink-0 items-center justify-center rounded"
                    style={subdomainIconBg(s.slug)}
                    aria-hidden="true"
                  >
                    <div
                      className="size-3 shrink-0"
                      style={{ color: subdomainColor(s.slug) }}
                      dangerouslySetInnerHTML={{
                        __html: getSubdomainIconSvg(s.slug),
                      }}
                    />
                  </div>
                ) : (
                  <span
                    className="inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: color }}
                    aria-hidden="true"
                  />
                )}
                <span className="text-xs font-semibold">{s.title}</span>
                <span className="ml-auto text-[10px] tabular-nums text-muted-foreground">
                  {s.toolCount}
                </span>
              </div>
              {s.tools.length > 0 && (
                <ul className="ml-3 flex flex-wrap gap-1">
                  {s.tools.map((t) => (
                    <li
                      key={t.slug}
                      className="inline-flex items-center rounded border border-border bg-background px-1.5 py-0 text-[10px] font-medium"
                    >
                      {t.name}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Tools per domain — horizontal bar chart with hover-with-names popover.
// ────────────────────────────────────────────────────────────────────────────

function ToolsPerDomainBar({
  domains,
  totalTools,
  hovered,
  onHover,
}: {
  domains: DomainTooltipData[];
  totalTools: number;
  hovered: string | null;
  onHover: (slug: string | null) => void;
}) {
  const maxCount = Math.max(1, ...domains.map((d) => d.toolCount));
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold tracking-tight">
          Tools per domain
        </h2>
        <span className="text-[11px] text-muted-foreground tabular-nums">
          {totalTools} total · hover for detail
        </span>
      </div>
      <ul className="space-y-2.5">
        {domains.map((d) => {
          const pct = (d.toolCount / maxCount) * 100;
          const isHovered = hovered === d.slug;
          return (
            <li
              key={d.slug}
              className="group relative flex items-center gap-3"
              onMouseEnter={() => onHover(d.slug)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(d.slug)}
              onBlur={() => onHover(null)}
              tabIndex={0}
              role="button"
              aria-label={`${d.title}: ${d.toolCount} tools across ${d.subdomainCount} subdomains`}
              aria-describedby={
                isHovered ? `bar-tip-${d.slug}` : undefined
              }
            >
              <span
                className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"
                aria-hidden="true"
              >
                <div
                  className="size-3.5 shrink-0"
                  style={{ color: domainColor(d.slug) }}
                  dangerouslySetInnerHTML={{
                    __html: getDomainIconSvg(d.slug),
                  }}
                />
              </span>
              <span className="w-24 sm:w-28 flex-shrink-0 text-xs sm:text-sm font-medium truncate">
                {d.title}
              </span>
              <div
                className="h-2 flex-1 overflow-hidden rounded-full bg-muted"
                role="presentation"
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: domainColor(d.slug),
                  }}
                />
              </div>
              <span className="w-6 flex-shrink-0 text-right text-xs sm:text-sm tabular-nums text-muted-foreground">
                {d.toolCount}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Distribution donut — pure-SVG donut with hover-with-names popover per slice.
// ────────────────────────────────────────────────────────────────────────────

function DistributionDonut({
  domains,
  totalTools,
  hovered,
  onHover,
}: {
  domains: DomainTooltipData[];
  totalTools: number;
  hovered: string | null;
  onHover: (slug: string | null) => void;
}) {
  const size = 180;
  const stroke = 28;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  // Build segments from non-zero domains. If everything is 0, render an
  // empty donut with a faint ring.
  const segments = domains
    .filter((d) => d.toolCount > 0)
    .map((d) => ({
      slug: d.slug,
      title: d.title,
      value: d.toolCount,
      color: domainColor(d.slug),
      domain: d,
    }));

  let offset = 0;
  const arcs = segments.map((s) => {
    const fraction = totalTools > 0 ? s.value / totalTools : 0;
    const dash = fraction * circumference;
    const arc = {
      ...s,
      dash,
      gap: circumference - dash,
      offset: -offset,
    };
    offset += dash;
    return arc;
  });

  // (The shared popover is rendered at the HomeGraphs wrapper level, not
  // here — so there's exactly one popover for the whole graphs grid.)
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold tracking-tight">Distribution</h2>
        <span className="text-[11px] text-muted-foreground tabular-nums">
          share of {totalTools} · hover a slice
        </span>
      </div>
      <div className="flex flex-1 flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
        <div
          className="relative flex-shrink-0"
          style={{ width: size, height: size }}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            role="img"
            aria-label="Tool entry distribution across domains"
          >
            {/* Faint background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              strokeWidth={stroke}
              className="stroke-muted"
            />
            {/* Segments — each in a <g> so it can capture pointer events */}
            {totalTools > 0 &&
              arcs.map((a) => {
                const isHovered = hovered === a.slug;
                return (
                  <g
                    key={a.slug}
                    onMouseEnter={() => onHover(a.slug)}
                    onMouseLeave={() => onHover(null)}
                    onFocus={() => onHover(a.slug)}
                    onBlur={() => onHover(null)}
                    tabIndex={0}
                    role="button"
                    aria-label={`${a.title}: ${a.value} tools`}
                    style={{ cursor: "pointer", outline: "none" }}
                  >
                    <circle
                      cx={size / 2}
                      cy={size / 2}
                      r={radius}
                      fill="none"
                      stroke={a.color}
                      strokeWidth={isHovered ? stroke + 4 : stroke}
                      strokeDasharray={`${a.dash} ${a.gap}`}
                      strokeDashoffset={a.offset}
                      transform={`rotate(-90 ${size / 2} ${size / 2})`}
                      strokeLinecap="butt"
                      style={{
                        transition: "stroke-width 120ms ease-out",
                        filter: isHovered
                          ? "drop-shadow(0 0 4px rgba(0,0,0,0.18))"
                          : "none",
                      }}
                    >
                      <title>{`${a.title}: ${a.value}`}</title>
                    </circle>
                  </g>
                );
              })}
          </svg>
          {/* Center label */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold tabular-nums">
              {totalTools}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              tools
            </span>
          </div>
        </div>
        {/* Legend — also hoverable. Hovering a legend row surfaces the
            same popover as hovering a slice. */}
        <ul className="w-full flex-1 space-y-1.5">
          {domains.map((d) => {
            const isHovered = hovered === d.slug;
            return (
              <li
                key={d.slug}
                className="group relative flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-0.5 text-xs sm:text-sm transition-colors hover:bg-accent/40"
                onMouseEnter={() => onHover(d.slug)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(d.slug)}
                onBlur={() => onHover(null)}
                tabIndex={0}
                role="button"
                aria-label={`${d.title}: ${d.toolCount} tools`}
              >
                <span
                  className="inline-block h-3 w-3 flex-shrink-0 rounded-full ring-offset-2 ring-offset-background transition-shadow"
                  style={{
                    ...domainSwatchStyle(d.slug),
                    boxShadow: isHovered
                      ? `0 0 0 2px ${domainColor(d.slug)}`
                      : "none",
                  }}
                  aria-hidden="true"
                />
                <span className="flex-1 truncate font-medium">{d.title}</span>
                <span className="tabular-nums text-muted-foreground">
                  {d.toolCount}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* No inline popover here — the single shared popover lives at the
          HomeGraphs wrapper level (top-right of the graphs grid) so it
          appears in exactly one place regardless of which chart/slice/row
          is hovered. */}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Exported wrapper — owns the hover state shared by both charts.
// ────────────────────────────────────────────────────────────────────────────

export function HomeGraphs({
  domains,
  totalTools,
}: {
  domains: DomainTooltipData[];
  totalTools: number;
}) {
  const [hovered, setHovered] = React.useState<string | null>(null);

  // The single shared popover for whichever domain is hovered (bar row OR
  // donut slice/legend). Rendered once, top-right of the graphs grid, so
  // there's never a duplicate popover.
  const activeDomain = hovered
    ? domains.find((d) => d.slug === hovered) ?? null
    : null;

  return (
    <div className="relative mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ToolsPerDomainBar
        domains={domains}
        totalTools={totalTools}
        hovered={hovered}
        onHover={setHovered}
      />
      <DistributionDonut
        domains={domains}
        totalTools={totalTools}
        hovered={hovered}
        onHover={setHovered}
      />

      {/* Single shared hover popover — top-right of the graphs grid.
          Appears for whichever domain is hovered (bar OR donut). */}
      {activeDomain && (
        <div
          role="tooltip"
          id={`graph-tip-${activeDomain.slug}`}
          className="pointer-events-none absolute right-3 top-3 z-30 w-72 max-w-[calc(100%-1.5rem)] rounded-lg border border-border bg-popover p-3 shadow-lg sm:right-4 sm:top-4"
        >
          <DomainTooltipContent domain={activeDomain} />
        </div>
      )}
    </div>
  );
}
