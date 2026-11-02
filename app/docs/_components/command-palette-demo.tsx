"use client";

import { useState } from "react";

import { CommandPalette, type CommandPaletteGroup } from "@/registry/ui/command-palette";

const groups: CommandPaletteGroup[] = [
  {
    label: "BUTTONS",
    items: [
      { value: "hard-offset-button", label: "Hard-Offset Button", hint: "BTN-01" },
      { value: "glitch-button", label: "Glitch Button", hint: "BTN-02" },
      { value: "hud-bracket-button", label: "HUD Bracket Button", hint: "BTN-03" },
      { value: "terminal-button", label: "Terminal Button", hint: "BTN-04" },
      { value: "hazard-button", label: "Hazard Button", hint: "BTN-05" },
    ],
  },
  {
    label: "TEXT & MOTION",
    items: [
      { value: "decrypt-text", label: "Decrypt Text", hint: "TXT-01" },
      { value: "glitch-heading", label: "Glitch Heading", hint: "TXT-02" },
      { value: "typewriter-terminal", label: "Typewriter Terminal", hint: "TXT-03" },
    ],
  },
  {
    label: "BACKGROUNDS",
    items: [
      { value: "blueprint-grid", label: "Blueprint Grid", hint: "BG-01" },
      { value: "crt-overlay", label: "CRT Overlay", hint: "BG-04" },
      { value: "data-rain", label: "Data Rain", hint: "BG-05" },
    ],
  },
];

// Docs-only demo: shows the last selected value so selection is visible
// without navigating away.
export function CommandPaletteDemo() {
  const [last, setLast] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center gap-4 font-mono">
      <CommandPalette groups={groups} onSelect={setLast} />
      <p className="m-0 text-caption tracking-label text-label" aria-live="polite">
        LAST RUN: <span className="text-ink">{last ?? "—"}</span>
      </p>
    </div>
  );
}
