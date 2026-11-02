"use client";

import { useState, type ComponentProps, type CSSProperties, type ReactNode } from "react";

import { cn } from "@/lib/utils";

// Signal ticker band that scrolls its items endlessly. The track holds two
// copies (the second hidden from assistive tech) so the loop is seamless; pass
// enough items to fill the widest band. It pauses on hover, while focus is
// inside, and from the PAUSE button (WCAG 2.2.2). Under reduced motion it is
// static and the button is not shown.
export function TickerMarquee({
  items,
  duration = 26,
  reverse = false,
  pauseControl = true,
  className,
  style,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  items: ReactNode[];
  duration?: number;
  reverse?: boolean;
  pauseControl?: boolean;
}) {
  const [paused, setPaused] = useState(false);
  const list = (hidden?: boolean) => (
    <ul aria-hidden={hidden || undefined} className="m-0 flex shrink-0 list-none p-0">
      {items.map((item, i) => (
        <li key={i} className="pr-12 whitespace-nowrap">
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={cn(
        "group relative flex h-12.5 items-center overflow-hidden border-y-(length:--border-base) border-ground-deep bg-signal font-mono text-sm font-bold tracking-label text-ground-deep",
        className,
      )}
      style={
        {
          "--marquee-duration": `${duration}s`,
          "--marquee-direction": reverse ? "reverse" : "normal",
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      {items.length > 0 ? (
        <>
          <div
            className={cn(
              "marquee flex w-max group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused]",
              paused && "[animation-play-state:paused]",
            )}
          >
            {list()}
            {list(true)}
          </div>
          {pauseControl ? (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="absolute inset-y-0 right-0 z-10 cursor-pointer bg-ground-deep px-3 font-mono text-caption font-bold tracking-label text-ink focus-visible:outline-(length:--focus-width) focus-visible:outline-offset-[-4px] focus-visible:outline-ink motion-reduce:hidden"
            >
              {paused ? "PLAY" : "PAUSE"}
              <span className="sr-only"> ticker</span>
            </button>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
