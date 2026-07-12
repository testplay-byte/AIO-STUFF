"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { Github } from "lucide-react";

// Easter-egg trigger: clicking the app name 5 times rapidly (within
// QUINTU_WINDOW_MS) navigates to /blueprint — the hidden structure
// mind-map page. A normal single click still goes home. The first click's
// navigation to "/" is harmless when the user is already on the home page.
//
// The trigger lives on the app NAME, which is on the LEFT pill.
const QUINTU_THRESHOLD = 5;
const QUINTU_WINDOW_MS = 2500;

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const clickCountRef = React.useRef(0);
  const lastClickAtRef = React.useRef(0);

  // On /blueprint, the user wants both pills grouped on the RIGHT side.
  // On every other page, the default split layout (logo LEFT, repo+theme
  // RIGHT) applies. See memory/09-published-site-design.md.
  const isBlueprint = pathname === "/blueprint" || pathname === "/blueprint/";

  const handleBrandClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const now = Date.now();
      if (now - lastClickAtRef.current > QUINTU_WINDOW_MS) {
        clickCountRef.current = 0;
      }
      clickCountRef.current += 1;
      lastClickAtRef.current = now;

      if (clickCountRef.current >= QUINTU_THRESHOLD) {
        // Trigger the easter egg. Prevent the home navigation so we go to
        // /blueprint instead.
        e.preventDefault();
        clickCountRef.current = 0;
        router.push("/blueprint");
      }
      // Otherwise, let the Link's default navigation to "/" happen.
      // (From the home page this is a harmless no-op.)
    },
    [router],
  );

  const brandPill = (
    <Link
      href="/"
      onClick={handleBrandClick}
      className="group inline-flex items-center gap-2.5 rounded-xl border border-border bg-card/90 px-3 py-2 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/70 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label="AIO-STUFF home"
    >
      <span
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm tracking-tight transition-transform group-hover:scale-105"
        aria-hidden="true"
      >
        A
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-base font-bold tracking-tight">
          AIO-STUFF
        </span>
        <span className="mt-0.5 text-[11px] text-muted-foreground">
          tools · skills · resources
        </span>
      </span>
    </Link>
  );

  const repoNav = (
    <nav
      className="flex items-center gap-1.5 rounded-xl border border-border bg-card/90 p-1.5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/70"
      aria-label="Site"
    >
      <Link
        href="https://github.com/testplay-byte/AIO-STUFF"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Github className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Repo</span>
      </Link>
      <ModeToggle variant="ghost" />
    </nav>
  );

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Sticky flex container — two separate floating pills with a visible
          gap between them. NO full-width border-bottom connecting them.

          Default (all pages except /blueprint): LEFT = logo + name,
          RIGHT = repo + theme toggle.
          Blueprint page: both pills grouped on the RIGHT. */}
      <div
        className={
          isBlueprint
            ? "mx-auto flex w-full max-w-6xl items-center justify-end gap-3 px-3 pt-3 sm:gap-4 sm:px-6"
            : "mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-3 pt-3 sm:gap-4 sm:px-6"
        }
      >
        {brandPill}
        {repoNav}
      </div>
    </header>
  );
}
