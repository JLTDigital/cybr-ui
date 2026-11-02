"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type CopyState = "idle" | "copied" | "failed";

const LABELS: Record<CopyState, string> = {
  idle: "COPY",
  copied: "COPIED",
  failed: "COPY FAILED",
};

const RESET_MS = 2000;

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    let next: CopyState = "copied";
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard missing (non-secure origin) or permission denied.
      next = "failed";
    }
    setState(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), RESET_MS);
  }

  return (
    <>
      <button
        type="button"
        aria-label={label}
        onClick={copy}
        className={cn(
          "shrink-0 cursor-pointer border-(length:--border-base) border-solid px-3 py-1.5 text-micro tracking-button uppercase",
          "focus-visible:outline-(length:--focus-width) focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-signal",
          state === "copied" && "border-signal bg-signal text-ground-deep",
          state === "failed" && "border-dashed border-ink bg-bg text-ink",
          state === "idle" && "border-ink bg-bg text-ink hover:bg-ink hover:text-ground-deep",
        )}
      >
        {LABELS[state]}
      </button>
      <span className="sr-only" aria-live="polite">
        {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : ""}
      </span>
    </>
  );
}
