---
name: React Bits
slug: reactbits
type: library
tags: [react, components, animation, tailwind, ui, backgrounds, text-effects, shadcn-registry]
license: MIT + Commons Clause
url: https://reactbits.dev
repo: https://github.com/DavidHDev/react-bits
author: David Haz
added: 2025-01-15
updated: 2025-01-15
---

## What it is

**React Bits** is an open-source collection of 130+ animated, interactive, fully
customizable React components for building memorable websites. It is hosted at
[reactbits.dev](https://reactbits.dev) with source on
[GitHub (DavidHDev/react-bits)](https://github.com/DavidHDev/react-bits), and is one of
the fastest-growing React component libraries on GitHub (~43k+ stars).

It is **not** a full app framework or a design system with tokens/spacing scales. It is a
**component grab-bag** — you browse, pick a component, copy the code in your preferred stack
flavor, and drop it in. Think of it as a curated, animated counterpart to a headless UI
library: the value is the visuals and the motion, not the structural primitives.

## Best for

- Landing pages, marketing sites, and hero sections that need to *feel* premium and alive.
- Projects already using React + Tailwind (or plain CSS) where you want instant animated
  backgrounds, text effects, and UI patterns without hand-rolling the motion.
- Developers using AI coding tools (Cursor, Copilot, v0) — components are described in plain
  text and drop in cleanly.

## Not for

- Apps that need a complete, opinionated component system (buttons, forms, dialogs, data
  tables) — React Bits focuses on *animated & decorative* components, not the full
  structural set. Pair it with shadcn/ui or Radix for those.
- Teams that need a permissive license for resale — see the license note below.

## Quick facts

- **Components:** 130+, organized into 4 categories — Backgrounds, Text Effects, Components
  (UI patterns), and Animations.
- **Stack flavors:** every component ships in **four** variants — JS + Tailwind, TS + Tailwind,
  JS + CSS, TS + CSS. Pick the one matching your project.
- **Visual editors:** 3 free in-browser tools to tweak a component and copy the result.
- **AI-ready:** components work cleanly with Cursor, Copilot, and v0 — describe what you need,
  drop in the code, ship.
- **shadcn registry:** compatible with the shadcn/ui registry workflow (endorsed by shadcn).
- **Representative components:** Dot Field, Line Waves, Blob Cursor, Aurora, Splash Cursor,
  Beams, Metallic Paint, Ribbons, Shape Grid, Radar, Pixel Trail, Magic Rings, and many more.
- **License:** MIT + Commons Clause v1.0 — open source, **but** you may not sell the library
  itself as a product. Fine for building apps; not fine for re-packaging React Bits as a paid
  library. Verify against your use case.
- **Primary language:** JavaScript (TypeScript variants provided).
- **Author:** David Haz (DavidHDev).

## How it works

Browse the catalog at reactbits.dev, open any component, and the page shows a live preview
plus the source in your chosen flavor (JS/TS × Tailwind/CSS). Copy the code, paste it into
your project, and import. Most components are self-contained (no heavy runtime dependency),
though some use Framer Motion / GSAP / Three.js — the dependency is noted per component. The
site also offers three "visual editors" that let you tweak parameters in-browser and copy the
configured result.

## Brief tutorial (drop-in)

1. Go to [reactbits.dev](https://reactbits.dev) and browse the four categories.
2. Pick a component (e.g. `Aurora` under Backgrounds).
3. Choose your stack flavor (TS + Tailwind is the common default).
4. Copy the component file into your project (e.g. `src/components/Aurora.tsx`).
5. Install any per-component dependency the page notes (Framer Motion, etc.).
6. Import and render: `import { Aurora } from '@/components/Aurora'`.

That's it — no package install for the library itself; you own the code.

## Where to learn more

- **Official site:** [reactbits.dev](https://reactbits.dev) — the live catalog + visual editors.
- **GitHub:** [DavidHDev/react-bits](https://github.com/DavidHDev/react-bits) — source, issues, license.

## Back

← [`./navigation.md`](./navigation.md) (component-libraries)
