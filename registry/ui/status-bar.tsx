"use client";

import { useSyncExternalStore, type ComponentProps, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const BARS = [4, 7, 10, 13];

function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, 1000);
  return () => clearInterval(timer);
}

function utcTime() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`;
}

// Placeholder on the server and during hydration, so server and client markup
// match; the real time takes over right after.
function serverTime() {
  return "--:--:--";
}

function UtcClock() {
  const time = useSyncExternalStore(subscribe, utcTime, serverTime);
  return <span className="text-ink tabular-nums">{time} UTC</span>;
}

// Thin system strip for the top of a page: fake system strings on the left, a
// signal meter and a live UTC clock on the right. A plain <div>, so it can sit
// above a <nav> without adding a landmark.
export function StatusBar({
  items,
  signal,
  clock = true,
  className,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  items: ReactNode[];
  signal?: 0 | 1 | 2 | 3 | 4;
  clock?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-7 items-center justify-between gap-6 border-b-(length:--border-hair) border-line bg-ground-void px-6 font-mono text-caption tracking-label whitespace-nowrap text-label sm:px-10",
        className,
      )}
      {...props}
    >
      <span className="flex min-w-0 gap-5.5 overflow-hidden">
        {items.map((entry, i) => (
          <span key={i}>{entry}</span>
        ))}
      </span>
      <span className="flex shrink-0 items-center gap-5.5">
        {signal !== undefined && (
          <span role="img" aria-label={`Signal strength ${signal} of 4`} className="flex items-end gap-0.5">
            {BARS.map((height, i) => (
              <span
                key={height}
                className={cn("w-0.75", i < signal ? "bg-signal" : "bg-line")}
                style={{ height }}
              />
            ))}
          </span>
        )}
        {clock && <UtcClock />}
      </span>
    </div>
  );
}
