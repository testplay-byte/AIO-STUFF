// Domain + subdomain SVG icons.
// All are simple, minimalistic, one-color (currentColor) line-art.
// Stored in the repo at assets/icons/domains/ + assets/icons/subdomains/.
// Embedded here as raw SVG strings for build-time rendering (no file I/O needed).

const SVG_ATTRS = 'width="100%" height="100%" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg"';

// ── Domain icons (6) ─────────────────────────────────────────────
const DOMAIN_SVGS: Record<string, string> = {
  "ai-tools": `<svg ${SVG_ATTRS}><path d="M64 20 L72 52 L104 60 L72 68 L64 100 L56 68 L24 60 L56 52 Z" stroke="currentColor" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/><circle cx="104" cy="28" r="4" fill="currentColor"/><circle cx="28" cy="100" r="3" fill="currentColor"/></svg>`,
  "dev-tools": `<svg ${SVG_ATTRS}><path d="M48 36 L24 64 L48 92" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M80 36 L104 64 L80 92" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M72 28 L56 100" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>`,
  "design": `<svg ${SVG_ATTRS}><path d="M64 20 L96 88 L64 108 L32 88 Z" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/><path d="M64 20 L64 88" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><circle cx="64" cy="72" r="5" stroke="currentColor" stroke-width="4" fill="none"/></svg>`,
  "security": `<svg ${SVG_ATTRS}><path d="M64 20 L100 32 L100 60 C100 84 84 100 64 108 C44 100 28 84 28 60 L28 32 Z" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/><path d="M50 64 L60 74 L80 52" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "finance": `<svg ${SVG_ATTRS}><path d="M24 96 L24 28" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M24 96 L104 96" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M36 80 L56 60 L72 72 L96 40" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M84 40 L96 40 L96 52" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "productivity": `<svg ${SVG_ATTRS}><rect x="28" y="24" width="72" height="80" rx="8" stroke="currentColor" stroke-width="5" fill="none"/><path d="M44 52 L52 60 L68 44" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M44 80 L52 88 L68 72" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M80 52 L92 52" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M80 80 L92 80" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>`,
};

// ── Subdomain icons (14) ────────────────────────────────────────
const SUBDOMAIN_SVGS: Record<string, string> = {
  "llm": `<svg ${SVG_ATTRS}><path d="M28 36 C28 30 34 24 40 24 L88 24 C94 24 100 30 100 36 L100 68 C100 74 94 80 88 80 L56 80 L40 96 L40 80 C34 80 28 74 28 68 Z" stroke="currentColor" stroke-width="5" stroke-linejoin="round" fill="none"/><circle cx="48" cy="52" r="3" fill="currentColor"/><circle cx="64" cy="52" r="3" fill="currentColor"/><circle cx="80" cy="52" r="3" fill="currentColor"/></svg>`,
  "speech": `<svg ${SVG_ATTRS}><path d="M40 56 L40 72" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><path d="M56 40 L56 88" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><path d="M72 48 L72 80" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><path d="M88 56 L88 72" stroke="currentColor" stroke-width="6" stroke-linecap="round"/></svg>`,
  "agent-skills": `<svg ${SVG_ATTRS}><path d="M44 28 L44 44 C44 48 40 50 36 50 C32 50 28 52 28 56 C28 60 32 62 36 62 C40 62 44 64 44 68 L44 84 L60 84 C64 84 66 80 66 76 C66 72 68 68 72 68 C76 68 78 72 78 76 C78 80 80 84 84 84 L100 84 L100 68 C100 64 96 62 92 62 C88 62 84 60 84 56 C84 52 88 50 92 50 C96 50 100 48 100 44 L100 28 Z" stroke="currentColor" stroke-width="5" stroke-linejoin="round" fill="none"/></svg>`,
  "app-builders": `<svg ${SVG_ATTRS}><rect x="24" y="28" width="80" height="72" rx="8" stroke="currentColor" stroke-width="5" fill="none"/><path d="M24 44 L104 44" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><circle cx="34" cy="36" r="2.5" fill="currentColor"/><circle cx="44" cy="36" r="2.5" fill="currentColor"/><path d="M64 60 L64 76 M56 68 L72 68" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>`,
  "studios": `<svg ${SVG_ATTRS}><rect x="36" y="48" width="56" height="56" rx="4" stroke="currentColor" stroke-width="5" fill="none"/><path d="M28 48 L64 24 L100 48" stroke="currentColor" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/><rect x="52" y="68" width="24" height="36" stroke="currentColor" stroke-width="4" fill="none"/></svg>`,
  "build": `<svg ${SVG_ATTRS}><path d="M88 28 C76 28 66 38 66 50 C66 54 67 58 69 61 L40 90 C36 94 36 100 40 104 C44 108 50 108 54 104 L83 75 C86 77 90 78 94 78 C106 78 116 68 116 56 C116 52 115 48 113 45 L98 60 L86 48 L101 33 C97 30 93 28 88 28 Z" stroke="currentColor" stroke-width="5" stroke-linejoin="round" fill="none"/></svg>`,
  "resources": `<svg ${SVG_ATTRS}><path d="M28 32 C28 28 32 24 36 24 L60 24 L60 104 L36 104 C32 104 28 100 28 96 Z" stroke="currentColor" stroke-width="5" stroke-linejoin="round" fill="none"/><path d="M68 24 L92 24 C96 24 100 28 100 32 L100 96 C100 100 96 104 92 104 L68 104 Z" stroke="currentColor" stroke-width="5" stroke-linejoin="round" fill="none"/><path d="M76 44 L92 44 M76 56 L92 56 M76 68 L92 68" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>`,
  "learning": `<svg ${SVG_ATTRS}><path d="M64 28 L112 48 L64 68 L16 48 Z" stroke="currentColor" stroke-width="5" stroke-linejoin="round" fill="none"/><path d="M40 58 L40 80 C40 86 50 92 64 92 C78 92 88 86 88 80 L88 58" stroke="currentColor" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" fill="none"/><path d="M112 48 L112 72" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>`,
  "component-libraries": `<svg ${SVG_ATTRS}><rect x="28" y="28" width="28" height="28" rx="4" stroke="currentColor" stroke-width="5" fill="none"/><rect x="72" y="28" width="28" height="28" rx="4" stroke="currentColor" stroke-width="5" fill="none"/><rect x="28" y="72" width="28" height="28" rx="4" stroke="currentColor" stroke-width="5" fill="none"/><rect x="72" y="72" width="28" height="28" rx="4" stroke="currentColor" stroke-width="5" fill="none"/></svg>`,
  "prototyping": `<svg ${SVG_ATTRS}><path d="M36 92 L92 36 L104 48 L48 104 Z" stroke="currentColor" stroke-width="5" stroke-linejoin="round" fill="none"/><path d="M80 48 L88 56" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M28 100 L36 108" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>`,
  "ai-design": `<svg ${SVG_ATTRS}><path d="M40 88 L80 48" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><path d="M88 28 L92 40 L104 44 L92 48 L88 60 L84 48 L72 44 L84 40 Z" stroke="currentColor" stroke-width="4" stroke-linejoin="round" fill="none"/><circle cx="36" cy="92" r="6" stroke="currentColor" stroke-width="5" fill="none"/></svg>`,
  "scanners": `<svg ${SVG_ATTRS}><circle cx="64" cy="64" r="40" stroke="currentColor" stroke-width="5" fill="none"/><circle cx="64" cy="64" r="24" stroke="currentColor" stroke-width="4" stroke-opacity="0.5" fill="none"/><path d="M64 64 L64 24" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M64 64 L92 36" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><circle cx="80" cy="44" r="4" fill="currentColor"/></svg>`,
  "recon": `<svg ${SVG_ATTRS}><circle cx="52" cy="52" r="28" stroke="currentColor" stroke-width="5" fill="none"/><path d="M72 72 L100 100" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><path d="M40 52 L64 52" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M52 40 L52 64" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>`,
  "trading": `<svg ${SVG_ATTRS}><path d="M36 36 L36 52 M36 76 L36 92" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><rect x="28" y="52" width="16" height="24" rx="2" stroke="currentColor" stroke-width="4" fill="none"/><path d="M68 28 L68 44 M68 68 L68 84" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><rect x="60" y="44" width="16" height="24" rx="2" stroke="currentColor" stroke-width="4" fill="none"/><path d="M100 44 L100 60 M100 80 L100 96" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><rect x="92" y="60" width="16" height="20" rx="2" stroke="currentColor" stroke-width="4" fill="none"/></svg>`,
};

// ── Public helpers ───────────────────────────────────────────────

export function getDomainIconSvg(slug: string): string {
  return DOMAIN_SVGS[slug] ?? DOMAIN_SVGS["ai-tools"]; // fallback
}

export function getSubdomainIconSvg(slug: string): string {
  return SUBDOMAIN_SVGS[slug] ?? ""; // empty if not found
}

export function hasSubdomainIcon(slug: string): boolean {
  return slug in SUBDOMAIN_SVGS;
}
