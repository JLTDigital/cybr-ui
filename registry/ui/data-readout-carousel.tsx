"use client";

import { useState, type ComponentProps, type KeyboardEvent, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const button =
  "flex min-h-11 cursor-pointer items-center gap-1.5 border-0 bg-transparent px-4 font-mono text-xs font-bold tracking-label text-ink aria-[disabled=false]:hover:bg-bg aria-disabled:cursor-not-allowed aria-disabled:text-dim focus-visible:outline-(length:--focus-width) focus-visible:outline-offset-[-3px] focus-visible:outline-solid focus-visible:outline-signal";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function isTextField(target: EventTarget) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

// Framed slide viewer with a 01 / 08 counter, PREV / NEXT buttons and a
// decorative segment strip. Inactive slides stay in the DOM with `hidden`, so
// the server and no-JS render show slide 1. After the first change, each slide
// that is shown plays a short stepped wipe (off under reduced motion), because
// CSS animations restart when an element leaves display: none. The end buttons
// use aria-disabled, not disabled, so focus stays on them at the first or last
// slide and the arrow keys keep working.
export function DataReadoutCarousel({
  label,
  slides,
  index,
  defaultIndex = 0,
  onIndexChange,
  loop = false,
  className,
  onKeyDown,
  ...props
}: Omit<ComponentProps<"section">, "children" | "aria-label"> & {
  label: string;
  slides: ReactNode[];
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  loop?: boolean;
}) {
  const [inner, setInner] = useState(defaultIndex);
  const [moved, setMoved] = useState(false);
  const total = slides.length;
  const raw = index ?? inner;
  const current = total === 0 ? 0 : Math.min(total - 1, Math.max(0, Number.isFinite(raw) ? Math.trunc(raw) : 0));
  const canPrev = total > 1 && (loop || current > 0);
  const canNext = total > 1 && (loop || current < total - 1);

  const go = (step: -1 | 1) => {
    if (step === -1 ? !canPrev : !canNext) return;
    const next = (current + step + total) % total;
    if (index === undefined) setInner(next);
    setMoved(true);
    onIndexChange?.(next);
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      className={cn("flex flex-col border-(length:--border-base) border-line bg-bg font-mono", className)}
      onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || isTextField(event.target)) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          go(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}
      {...props}
    >
      <div className="flex items-center justify-between gap-4 border-b-(length:--border-base) border-line bg-ground-deep px-5 py-3 text-xs tracking-label">
        <span className="text-label">{label}</span>
        <span aria-hidden="true" className="tabular-nums">
          <span className="text-signal">{pad(total === 0 ? 0 : current + 1)}</span>
          <span className="text-label"> / {pad(total)}</span>
        </span>
      </div>
      <div aria-live="polite" className="relative">
        {slides.map((slide, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${total}`}
            hidden={i !== current}
            className={cn(moved && "wipe-reveal [animation-duration:300ms]")}
          >
            {slide}
          </div>
        ))}
      </div>
      <div className="flex items-stretch justify-between gap-4 border-t-(length:--border-base) border-line bg-ground-deep">
        <button type="button" aria-label="Previous slide" aria-disabled={!canPrev} onClick={() => go(-1)} className={button}>
          <span aria-hidden="true">[ ← PREV ]</span>
        </button>
        <span
          aria-hidden="true"
          className="grid max-w-60 flex-1 items-center gap-1"
          style={{ gridTemplateColumns: `repeat(${Math.max(1, total)}, minmax(0, 1fr))` }}
        >
          {slides.map((_, i) => (
            <span key={i} className={cn("h-1.5", i === current ? "bg-signal" : "bg-line")} />
          ))}
        </span>
        <button type="button" aria-label="Next slide" aria-disabled={!canNext} onClick={() => go(1)} className={button}>
          <span aria-hidden="true">[ NEXT → ]</span>
        </button>
      </div>
    </section>
  );
}
