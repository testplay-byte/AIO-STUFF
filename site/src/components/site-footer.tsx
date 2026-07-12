import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-border bg-card/50">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold"
              aria-hidden="true"
            >
              A
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">AIO-STUFF</span>
              <span className="text-xs text-muted-foreground">
                A curated, navigable atlas of tools.
              </span>
            </div>
          </div>
          <nav
            className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground"
            aria-label="Footer"
          >
            <Link
              href="/"
              className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:underline"
            >
              Home
            </Link>
            <a
              href="https://github.com/testplay-byte/AIO-STUFF"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:underline"
            >
              GitHub
            </a>
            <a
              href="https://testplay-byte.github.io/AIO-STUFF/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:underline"
            >
              Published site
            </a>
          </nav>
        </div>
        <div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
          © {year} AIO-STUFF · MIT licensed · Built from the{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
            domains/
          </code>{" "}
          tree at build time.
        </div>
      </div>
    </footer>
  );
}
