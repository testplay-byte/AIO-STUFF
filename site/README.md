# site/

The **published atlas website** — a Next.js static export that renders the `domains/` tree
as a beautiful, visual, easy-to-navigate site for human users. Deployed to GitHub Pages via
[`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml).

> Status: **planned**. Scaffolded alongside the first content. The build dashboard (the
> maintainer's command-center) is a separate app and is NOT this folder.

## Planned config

- `next.config.ts` with `output: 'export'`, `basePath: '/AIO-STUFF'`,
  `images: { unoptimized: true }`.
- Reads the `domains/` tree at build time to render the navigation + tool pages.
- Warm-tinted neutral palette (off-black dark, coffee-cream light), bigger/bolder headings,
  responsive, accessible. See [`../memory/03-ui-design-language.md`](../memory/03-ui-design-language.md).

## Build locally

```bash
cd site
bun install
bun run build   # outputs ./out
```
