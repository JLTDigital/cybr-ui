"use client";

import { useEffect, useState, type ComponentProps } from "react";

import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

export type TerminalLine = { text: string; prompt?: boolean };

const TICK_MS = 50;
const DEFAULT_CPS = 40;

function charsPerTick(charsPerSecond: number) {
  const cps = Number.isFinite(charsPerSecond) && charsPerSecond > 0 ? charsPerSecond : DEFAULT_CPS;
  return (cps * TICK_MS) / 1000;
}

// Shares a typed-character budget across lines in order. The cursor sits on the
// first unfinished line, or the last line once everything is typed.
function typedLines(lines: string[], budget: number) {
  let left = budget;
  let cursor = -1;
  const shown = lines.map((line, i) => {
    const visible = line.slice(0, Math.max(0, Math.min(line.length, left)));
    if (cursor === -1 && left < line.length) cursor = i;
    left -= line.length;
    return visible;
  });
  return { shown, cursor: cursor === -1 ? lines.length - 1 : cursor };
}

// Terminal panel that types its lines out once on mount, with a blinking block
// cursor. Screen readers get every full line from a visually hidden copy; the
// typed view is aria-hidden. Static-first: the server, no-JS and reduced-motion
// render shows every line with the cursor on the last one.
export function TypewriterTerminal({
  lines,
  promptSymbol = "> ",
  charsPerSecond = DEFAULT_CPS,
  className,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  lines: TerminalLine[];
  promptSymbol?: string;
  charsPerSecond?: number;
}) {
  const reduced = useReducedMotion();
  const [tick, setTick] = useState<number | null>(null);

  const full = lines.length > 0 ? lines.map((line) => (line.prompt ? promptSymbol : "") + line.text) : [""];
  const prompts = lines.length > 0 ? lines.map((line) => Boolean(line.prompt)) : [false];
  const perTick = charsPerTick(charsPerSecond);
  const total = full.reduce((sum, line) => sum + line.length, 0);
  const signature = full.join("\n");

  useEffect(() => {
    if (reduced) return;
    const end = Math.ceil(total / perTick);
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
  }, [signature, total, perTick, reduced]);

  const { shown, cursor } =
    reduced || tick === null ? { shown: full, cursor: full.length - 1 } : typedLines(full, Math.floor(tick * perTick));

  return (
    <div
      className={cn(
        "bg-ground-void px-8 py-6 font-mono text-[0.9375rem] leading-[1.75] text-ink",
        className,
      )}
      {...props}
    >
      <div className="sr-only">
        {full.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      <div aria-hidden="true">
        {shown.map((line, i) => (
          <div key={i} className="min-h-6.5 whitespace-pre">
            <span className={prompts[i] ? "text-signal" : undefined}>{line}</span>
            {i === cursor && (
              <span className="inline-block h-4.5 w-2.5 bg-current align-[-3px] text-signal cursor-blink" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
