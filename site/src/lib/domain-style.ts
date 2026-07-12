// Stable per-domain accent color assignment. Used consistently across
// the home page graphs, the /explore page, and the /blueprint view
// switcher so each domain reads as the same color everywhere.
//
// The CSS variables --chart-1..--chart-5 are defined in globals.css and
// re-tinted for dark mode, so referencing them via `var(--chart-N)` works
// in both light and dark mode for inline styles / SVG fill.
//
// Assignment (per the user spec):
//   ai-tools     -> chart-1 (warm orange-red)
//   dev-tools    -> chart-2 (green)
//   design       -> chart-4 (warm yellow)
//   productivity -> chart-5 (red)
//   fallback     -> chart-3 (blue)
//
// We deliberately return raw CSS values (var(--chart-N)) and React
// CSSProperties objects rather than Tailwind class names, because the
// Tailwind 4 JIT cannot reliably detect dynamically-constructed class
// names like `bg-chart-${n}` at build time. Inline styles always work.

import * as React from "react";

const DOMAIN_CHART_N: Record<string, number> = {
  "ai-tools": 1,
  "dev-tools": 2,
  design: 4,
  productivity: 5,
};

export function domainChartN(slug: string): number {
  return DOMAIN_CHART_N[slug] ?? 3;
}

/** Raw CSS color value usable in inline styles and SVG fill/stroke. */
export function domainColor(slug: string): string {
  return `var(--chart-${domainChartN(slug)})`;
}

/**
 * Inline style for a colored dot / swatch — sets `backgroundColor` to the
 * domain's accent color. Spread onto a <span> or <div>.
 */
export function domainSwatchStyle(slug: string): React.CSSProperties {
  return { backgroundColor: domainColor(slug) };
}

/**
 * Inline style for colored text — sets `color` to the domain's accent.
 */
export function domainTextStyle(slug: string): React.CSSProperties {
  return { color: domainColor(slug) };
}

/**
 * Inline style for a colored border — sets `borderColor` to the accent.
 * Use together with a Tailwind border-width class like `border-2`.
 */
export function domainBorderStyle(slug: string): React.CSSProperties {
  return { borderColor: domainColor(slug) };
}
