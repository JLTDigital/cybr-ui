import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

// Terminal prompt button: `> label` plus a blinking block cursor, inverting to a
// signal fill on hover. Prompt and cursor are aria-hidden, so the accessible
// name is the label alone.
export function TerminalButton({
  className,
  type = "button",
  children,
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      type={type}
      className={cn(
        "group relative inline-flex min-h-13 cursor-pointer items-center justify-center gap-2.5 rounded-none px-7",
        "font-mono text-[0.9375rem] font-normal tracking-[0.04em]",
        "border-(length:--border-hair) border-solid border-line bg-ground-void text-signal",
        "enabled:hover:border-signal enabled:hover:bg-signal enabled:hover:text-ground-void",
        "enabled:active:translate-(--offset-hard-hover)",
        "focus-visible:outline-(length:--focus-width) focus-visible:outline-offset-(--focus-offset) focus-visible:outline-solid focus-visible:outline-signal",
        "disabled:cursor-not-allowed disabled:border-(length:--border-base) disabled:border-dashed disabled:border-dim disabled:bg-surface disabled:text-label",
        className,
      )}
      {...props}
    >
      <span>
        <span aria-hidden="true">{"> "}</span>
        {children}
      </span>
      <span aria-hidden="true" className="inline-block h-4.5 w-2.5 bg-current group-enabled:cursor-blink" />
    </button>
  );
}
