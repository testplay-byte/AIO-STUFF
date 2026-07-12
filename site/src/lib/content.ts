// Build-time content reader for the AIO-STUFF published site.
//
// Walks the sibling `../domains/` tree from the site root at build time,
// parses navigation.md files and tool .md entries (YAML front-matter +
// markdown body), and exposes a typed API the App Router pages can call
// inside `generateStaticParams` and the page body.
//
// This module is build-time-only — it uses Node `fs` and is never shipped
// to the browser. Every page that imports it is a server component that
// gets pre-rendered by `next build` (output: 'export').

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

export type Tool = {
  slug: string;
  name: string;
  type: string;
  tags: string[];
  license: string;
  url: string;
  repo: string;
  author: string;
  aiCompatibility: number; // 1-5 rating (0 = not set)
  iconSvg: string; // raw SVG content (empty if no icon)
  added: string; // ISO date string
  updated: string; // ISO date string
  bodyMarkdown: string;
  oneLiner: string; // first paragraph of the body, for cards
};

export type Subdomain = {
  slug: string;
  title: string;
  description: string; // pulled from the navigation.md blockquote
  navigationMarkdown: string; // body of navigation.md (front-matter stripped)
  tools: Tool[];
};

export type Domain = {
  slug: string;
  title: string;
  description: string; // pulled from the navigation.md blockquote
  navigationMarkdown: string;
  subdomains: Subdomain[];
};

export type SiteMap = {
  domains: Domain[];
};

// ────────────────────────────────────────────────────────────────────────────
// Path resolution
// ────────────────────────────────────────────────────────────────────────────

// From the site root (process.cwd() === .../aio-repo/site), the content tree
// lives one level up at .../aio-repo/domains/.
function domainsDir(): string {
  return path.join(process.cwd(), "..", "domains");
}

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

/** "ai-tools" -> "AI Tools", "component-libraries" -> "Component Libraries" */
function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w.length > 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
}

/**
 * Display titles for the well-known domains/subdomains where the
 * naive titleCase would get acronyms wrong (e.g. "AI" not "Ai").
 * Falls back to titleCase for anything not in the map.
 */
const DISPLAY_TITLES: Record<string, string> = {
  "ai-tools": "AI Tools",
  "dev-tools": "Dev Tools",
  design: "Design",
  productivity: "Productivity",
  "component-libraries": "Component Libraries",
};

function displayTitle(slug: string): string {
  return DISPLAY_TITLES[slug] ?? titleCase(slug);
}

/**
 * Pull the first blockquote out of a navigation.md body and use it as the
 * one-line description. The navigation.md files all start with:
 *   # <Title> — navigation
 *   > You are in: `...`. This folder covers ...
 *
 * Inline markdown markers (`**`, `*`, `` ` ``, `[text](url)`) are stripped
 * because the description is rendered as plain text in cards/headers —
 * otherwise the user sees literal `**` characters on the page.
 */
function extractDescription(markdown: string): string {
  const lines = markdown.split("\n");
  const quoteLines: string[] = [];
  let inQuote = false;
  for (const raw of lines) {
    const line = raw;
    if (line.startsWith(">")) {
      inQuote = true;
      quoteLines.push(line.replace(/^>\s?/, ""));
    } else if (inQuote) {
      // End of the blockquote block.
      if (line.trim() === "") {
        // Allow blank lines inside the quote? No — the navigation.md files
        // keep the quote as a single contiguous block.
        break;
      }
      break;
    }
  }
  const text = quoteLines.join(" ").replace(/\s+/g, " ").trim();
  return stripInlineMarkdown(text);
}

/**
 * Strip inline markdown markers from a plain-text string. Used wherever we
 * display extracted markdown content as plain text (card descriptions,
 * one-liners, metadata). Removes `**bold**`, `*italic*`, `` `code` ``, and
 * `[text](url)` → `text`. Block-level constructs (headings, tables, lists)
 * are not handled here — callers handle those structurally.
 */
function stripInlineMarkdown(text: string): string {
  return (
    text
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, "$1$2")
      .replace(/__([^_]+)__/g, "$1")
      .replace(/(^|[^_])_([^_]+)_(?!_)/g, "$1$2")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Extract the first non-heading, non-quote paragraph from a tool body to
 * use as a one-liner on cards. Falls back to "—" if nothing usable.
 */
function extractOneLiner(bodyMarkdown: string): string {
  const lines = bodyMarkdown.split("\n");
  const out: string[] = [];
  let collecting = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      if (collecting && out.length > 0) break;
      continue;
    }
    if (line.startsWith("#")) {
      // skip headings
      if (collecting) break;
      continue;
    }
    if (line.startsWith(">")) continue; // skip blockquotes
    if (line.startsWith("|")) {
      // stop at tables
      if (collecting) break;
      continue;
    }
    if (line.startsWith("-") || line.startsWith("*")) {
      // stop at lists
      if (collecting) break;
      continue;
    }
    collecting = true;
    out.push(line);
    if (out.length >= 2) break;
  }
  const text = out.join(" ").replace(/\s+/g, " ").trim();
  // Strip leading markdown bold/italic markers and links for the card text.
  return stripInlineMarkdown(text).slice(0, 280) || "—";
}

function safeString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function safeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => safeString(v)).filter(Boolean);
  }
  if (typeof value === "string") {
    // Allow "a, b, c" style.
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function safeDate(value: unknown): string {
  if (!value) return "";
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10); // YYYY-MM-DD
  }
  if (typeof value === "string") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      return d.toISOString().slice(0, 10);
    }
    return value;
  }
  return String(value);
}

// ────────────────────────────────────────────────────────────────────────────
// Readers
// ────────────────────────────────────────────────────────────────────────────

function readNavigation(dir: string): { markdown: string; description: string } {
  const navPath = path.join(dir, "navigation.md");
  if (!fs.existsSync(navPath)) {
    return { markdown: "", description: "" };
  }
  const raw = fs.readFileSync(navPath, "utf-8");
  const parsed = matter(raw);
  const markdown = parsed.content.trim();
  const description = extractDescription(markdown);
  return { markdown, description };
}

function readTool(filePath: string, slug: string): Tool {
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = matter(raw);
  const data = parsed.data || {};
  const bodyMarkdown = parsed.content.trim();
  const oneLiner = extractOneLiner(bodyMarkdown);

  // ai_compatibility: 1-5 rating (0 = not set / not yet rated)
  const aiRaw = data.ai_compatibility ?? data.aiCompatibility ?? 0;
  const aiCompatibility =
    typeof aiRaw === "number"
      ? Math.max(0, Math.min(5, aiRaw))
      : Math.max(0, Math.min(5, parseInt(String(aiRaw), 10) || 0));

  // icon: read the SVG/PNG file from the repo root (../ from the site dir).
  // For SVGs: strip width/height attributes so the SVG scales to its
  // container. For PNGs: wrap in an <img> tag with the path.
  let iconSvg = "";
  const iconPath = safeString(data.icon);
  if (iconPath) {
    const fullPath = path.join(process.cwd(), "..", iconPath);
    if (fs.existsSync(fullPath)) {
      if (iconPath.endsWith(".svg")) {
        const raw = fs.readFileSync(fullPath, "utf-8");
        // Strip width="..." and height="..." attributes so the SVG fills
        // its container (the container sets the size via CSS).
        iconSvg = raw
          .replace(/\swidth="[^"]*"/, "")
          .replace(/\sheight="[^"]*"/, "")
          .replace(/<svg /, '<svg width="100%" height="100%" ');
      } else if (iconPath.endsWith(".png")) {
        // For PNGs, reference the file from the site's public/icons/ folder.
        // The PNG is copied there from assets/icons/ at build time.
        // Using a relative path so Next.js basePath is applied automatically.
        const iconName = path.basename(iconPath);
        iconSvg = `<img src="icons/${iconName}" alt="${safeString(data.name)} icon" style="width:100%;height:100%;object-fit:cover" />`;
      }
    }
  }

  return {
    slug,
    name: safeString(data.name, displayTitle(slug)),
    type: safeString(data.type, "tool"),
    tags: safeStringArray(data.tags),
    license: safeString(data.license),
    url: safeString(data.url),
    repo: safeString(data.repo),
    author: safeString(data.author),
    aiCompatibility,
    iconSvg,
    added: safeDate(data.added),
    updated: safeDate(data.updated),
    bodyMarkdown,
    oneLiner,
  };
}

function readSubdomain(domainSlug: string, subSlug: string): Subdomain {
  const subDir = path.join(domainsDir(), domainSlug, subSlug);
  const { markdown, description } = readNavigation(subDir);

  // List tool .md files (everything except navigation.md).
  const entries = fs.readdirSync(subDir, { withFileTypes: true });
  const tools: Tool[] = [];
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith(".md")) continue;
    if (entry.name === "navigation.md") continue;
    const slug = entry.name.replace(/\.md$/, "");
    tools.push(readTool(path.join(subDir, entry.name), slug));
  }
  // Sort alphabetically by name (stable across builds).
  tools.sort((a, b) => a.name.localeCompare(b.name));

  return {
    slug: subSlug,
    title: displayTitle(subSlug),
    description,
    navigationMarkdown: markdown,
    tools,
  };
}

function readDomain(domainSlug: string): Domain {
  const domDir = path.join(domainsDir(), domainSlug);
  const { markdown, description } = readNavigation(domDir);

  const entries = fs.readdirSync(domDir, { withFileTypes: true });
  const subdomains: Subdomain[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    // A subdomain is any subfolder that contains a navigation.md.
    const subNav = path.join(domDir, entry.name, "navigation.md");
    if (!fs.existsSync(subNav)) continue;
    subdomains.push(readSubdomain(domainSlug, entry.name));
  }
  subdomains.sort((a, b) => a.slug.localeCompare(b.slug));

  return {
    slug: domainSlug,
    title: displayTitle(domainSlug),
    description,
    navigationMarkdown: markdown,
    subdomains,
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Public API (memoized — called many times during build)
// ────────────────────────────────────────────────────────────────────────────

let _cache: SiteMap | null = null;

export function getSiteMap(): SiteMap {
  if (_cache) return _cache;

  const root = domainsDir();
  if (!fs.existsSync(root)) {
    _cache = { domains: [] };
    return _cache;
  }

  const entries = fs.readdirSync(root, { withFileTypes: true });
  const domains: Domain[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    // Skip hidden folders (.git, etc).
    if (entry.name.startsWith(".")) continue;
    domains.push(readDomain(entry.name));
  }
  domains.sort((a, b) => a.slug.localeCompare(b.slug));

  _cache = { domains };
  return _cache;
}

export function getDomain(slug: string): Domain | undefined {
  return getSiteMap().domains.find((d) => d.slug === slug);
}

export function getSubdomain(
  domainSlug: string,
  subSlug: string,
): Subdomain | undefined {
  return getDomain(domainSlug)?.subdomains.find((s) => s.slug === subSlug);
}

export function getTool(
  domainSlug: string,
  subSlug: string,
  toolSlug: string,
): Tool | undefined {
  return getSubdomain(domainSlug, subSlug)?.tools.find(
    (t) => t.slug === toolSlug,
  );
}

/**
 * Flat list of every tool entry across the whole tree, each annotated with
 * its domain + subdomain breadcrumb. Used by the home page's tool-entries
 * browser (the main content). Tools are returned in domain-then-subdomain
 * order (matching the tree) so the default view reads top-to-bottom in a
 * stable, predictable order.
 */
export type FlatTool = {
  slug: string;
  name: string;
  type: string;
  tags: string[];
  license: string;
  url: string;
  repo: string;
  author: string;
  added: string;
  updated: string;
  oneLiner: string;
  domainSlug: string;
  domainTitle: string;
  subdomainSlug: string;
  subdomainTitle: string;
  href: string; // absolute site route, e.g. "/design/component-libraries/reactbits"
};

export function getAllTools(): FlatTool[] {
  const out: FlatTool[] = [];
  for (const d of getSiteMap().domains) {
    for (const s of d.subdomains) {
      for (const t of s.tools) {
        out.push({
          slug: t.slug,
          name: t.name,
          type: t.type,
          tags: t.tags,
          license: t.license,
          url: t.url,
          repo: t.repo,
          author: t.author,
          added: t.added,
          updated: t.updated,
          oneLiner: t.oneLiner,
          domainSlug: d.slug,
          domainTitle: d.title,
          subdomainSlug: s.slug,
          subdomainTitle: s.title,
          href: `/${d.slug}/${s.slug}/${t.slug}`,
        });
      }
    }
  }
  return out;
}

// ────────────────────────────────────────────────────────────────────────────
// AI-guidance stripping
// ────────────────────────────────────────────────────────────────────────────

/**
 * Headings whose section content is meant for the AI agent reading the
 * navigation.md file in the repo, NOT for end users browsing the published
 * site. These sections are stripped before rendering on the site.
 */
const AI_GUIDANCE_HEADINGS = [
  "Where to go next",
  "Back",
  "Last updated",
  "Sibling pointer",
  // "What's here" tables list subdomains/tools with relative .md links that
  // don't resolve correctly on the published site (the link rewriter doesn't
  // know the source page's route). Since domain pages now list tools directly,
  // these tables are redundant for users — strip them.
  "What's here",
];

/**
 * Strip AI-guidance sections from a navigation.md body before rendering on
 * the published site. Removes everything from a `## <heading>` line through
 * to (but not including) the next `## ` heading or end-of-document, for any
 * heading in {@link AI_GUIDANCE_HEADINGS} (case-insensitive on the heading
 * text). Also collapses the resulting blank-line gap so the page doesn't
 * show a trailing wall of whitespace.
 *
 * The navigation.md files KEEP these sections in the repo — they're for the
 * AI (see memory/01, memory/09). This helper only affects what the site
 * renders, not the source files.
 *
 * Preserved on the site:
 *   - The leading `> You are in: ...` blockquote (used as the description).
 *   - The `## What's here` table — genuinely useful to the user.
 *   - Any other `## ` section not in the AI-guidance list.
 */
export function stripAiGuidance(markdown: string): string {
  if (!markdown) return "";
  const lines = markdown.split("\n");
  const out: string[] = [];
  let skipping = false;
  for (const line of lines) {
    // Match a level-2 heading line: `## <text>` (allow 2+ `#` chars for h2).
    const h2 = line.match(/^##\s+(.+?)\s*$/);
    if (h2) {
      const headingText = h2[1].trim();
      const isAi = AI_GUIDANCE_HEADINGS.some((g) =>
        headingText.toLowerCase().includes(g.toLowerCase()),
      );
      skipping = isAi;
      if (!isAi) {
        out.push(line);
      }
      continue;
    }
    if (!skipping) {
      out.push(line);
    }
  }
  // Collapse 3+ consecutive blank lines into 2 for tidiness, then trim.
  return out
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
