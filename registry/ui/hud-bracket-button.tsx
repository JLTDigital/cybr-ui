import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const CORNER =
  "pointer-events-none absolute size-3 border-signal transition-[top,right,bottom,left] duration-(--duration-fast) ease-step-3 motion-reduce:transition-none group-disabled:border-dim";

// Dark button framed by four signal-coloured corner brackets that snap out 5px
// on hover. The brackets are decoration, hidden from assistive tech.
export function HudBracketButton({
  className,
  type = "button",
  children,
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      type={type}
      className={cn(
        "group relative inline-flex min-h-13 cursor-pointer items-center justify-center gap-2.5 rounded-none px-8.5",
        "font-mono text-[0.9375rem] font-bold uppercase tracking-button",
        "border-(length:--border-hair) border-solid border-line bg-ground-deep text-ink",
        "enabled:hover:text-signal enabled:active:translate-(--offset-hard-hover)",
        "focus-visible:outline-(length:--focus-width) focus-visible:outline-offset-(--focus-offset) focus-visible:outline-solid focus-visible:outline-signal",
        "disabled:cursor-not-allowed disabled:border-(length:--border-base) disabled:border-dashed disabled:border-dim disabled:bg-surface disabled:text-label",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          CORNER,
          "-top-1.5 -left-1.5 border-t-(length:--border-heavy) border-l-(length:--border-heavy)",
          "group-enabled:group-hover:-top-2.75 group-enabled:group-hover:-left-2.75",
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          CORNER,
          "-top-1.5 -right-1.5 border-t-(length:--border-heavy) border-r-(length:--border-heavy)",
          "group-enabled:group-hover:-top-2.75 group-enabled:group-hover:-right-2.75",
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          CORNER,
          "-bottom-1.5 -left-1.5 border-b-(length:--border-heavy) border-l-(length:--border-heavy)",
          "group-enabled:group-hover:-bottom-2.75 group-enabled:group-hover:-left-2.75",
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          CORNER,
          "-right-1.5 -bottom-1.5 border-r-(length:--border-heavy) border-b-(length:--border-heavy)",
          "group-enabled:group-hover:-right-2.75 group-enabled:group-hover:-bottom-2.75",
        )}
      />
      {children}
    </button>
  );
}
