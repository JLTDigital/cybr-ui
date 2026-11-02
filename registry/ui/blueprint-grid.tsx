import type { ComponentProps, CSSProperties } from "react";

import { cn } from "@/lib/utils";

const CROSS = 12;

// Drafting-paper background: a minor grid inside a major grid, both in --label,
// with optional --ink crosshairs where the major lines meet. The pattern sits
// in an aria-hidden layer behind the children, so layout classes on the root
// apply to the children directly. Static, so there is nothing to reduce.
export function BlueprintGrid({
  minor = 24,
  major = 120,
  crosshairs = true,
  className,
  children,
  ...props
}: ComponentProps<"div"> & {
  minor?: number;
  major?: number;
  crosshairs?: boolean;
}) {
  const strong = "color-mix(in srgb, var(--label) 35%, transparent)";
  const faint = "color-mix(in srgb, var(--label) 12%, transparent)";
  const line = (color: string, to: string) =>
    `linear-gradient(${to}, ${color} var(--border-hair), transparent var(--border-hair))`;

  const grid: CSSProperties = {
    backgroundImage: [
      line(strong, "to bottom"),
      line(strong, "to right"),
      line(faint, "to bottom"),
      line(faint, "to right"),
    ].join(", "),
    backgroundSize: `${major}px ${major}px, ${major}px ${major}px, ${minor}px ${minor}px, ${minor}px ${minor}px`,
  };

  // Major lines in --ink, masked down to a small square around each intersection.
  const cross: CSSProperties = {
    backgroundImage: `${line("var(--ink)", "to bottom")}, ${line("var(--ink)", "to right")}`,
    backgroundSize: `${major}px ${major}px`,
    maskImage: `linear-gradient(to right, black ${CROSS}px, transparent ${CROSS}px), linear-gradient(to bottom, black ${CROSS}px, transparent ${CROSS}px)`,
    maskSize: `${major}px ${major}px`,
    maskPosition: `${-CROSS / 2}px ${-CROSS / 2}px`,
    maskComposite: "intersect",
  };

  return (
    <div className={cn("relative isolate overflow-hidden bg-ground-deep", className)} {...props}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10" style={grid}>
        {crosshairs ? <div className="absolute inset-0" style={cross} /> : null}
      </div>
      {children}
    </div>
  );
}
