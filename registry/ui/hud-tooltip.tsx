"use client";

import { Tooltip } from "@base-ui/react/tooltip";
import { useId, useState, type ReactElement, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const popupVariants = {
  readout:
    "w-50 bg-ground-void border-(length:--border-hair) border-signal px-3 py-2.5 font-mono text-caption [line-height:1.6] tracking-[0.06em] text-ink",
  lock: "relative w-55.5 bg-ground-void border-(length:--border-hair) border-line px-4 py-3.5 font-mono text-ink",
};

// Leader stub and node on the popup edge that faces the trigger, following
// Base UI's data-side so they stay correct when the popup flips.
const leaderStub =
  "pointer-events-none absolute bg-signal " +
  "group-data-[side=bottom]/tip:bottom-full group-data-[side=bottom]/tip:left-5 group-data-[side=bottom]/tip:h-3 group-data-[side=bottom]/tip:w-0.5 " +
  "group-data-[side=top]/tip:top-full group-data-[side=top]/tip:left-5 group-data-[side=top]/tip:h-3 group-data-[side=top]/tip:w-0.5 " +
  "group-data-[side=right]/tip:right-full group-data-[side=right]/tip:top-5 group-data-[side=right]/tip:h-0.5 group-data-[side=right]/tip:w-3 " +
  "group-data-[side=left]/tip:left-full group-data-[side=left]/tip:top-5 group-data-[side=left]/tip:h-0.5 group-data-[side=left]/tip:w-3";
const leaderNode =
  "pointer-events-none absolute size-2.5 bg-signal " +
  "group-data-[side=bottom]/tip:-top-1.25 group-data-[side=bottom]/tip:left-4 " +
  "group-data-[side=top]/tip:-bottom-1.25 group-data-[side=top]/tip:left-4 " +
  "group-data-[side=right]/tip:-left-1.25 group-data-[side=right]/tip:top-4 " +
  "group-data-[side=left]/tip:-right-1.25 group-data-[side=left]/tip:top-4";

// HUD tooltip built on Base UI. Opens on hover (after 150ms) and immediately on
// keyboard focus, closes on Escape, and stays open while the pointer moves into
// it. `readout` is a small bordered data box; `lock` is the target-lock card
// with bracket corners and a leader line. Tooltips are supplementary: they are
// not shown on touch, so never put essential information only in one.
export function HudTooltip({
  content,
  children,
  variant = "readout",
  eyebrow,
  title,
  side = "bottom",
  align = "start",
  open,
  defaultOpen,
  onOpenChange,
  className,
  ...props
}: Omit<Tooltip.Popup.Props, "children" | "className" | "title"> & {
  content: ReactNode;
  children: ReactElement;
  variant?: "readout" | "lock";
  eyebrow?: ReactNode;
  title?: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: Tooltip.Root.Props["onOpenChange"];
  className?: string;
}) {
  const id = useId();
  // Mirror the open state so aria-describedby only points at a mounted popup.
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);
  const isOpen = open ?? uncontrolledOpen;

  return (
    <Tooltip.Provider>
      <Tooltip.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={(next, details) => {
          setUncontrolledOpen(next);
          onOpenChange?.(next, details);
        }}
      >
        <Tooltip.Trigger delay={150} render={children} aria-describedby={isOpen ? id : undefined} />
        <Tooltip.Portal>
          <Tooltip.Positioner side={side} align={align} sideOffset={12} className="z-50">
            <Tooltip.Popup
              id={id}
              role="tooltip"
              className={cn("group/tip", popupVariants[variant], className)}
              {...props}
            >
              {variant === "lock" ? (
                <>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-1 -left-1 size-3 border-t-(length:--border-heavy) border-l-(length:--border-heavy) border-signal"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-1 -bottom-1 size-3 border-r-(length:--border-heavy) border-b-(length:--border-heavy) border-signal"
                  />
                  <span aria-hidden="true" className={leaderStub} />
                  <span aria-hidden="true" className={leaderNode} />
                  {eyebrow ? (
                    <span className="mb-1.5 block text-micro tracking-[0.16em] text-label">{eyebrow}</span>
                  ) : null}
                  {title ? (
                    <span className="mb-2 block font-display text-xl [line-height:1] uppercase">{title}</span>
                  ) : null}
                  <span className="block text-caption [line-height:1.6] text-label">{content}</span>
                </>
              ) : (
                content
              )}
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
