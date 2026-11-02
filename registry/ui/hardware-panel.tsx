import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

const RIVET =
  "pointer-events-none absolute size-2.25 rounded-full bg-dim shadow-[inset_1px_1px_0_var(--label)]";

// Riveted surface panel with a cable channel down the left edge. Stack
// HardwarePanelStatus rows (or anything else) as children.
export function HardwarePanel({
  title,
  titleAs: Title = "h3",
  className,
  children,
  ...props
}: Omit<ComponentProps<"section">, "title"> & {
  title: ReactNode;
  titleAs?: "h2" | "h3" | "h4";
}) {
  return (
    <section
      className={cn(
        "relative border-(length:--border-base) border-solid border-dim bg-surface pt-6 pr-5.5 pb-5.5 pl-10 font-mono text-ink",
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className={cn(RIVET, "top-2 left-2")} />
      <span aria-hidden="true" className={cn(RIVET, "top-2 right-2")} />
      <span aria-hidden="true" className={cn(RIVET, "bottom-2 left-2")} />
      <span aria-hidden="true" className={cn(RIVET, "right-2 bottom-2")} />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-6.5 bottom-6.5 left-3.5 w-3 border-(length:--border-hair) border-solid border-bg bg-[repeating-linear-gradient(0deg,var(--bg)_0_4px,var(--line)_4px_6px)]"
      />
      <Title className="mb-4.5 font-display text-[1.375rem] [line-height:1]">{title}</Title>
      <div className="flex flex-col gap-2.5">{children}</div>
    </section>
  );
}

// One status row. The state is always spelled out in text; the LED only
// repeats it visually.
export function HardwarePanelStatus({
  label,
  on,
  stateLabel,
  className,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  label: ReactNode;
  on: boolean;
  stateLabel?: ReactNode;
}) {
  return (
    <div
      className={cn("flex items-center justify-between gap-4 text-caption tracking-[0.12em]", className)}
      {...props}
    >
      <span>{label}</span>
      <span className="flex items-center gap-2">
        {stateLabel ?? (on ? "ON" : "OFF")}
        <span
          aria-hidden="true"
          className={cn(
            "size-2.5",
            on
              ? "bg-signal shadow-[0_0_10px_var(--signal)]"
              : "border-(length:--border-base) border-solid border-label",
          )}
        />
      </span>
    </div>
  );
}
