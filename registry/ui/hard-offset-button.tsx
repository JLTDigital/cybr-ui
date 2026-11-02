import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

// Solid offset shadow that steps in on hover and presses flush on click.
// Classes avoid pairs that a stock tailwind-merge would collapse, because
// installed copies use the consumer's own cn().
export function HardOffsetButton({
  className,
  type = "button",
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      type={type}
      className={cn(
        "relative inline-flex min-h-13 cursor-pointer items-center justify-center gap-2.5 rounded-none px-7",
        "font-mono text-[0.9375rem] font-bold uppercase tracking-button",
        "border-(length:--border-heavy) border-solid border-ink bg-signal text-ground-deep shadow-hard",
        "transition-[translate,box-shadow] duration-(--duration-snap) ease-step-2 motion-reduce:transition-none",
        "enabled:hover:translate-(--offset-hard-hover) enabled:hover:shadow-hard-hover",
        "enabled:active:translate-(--offset-hard) enabled:active:shadow-none",
        "focus-visible:outline-(length:--focus-width) focus-visible:outline-offset-(--focus-offset) focus-visible:outline-solid focus-visible:outline-signal",
        "disabled:cursor-not-allowed disabled:border-(length:--border-base) disabled:border-dashed disabled:border-dim disabled:bg-surface disabled:text-label disabled:shadow-none",
        className,
      )}
      {...props}
    />
  );
}
