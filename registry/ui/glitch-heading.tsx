import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

// Display heading that tears into signal and neon slices in a short burst every
// 3.2s. The slices are aria-hidden spans, not ::before/::after content, so the
// accessible name is the heading text alone. They never render under reduced
// motion. Use at most one glitch element per viewport.
export function GlitchHeading({
  as: Tag = "h2",
  className,
  children,
  ...props
}: ComponentProps<"h2"> & { as?: HeadingLevel }) {
  const slice = "pointer-events-none absolute inset-0 motion-reduce:hidden";

  return (
    <Tag
      className={cn(
        "relative inline-block font-display text-display-md uppercase [line-height:0.9] text-ink",
        className,
      )}
      {...props}
    >
      {children}
      <span aria-hidden="true" className={cn(slice, "text-signal glitch-heading-a")}>
        {children}
      </span>
      <span aria-hidden="true" className={cn(slice, "text-neon-2 glitch-heading-b")}>
        {children}
      </span>
    </Tag>
  );
}
