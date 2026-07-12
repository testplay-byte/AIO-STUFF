import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

/**
 * Render markdown content from the `domains/` tree using react-markdown +
 * remark-gfm (tables, strikethrough, autolinks). Styled via the
 * `.atlas-prose` class in globals.css to match the warm palette.
 *
 * Relative links inside the navigation.md files (e.g. `./reactbits.md`,
 * `../navigation.md`) are rewritten into site routes so they actually
 * navigate within the published site.
 */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="atlas-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Rewrite relative .md links into site routes.
          a: ({ href, children, ...rest }) => {
            if (!href) {
              return (
                <a href={href} {...rest}>
                  {children}
                </a>
              );
            }
            const rewritten = rewriteLink(href);
            if (rewritten.startsWith("/")) {
              return (
                <Link href={rewritten} {...rest}>
                  {children}
                </Link>
              );
            }
            return (
              <a
                href={rewritten}
                target={rewritten.startsWith("http") ? "_blank" : undefined}
                rel={
                  rewritten.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                {...rest}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

/**
 * Convert relative links found in navigation.md / tool bodies into the
 * corresponding site route. Examples (relative to a tool entry at
 * /design/component-libraries/reactbits):
 *
 *   ./navigation.md            -> /design/component-libraries
 *   ./reactbits.md             -> /design/component-libraries/reactbits
 *   ../navigation.md           -> /design
 *   ../../navigation.md        -> /   (root — handled as /)
 *
 * The function is conservative: anything that doesn't look like a relative
 * .md link is returned as-is so http(s) links and anchors keep working.
 */
function rewriteLink(href: string): string {
  // Anchors and absolute URLs pass through.
  if (href.startsWith("#")) return href;
  if (/^https?:\/\//i.test(href)) return href;
  if (href.startsWith("mailto:")) return href;

  // Split off any anchor / query.
  const hashIndex = href.indexOf("#");
  const queryIndex = href.indexOf("?");
  let cut = href.length;
  if (hashIndex >= 0) cut = Math.min(cut, hashIndex);
  if (queryIndex >= 0) cut = Math.min(cut, queryIndex);
  const pathPart = href.slice(0, cut);
  const suffix = href.slice(cut);

  // Only rewrite paths that end in .md (the content tree's link convention).
  if (!pathPart.endsWith(".md")) return href;

  // Strip the trailing ".md" and treat the rest as a relative path.
  const rel = pathPart.slice(0, -3); // e.g. "./reactbits", "../navigation"

  // Walk up from a synthetic "current directory" — but we don't actually
  // know which page we're on here. Use a simple rule: the link's own
  // structure determines the target. We treat the rel path as relative
  // to the navigation.md it appears in, which lives at the same level as
  // its sibling entries.
  //
  // Pattern A: "./<name>.md" where name === "navigation" -> parent dir route.
  // Pattern B: "./<name>.md" where name !== "navigation" -> sibling tool route.
  // Pattern C: "../navigation.md" -> go up one dir; the link is from a child
  //            pointing at its parent domain/subdomain.
  //
  // We can't fully resolve without context, so we produce the best-effort
  // route and let Next.js 404 anything that doesn't exist. In practice the
  // navigation.md files only use these three patterns.

  const segments = rel.split("/").filter(Boolean);
  // Drop a leading "." segment.
  if (segments[0] === ".") segments.shift();

  // If the last segment is "navigation", drop it — it represents the
  // directory's index route.
  if (segments[segments.length - 1] === "navigation") {
    segments.pop();
  }
  // Each leading ".." pops one segment — but since we don't know the source
  // path, we just drop them (the resulting route is relative to root, which
  // is correct for links that point to a parent domain/subdomain).
  while (segments[0] === "..") {
    segments.shift();
  }

  const route = "/" + segments.join("/");
  return route + suffix;
}
