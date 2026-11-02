"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";

import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

type Phase = "static" | "waiting" | "revealing";

function getPhase(reduced: boolean, seen: boolean): Phase {
  if (reduced) return "static";
  return seen ? "revealing" : "waiting";
}

// Block line that wipes in left to right on 12 hard steps the first time it
// scrolls into view. Static-first: the server, no-JS and reduced-motion render
// is fully visible; it only clips once motion is confirmed on the client.
export function SteppedWipeReveal({
  delay = 0,
  className,
  style,
  ...props
}: ComponentProps<"span"> & { delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [seen, setSeen] = useState(false);

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

  const phase = getPhase(reduced, seen);

  return (
    <span
      ref={ref}
      className={cn(
        "block",
        phase === "waiting" && "[clip-path:inset(0_100%_0_0)]",
        phase === "revealing" && "wipe-reveal",
        className,
      )}
      style={phase === "revealing" ? { animationDelay: `${delay}ms`, ...style } : style}
      {...props}
    />
  );
}
