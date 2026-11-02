import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

// Ink ID badge: hazard band, access level chip, photo slot, name, ID line and a
// decorative barcode. With no photo, the slot shows a crosshair placeholder.
export function AccessCard({
  name,
  level,
  levelLabel = "ACCESS LVL",
  idLine,
  photo,
  className,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  name: ReactNode;
  level: ReactNode;
  levelLabel?: ReactNode;
  idLine?: ReactNode;
  photo?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col border-(length:--border-base) border-solid border-ink bg-ink font-mono text-ground-deep",
        className,
      )}
      {...props}
    >
      <div aria-hidden="true" className="h-3.5 hazard-stripes" />
      <div className="flex flex-col gap-2.5 px-3.5 py-3">
        <div className="flex items-center justify-between gap-4 text-micro font-bold tracking-label">
          <span>{levelLabel}</span>
          <span className="bg-ground-deep px-1.5 py-0.5 text-ink">{level}</span>
        </div>
        <div className="relative h-24 overflow-hidden bg-surface">
          {photo ? (
            <div className="size-full [&>*]:size-full [&>img]:object-cover">{photo}</div>
          ) : (
            <>
              <span aria-hidden="true" className="pointer-events-none absolute top-2 bottom-2 left-1/2 w-px bg-dim" />
              <span aria-hidden="true" className="pointer-events-none absolute top-1/2 right-2 left-2 h-px bg-dim" />
            </>
          )}
        </div>
        <p className="font-display text-xl [line-height:1] uppercase">{name}</p>
        {idLine ? <p className="text-micro tracking-[0.12em]">{idLine}</p> : null}
        <div
          aria-hidden="true"
          className="h-6.5 bg-[repeating-linear-gradient(90deg,var(--ground-deep)_0_2px,transparent_2px_4px,var(--ground-deep)_4px_7px,transparent_7px_8px,var(--ground-deep)_8px_9px,transparent_9px_12px)]"
        />
      </div>
    </div>
  );
}
