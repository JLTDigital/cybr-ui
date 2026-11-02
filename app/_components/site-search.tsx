"use client";

import { useRouter } from "next/navigation";

import { CommandPalette, type CommandPaletteGroup } from "@/registry/ui/command-palette";

// Site-wide jump-to-component search. `shortcut` is off on the Command Palette
// docs page so ⌘K opens only the live demo there.
export function SiteSearch({ groups, shortcut }: { groups: CommandPaletteGroup[]; shortcut: boolean }) {
  const router = useRouter();

  return (
    <CommandPalette
      groups={groups}
      onSelect={(name) => router.push(`/docs/components/${name}`)}
      shortcut={shortcut}
      label="Search components"
      placeholder="Search components…"
      className="self-center"
    />
  );
}
