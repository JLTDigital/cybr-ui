import type { ComponentProps, CSSProperties } from "react";

import { cn } from "@/lib/utils";

// Fine fractal noise for the concrete grain, and a slow turbulence for the darker
// blotches. Both are data-URI SVGs (like the grain utility), so instances never
// share SVG ids.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='4' seed='7' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
const BLOT =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='640'%3E%3Cfilter id='b'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.012' numOctaves='2' seed='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23b)'/%3E%3C/svg%3E\")";

// Formwork: 424×120 panels with --surface seams, and --bg tie holes on a 106×60 grid.
const formworkStyle: CSSProperties = {
  backgroundImage: [
    "radial-gradient(circle, var(--bg) 0 4px, color-mix(in srgb, var(--bg) 40%, transparent) 5px, transparent 6px)",
    "linear-gradient(to bottom, var(--surface) var(--border-base), transparent var(--border-base))",
    "linear-gradient(to right, var(--surface) var(--border-base), transparent var(--border-base))",
  ].join(", "),
  backgroundSize: "106px 60px, 100% 120px, 424px 100%",
  backgroundPosition: "53px 30px, 0 120px, 212px 0",
};

// Raw-concrete background on --dim: grain, blotches and, by default, formwork
// seams and tie holes. Decorative and static. Body text on it needs --ink.
export function BetonBrut({
  formwork = true,
  className,
  children,
  ...props
}: ComponentProps<"div"> & { formwork?: boolean }) {
  return (
    <div className={cn("relative isolate overflow-hidden bg-dim", className)} {...props}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-55" style={{ backgroundImage: GRAIN }} />
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: BLOT }} />
        {formwork ? <div className="absolute inset-0" style={formworkStyle} /> : null}
      </div>
      {children}
    </div>
  );
}
