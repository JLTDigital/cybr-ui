"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";

import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

function easeOutCubic(p: number) {
  return 1 - Math.pow(1 - p, 3);
}

// Number readout that counts up from 0 the first time it scrolls into view.
// Screen readers get the final value from a visually hidden copy; the counting
// digits are aria-hidden. Static-first: the server, no-JS and reduced-motion
// render is the final value. A fixed default locale keeps server and client
// output identical.
export function TelemetryCounter({
  value,
  decimals = 0,
  minDigits = 1,
  locale = "en-US",
  duration = 2250,
  className,
  ...props
}: Omit<ComponentProps<"span">, "children"> & {
  value: number;
  decimals?: number;
  minDigits?: number;
  locale?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [seen, setSeen] = useState(false);
  const [done, setDone] = useState(false);
  const [current, setCurrent] = useState(0);
  const animatable = Number.isFinite(value);

  useEffect(() => {
    const node = ref.current;
    if (reduced || seen || !node) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setSeen(true);
        observer.disconnect();
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced, seen]);

  useEffect(() => {
    if (reduced || !seen || done || !animatable) return;
    let frame = 0;
    let startedAt: number | null = null;
    const step = (now: number) => {
      startedAt ??= now;
      const p = duration > 0 ? Math.min(1, (now - startedAt) / duration) : 1;
      setCurrent(value * easeOutCubic(p));
      if (p < 1) frame = requestAnimationFrame(step);
      else setDone(true);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [reduced, seen, done, animatable, value, duration]);

  const format = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    minimumIntegerDigits: minDigits,
  });
  const shown = reduced || done || !animatable ? value : seen ? current : 0;

  return (
    <span ref={ref} className={cn("inline-block font-display tabular-nums", className)} {...props}>
      <span className="sr-only">{format.format(value)}</span>
      <span aria-hidden="true">{format.format(shown)}</span>
    </span>
  );
}
