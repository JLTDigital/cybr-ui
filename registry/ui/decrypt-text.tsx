"use client";

import { useEffect, useState, type ComponentProps } from "react";

import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

const GLYPHS = "#%&@$*!<>/\\|=+01ΞΣ";
const TICK_MS = 50;
const TICKS_PER_CHAR = 2.5;

function totalTicks(text: string) {
  return Math.ceil(text.length * TICKS_PER_CHAR);
}

// Deterministic, so a given text and tick always draw the same frame.
function frame(text: string, tick: number) {
  const revealed = Math.floor(tick / TICKS_PER_CHAR);
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    out += ch === " " || i < revealed ? ch : GLYPHS[(i * 7 + tick * 3) % GLYPHS.length];
  }
  return out;
}

// Random glyphs that resolve left to right once on mount. Screen readers get
// the real string from a visually hidden copy; the scramble is aria-hidden.
// Static-first: the server, no-JS and reduced-motion render is the final text.
export function DecryptText({
  text,
  className,
  ...props
}: Omit<ComponentProps<"span">, "children"> & { text: string }) {
  const reduced = useReducedMotion();
  const [tick, setTick] = useState<number | null>(null);

  useEffect(() => {
    if (reduced) return;
    const end = totalTicks(text);
    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      setTick(current);
      if (current >= end) clearInterval(timer);
    }, TICK_MS);
    return () => {
      clearInterval(timer);
      setTick(null);
    };
  }, [text, reduced]);

  const shown = reduced || tick === null ? text : frame(text, tick);

  return (
    <span className={cn("inline-block", className)} {...props}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="whitespace-pre">
        {shown}
      </span>
    </span>
  );
}
