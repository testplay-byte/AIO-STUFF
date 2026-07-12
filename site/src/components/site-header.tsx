import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { Github } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="AIO-STUFF home"
        >
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm tracking-tight"
            aria-hidden="true"
          >
            A
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight">AIO-STUFF</span>
            <span className="mt-0.5 text-[11px] text-muted-foreground">
              tools · skills · resources
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="https://github.com/testplay-byte/AIO-STUFF"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Repo</span>
          </Link>
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
