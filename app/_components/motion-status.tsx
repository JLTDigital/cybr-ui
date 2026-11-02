"use client";

import { useReducedMotion } from "@/lib/use-reduced-motion";

export function MotionStatus() {
  const reduced = useReducedMotion();

  return (
    <p className="text-xs tracking-label uppercase text-label">
      MOTION: <span className="text-ink">{reduced ? "REDUCED" : "FULL"}</span>
    </p>
  );
}
