"use client";

import { usePathname } from "next/navigation";

import { SiteSearch } from "@/app/_components/site-search";
import { ThemeSwitcher } from "@/app/_components/theme-switcher";
import type { CommandPaletteGroup } from "@/registry/ui/command-palette";
import { TerminalNavbar } from "@/registry/ui/terminal-navbar";

const COMMAND_PALETTE_DOCS = "/docs/components/command-palette";

export function SiteHeader({ searchGroups }: { searchGroups: CommandPaletteGroup[] }) {
  const pathname = usePathname();

  return (
    <header>
      <a
        href="#main"
        className="sr-only bg-signal px-4 py-2 text-xs tracking-label uppercase text-ground-deep focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus-visible:outline-(length:--focus-width) focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ink"
      >
        Skip to content
      </a>
      <TerminalNavbar
        links={[
          {
            label: "COMPONENTS",
            href: "/docs/components",
            current: pathname.startsWith("/docs/components"),
          },
          { label: "INSTALL", href: "/#install" },
        ]}
        actions={
          // Between the bar's @3xl fold and @5xl the links share a tight row, so
          // the actions drop the visible THEME label and tighten their spacing.
          <div className="flex flex-wrap items-center gap-4 border-line px-6 py-2 @3xl:gap-2 @3xl:border-l-(length:--border-base) @3xl:px-3">
            <ThemeSwitcher labelClassName="@3xl:@max-5xl:sr-only" />
            <SiteSearch groups={searchGroups} shortcut={pathname !== COMMAND_PALETTE_DOCS} />
          </div>
        }
      />
    </header>
  );
}
