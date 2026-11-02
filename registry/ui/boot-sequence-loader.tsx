"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";

import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

export type BootLine = { text: string; status: string };

const DEFAULT_LINE_MS = 1000;

// Boot log that prints one line per lineDuration and fills each line's status
// in --signal when the next step starts, then calls onComplete once. The log is
// aria-hidden; a visually hidden status region announces only the final line.
// Static-first: the server, no-JS and reduced-motion render is the full log.
export function BootSequenceLoader({
  lines,
  lineDuration = DEFAULT_LINE_MS,
  onComplete,
  className,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  lines: BootLine[];
  lineDuration?: number;
  onComplete?: () => void;
}) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState<number | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  const count = lines.length;
  const duration = Number.isFinite(lineDuration) && lineDuration > 0 ? lineDuration : DEFAULT_LINE_MS;
  const signature = lines.map((line) => `${line.text}\u0000${line.status}`).join("\n");

  useEffect(() => {
    // Deferred so the hydration pass, which always reports reduced motion,
    // cancels it if the real preference turns out to allow motion.
    if (reduced) {
      const timer = setTimeout(() => onCompleteRef.current?.(), 0);
      return () => clearTimeout(timer);
    }
    let current = -1;
    let timer: ReturnType<typeof setTimeout>;
    const advance = () => {
      current += 1;
      setStep(current);
      if (current >= count) onCompleteRef.current?.();
      else timer = setTimeout(advance, duration);
    };
    timer = setTimeout(advance, 0);
    return () => {
      clearTimeout(timer);
      setStep(null);
    };
  }, [reduced, signature, count, duration]);

  const settled = reduced || step === null;
  const shown = settled ? count : Math.min(count, step + 1);
  const done = settled ? count : step;
  const last = lines[count - 1];
  const announcement = done >= count && last ? `${last.text.replace(/[.\s]+$/, "")} ${last.status}` : "";

  return (
    <div
      className={cn("bg-ground-void px-8 py-6 font-mono text-xs leading-[1.65] text-label", className)}
      {...props}
    >
      <p role="status" className="sr-only">
        {announcement}
      </p>
      <div aria-hidden="true">
        {lines.slice(0, shown).map((line, i) => (
          <div key={i} className="whitespace-pre">
            {line.text}
            {i < done && <span className="text-signal">{line.status}</span>}
          </div>
        ))}
        <span className="inline-block h-3.75 w-2.25 bg-current align-[-2px] text-signal cursor-blink" />
      </div>
    </div>
  );
}
