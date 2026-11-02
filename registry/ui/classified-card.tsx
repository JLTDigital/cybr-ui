"use client";

import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";

import { cn } from "@/lib/utils";

// Dashed dossier frame with a rotated stamp. Wrap words in <Redacted> to black
// them out until clicked. This is a visual effect only: redacted text is in the
// page HTML, so never use it for real secrets.
export function ClassifiedCard({
  stamp = "REDACTED",
  hint,
  className,
  children,
  ...props
}: ComponentProps<"div"> & { stamp?: ReactNode; hint?: ReactNode }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 border-(length:--border-base) border-dashed border-dim p-4.5 font-mono text-[0.8125rem] [line-height:1.7] text-ink",
        className,
      )}
      {...props}
    >
      {stamp ? (
        <span className="-rotate-3 self-start border-(length:--border-base) border-solid border-signal px-2 py-0.5 text-caption font-bold tracking-[0.2em] text-signal">
          {stamp}
        </span>
      ) : null}
      <div>{children}</div>
      {hint ? <span className="text-caption tracking-[0.12em] text-label">{hint}</span> : null}
    </div>
  );
}

// An ink bar over inline text. Activating it reveals the text for good and
// moves focus onto it, so screen readers read what was uncovered.
export function Redacted({
  className,
  children,
  onClick,
  ...props
}: Omit<ComponentProps<"button">, "children" | "type"> & { children: ReactNode }) {
  const [revealed, setRevealed] = useState(false);
  const revealedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (revealed) revealedRef.current?.focus();
  }, [revealed]);

  if (revealed) {
    return (
      <span ref={revealedRef} tabIndex={-1} className="outline-none">
        {children}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setRevealed(true);
      }}
      className={cn(
        "inline cursor-pointer rounded-none border-0 bg-transparent p-0 text-left [font:inherit] [color:inherit]",
        "focus-visible:outline-(length:--focus-width) focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-signal",
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="bg-ink box-decoration-clone text-transparent select-none">
        {children}
      </span>
      <span className="sr-only">Redacted. Activate to declassify.</span>
    </button>
  );
}
