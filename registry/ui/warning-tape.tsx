"use client";

import { useState, type ComponentProps, type CSSProperties, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const tapeVariants = {
  signal: "h-10 hazard-stripes",
  ink: "h-5.5 opacity-85 bg-[repeating-linear-gradient(-45deg,var(--ink)_0_10px,var(--ground-deep)_10px_20px)]",
};

// Tilted hazard tape that overhangs its container. With `items`, label chips
// scroll along it (in reverse by default), pausing on hover, while focus is
// inside, and from the PAUSE button (WCAG 2.2.2); the second copy is hidden from
// assistive tech. Without items it is a static, decorative stripe band. Under
// reduced motion nothing moves and the button is not shown.
export function WarningTape({
  items = [],
  variant = "signal",
  tilt = -2.5,
  duration = 20,
  reverse = true,
  pauseControl = true,
  className,
  style,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  items?: ReactNode[];
  variant?: "signal" | "ink";
  tilt?: number;
  duration?: number;
  reverse?: boolean;
  pauseControl?: boolean;
}) {
  const [paused, setPaused] = useState(false);
  const hasItems = items.length > 0;
  const list = (hidden?: boolean) => (
    <ul aria-hidden={hidden || undefined} className="m-0 flex shrink-0 list-none p-0">
      {items.map((item, i) => (
        <li key={i} className="mr-35 bg-ground-deep px-3.5 py-1.5 whitespace-nowrap">
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={cn("group relative overflow-hidden py-6", className)}
      style={
        {
          "--marquee-duration": `${duration}s`,
          "--marquee-direction": reverse ? "reverse" : "normal",
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      <div
        aria-hidden={hasItems ? undefined : "true"}
        className={cn("-mx-10 flex items-center overflow-hidden", tapeVariants[variant])}
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        {hasItems ? (
          <div
            className={cn(
              "marquee flex w-max font-mono text-[0.8125rem] font-bold tracking-[0.2em] text-ink group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused]",
              paused && "[animation-play-state:paused]",
            )}
          >
            {list()}
            {list(true)}
          </div>
        ) : null}
      </div>
      {hasItems && pauseControl ? (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="absolute top-2 right-2 z-10 cursor-pointer bg-ground-deep px-3 py-1 font-mono text-caption font-bold tracking-label text-ink focus-visible:outline-(length:--focus-width) focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:hidden"
        >
          {paused ? "PLAY" : "PAUSE"}
          <span className="sr-only"> warning tape</span>
        </button>
      ) : null}
    </div>
  );
}
