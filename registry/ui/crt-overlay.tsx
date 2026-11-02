import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const scanlines =
  "repeating-linear-gradient(0deg, color-mix(in srgb, var(--ground-void) 45%, transparent) 0 2px, transparent 2px 4px)";
const vignette =
  "radial-gradient(ellipse at center, transparent 45%, color-mix(in srgb, var(--ground-void) 75%, transparent) 100%)";

// Old-monitor screen: scanlines and a vignette laid over the children, and a
// faint flicker (two dips every 4s, under 3Hz). The overlays are aria-hidden
// and never take pointer events. The flicker is off under reduced motion.
export function CrtOverlay({
  vignette: showVignette = true,
  flicker = true,
  className,
  children,
  ...props
}: ComponentProps<"div"> & { vignette?: boolean; flicker?: boolean }) {
  return (
    <div className={cn("relative isolate overflow-hidden bg-ground-deep", flicker && "crt-flicker", className)} {...props}>
      {children}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10" style={{ backgroundImage: scanlines }} />
      {showVignette ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10" style={{ backgroundImage: vignette }} />
      ) : null}
    </div>
  );
}
