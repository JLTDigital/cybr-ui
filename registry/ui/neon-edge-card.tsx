import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

// Link card whose border lights up in signal with a tight glow on hover and
// keyboard focus. The one place the system allows a glow on a card.
export function NeonEdgeCard({
  eyebrow,
  title,
  cta,
  className,
  ...props
}: Omit<ComponentProps<"a">, "title" | "children"> & {
  eyebrow?: ReactNode;
  title: ReactNode;
  cta?: ReactNode;
}) {
  return (
    <a
      className={cn(
        "flex min-h-48 flex-col justify-between gap-4 border-(length:--border-base) border-solid border-line bg-ground-deep p-4.5 font-mono text-ink no-underline",
        "transition-[border-color,box-shadow] duration-(--duration-fast) ease-step-3 motion-reduce:transition-none",
        "hover:border-signal hover:shadow-[0_0_0_1px_var(--signal),0_0_24px_-4px_var(--signal)]",
        "focus-visible:border-signal focus-visible:shadow-[0_0_0_1px_var(--signal),0_0_24px_-4px_var(--signal)]",
        "focus-visible:outline-(length:--focus-width) focus-visible:outline-offset-(--focus-offset) focus-visible:outline-solid focus-visible:outline-signal",
        className,
      )}
      {...props}
    >
      {eyebrow ? <span className="text-caption tracking-label text-label">{eyebrow}</span> : null}
      <span className="font-display text-[1.625rem] [line-height:0.95] uppercase">{title}</span>
      {cta ? <span className="text-caption tracking-label text-signal">{cta}</span> : null}
    </a>
  );
}
