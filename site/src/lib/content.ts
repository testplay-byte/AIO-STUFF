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
  return text;
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
  return (
    text
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .slice(0, 280) || "—"
  );
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

  return {
    slug,
    name: safeString(data.name, displayTitle(slug)),
    type: safeString(data.type, "tool"),
    tags: safeStringArray(data.tags),
    license: safeString(data.license),
    url: safeString(data.url),
    repo: safeString(data.repo),
    author: safeString(data.author),
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
