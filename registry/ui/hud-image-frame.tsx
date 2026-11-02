import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

const BRACKET = "pointer-events-none absolute size-5.5 border-signal border-solid";

// Void-black media frame with signal corner brackets, a centre reticle and a
// static scan line. Children fill the frame behind the overlays.
export function HudImageFrame({
  index,
  caption,
  scanLine = true,
  className,
  children,
  ...props
}: ComponentProps<"figure"> & {
  index?: ReactNode;
  caption?: ReactNode;
  scanLine?: boolean;
}) {
  return (
    <figure
      className={cn(
        "relative isolate m-0 flex min-h-49 items-end justify-between gap-4 overflow-hidden border-(length:--border-hair) border-solid border-line bg-ground-void p-4.5 font-mono",
        className,
      )}
      {...props}
    >
      {children ? (
        <div className="absolute inset-0 -z-10 [&>*]:size-full [&>img]:object-cover">{children}</div>
      ) : null}
      <span aria-hidden="true" className={cn(BRACKET, "top-2.5 left-2.5 border-t-(length:--border-heavy) border-l-(length:--border-heavy)")} />
      <span aria-hidden="true" className={cn(BRACKET, "top-2.5 right-2.5 border-t-(length:--border-heavy) border-r-(length:--border-heavy)")} />
      <span aria-hidden="true" className={cn(BRACKET, "bottom-2.5 left-2.5 border-b-(length:--border-heavy) border-l-(length:--border-heavy)")} />
      <span aria-hidden="true" className={cn(BRACKET, "right-2.5 bottom-2.5 border-r-(length:--border-heavy) border-b-(length:--border-heavy)")} />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 size-10 -translate-1/2 rounded-full border-(length:--border-hair) border-solid border-label"
      />
      <span aria-hidden="true" className="pointer-events-none absolute top-[30%] bottom-[30%] left-1/2 w-px bg-label" />
      <span aria-hidden="true" className="pointer-events-none absolute top-1/2 right-[42%] left-[42%] h-px bg-label" />
      {scanLine ? (
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[38%] h-0.5 bg-signal opacity-55" />
      ) : null}
      {index ? (
        <span
          aria-hidden="true"
          className="relative font-display text-[5.5rem] [line-height:0.8] text-transparent [-webkit-text-stroke:2px_var(--ink)]"
        >
          {index}
        </span>
      ) : null}
      {caption ? (
        <figcaption className="relative ml-auto text-caption tracking-label text-label">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
