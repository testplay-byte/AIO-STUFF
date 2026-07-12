# 03 — UI Design Language

> The visual system for BOTH the live preview dashboard AND the published atlas site.
> Derived from analyzing the reference site (the ANI-KUTA analysis dashboard).

## Design philosophy

**Calm, dense, legible, credible.** The reference site reads like a professional engineering
report — not a marketing page, not an AI demo. We match that register.

Anti-goals (the "AI slop" tell-tales we avoid):
- ❌ Gradient hero blobs, glassmorphism overload, neon glows on everything.
- ❌ Centered everything, huge empty hero with one button.
- ❌ Emoji-as-icons, inconsistent radii, rainbow category colors.
- ❌ Generic "Lorem-quality" copy that says nothing specific.

## Foundation (already wired via shadcn/ui New York)

- **Framework stack:** Next.js 16 + Tailwind v4 + shadcn/ui (New York) + lucide-react.
- **Radius:** `--radius: 0.625rem` (already set). Cards/inputs use `rounded-lg`.
- **Type:** Geist Sans (body) + Geist Mono (code/labels).
- **Headings — REVISED per user feedback (bigger, bolder):** project title `text-xl`/`text-2xl`
  `font-bold`; card titles `text-lg` `font-semibold`; section headers `text-base`
  `font-semibold`; stat numbers `text-2xl`/`text-3xl` `font-bold` tabular-nums. Body stays
  `text-sm`. Pair bigger text with generous whitespace (gap-5/gap-6) — "modern, simpler UI"
  means clear hierarchy, not clutter.
- **Color mode:** light default, dark available. Wired via `next-themes`.

## Color usage rules

We use a **warm-tinted neutral palette** for structure (foreground/background/border) and
reserve **semantic chart colors** for data. No indigo/blue as a brand color (per project
rules) unless you explicitly ask.

**Background colors — REVISED per user feedback (no pure black, no pure white):**
- **Light mode background:** warm coffee-cream off-white — `oklch(0.965 0.014 75)`. Not pure
  white, not too brown — a subtle latte-foam tint. Cards lift slightly lighter.
- **Dark mode background:** off-black with a faint warm tint — `oklch(0.17 0.005 70)`. NOT
  pure black. Cards/popovers lift to a dark gray.
- All layered tokens (card, muted, secondary, accent, border, popover) are adjusted so the
  warm undertone is consistent and nothing looks "ugly" or mismatched against the tinted bg.
- Foreground is a warm near-black in light mode and a warm off-white in dark mode (never
  pure `#000` / `#fff`).

| Role              | Token                  | Used for                        |
|-------------------|------------------------|---------------------------------|
| Structure         | `bg-background` / `text-foreground` | page chrome           |
| Surface           | `bg-card`              | cards, panels                   |
| Muted surface     | `bg-muted`             | tab lists, inline chips         |
| Border            | `border-border`        | all dividers                    |
| Primary action    | `bg-primary`           | active tab, primary buttons     |
| Success / done    | `chart-2` (emerald)    | "fixed", completed phases       |
| Warning / partial | `chart-4` (amber)      | "partial", in-progress          |
| Danger / blocked  | `destructive`          | errors, blocked items           |
| Neutral data      | `chart-3` (slate)      | deferred / informational        |
| Accent data A/B   | `chart-1`, `chart-5`   | distribution slices             |

## Layout patterns (lifted from the reference, adapted)

1. **Header banner** — sticky, `border-b`, contains: project title + phase tag on the left,
   theme toggle + a status badge on the right. No giant hero.
2. **Executive summary card** — full-width `Card` with a 4-up stat grid
   (`grid-cols-2 md:grid-cols-4`) of stat tiles. Each tile has a distinct icon, a bold
   large number, a hint line, and a micro-progress bar with a mono progress label. The
   headline status is a **restrained left-accent banner** (border-l-4 + icon), NOT a heavy
   full-fill alert.
3. **Tabbed body** — `Tabs` with `text-xs` labels + a leading lucide icon per tab. Tabs:
   Understanding · Roadmap · Structure · Progress · Memory · Design.
4. **Section anchors** — inside a tab, each block is a `<section className="scroll-mt-20">`
   with a `flex items-center gap-3` header (icon + title + optional badge).
5. **Scorecard** — `Table` with status pills (`Badge` variants) per row.
6. **Charts** — `recharts`: radar for "capability/coverage" dimensions, donut for
   distribution. Use chart tokens, not raw hex. Keep grids faint.
7. **Code/tree blocks** — `rounded-lg border bg-muted/40 p-4 font-mono text-xs` with a
   monospace tree. No heavy syntax highlighter for trees; reserve highlight for real code.
8. **Sticky footer** — root wrapper is `min-h-screen flex flex-col`; footer gets `mt-auto`.

## Component selection (prefer existing shadcn)

Use what's already in `src/components/ui`: `Card`, `Tabs`, `Table`, `Badge`, `Alert`,
`Progress`, `Separator`, `ScrollArea`, `Tooltip`, `Button`, `Sonner` toasts. Do NOT rebuild
these. Only compose.

## Motion

Subtle only. `framer-motion` for: tab content fade/slide on change (`opacity` + `y: 8`,
200ms `ease-out`), and list item stagger. No bounce, no parallax, no auto-playing carousels.

## Responsiveness

- Mobile-first. Stat grids collapse `md:grid-cols-4 → grid-cols-2`.
- Tab list scrolls horizontally on mobile (it already does via shadcn).
- Tree/code blocks get `overflow-x-auto`.
- Touch targets ≥ 44px. Footer respects safe-area insets.

## Accessibility (non-negotiable)

- Semantic landmarks: `header`, `main`, `nav`, `footer`.
- All icons-in-buttons get `sr-only` labels or `aria-label`.
- Color is never the only signal — pair every color state with an icon or text.
- `prefers-reduced-motion` disables the framer-motion transitions.

## The "would a human designer ship this?" test

Before declaring any screen done, ask: does this look like a polished internal tool from a
real product team, or does it look generated? If the latter, cut decoration, tighten copy,
align edges, and re-check the spacing scale (`gap-4` / `gap-6`, `p-4` / `p-6` only).
