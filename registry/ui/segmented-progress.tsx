import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

function finiteOr(n: number, fallback: number) {
  return Number.isFinite(n) ? n : fallback;
}

// Determinate progress as a row of hard segments under a big padded readout.
// The track is the progressbar; the readout repeats its value, so it is
// aria-hidden. Segments snap on and off with no animation.
export function SegmentedProgress({
  value,
  max = 100,
  segments = 20,
  label,
  phase,
  showValue = true,
  className,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  value: number;
  max?: number;
  segments?: number;
  label: string;
  phase?: ReactNode;
  showValue?: boolean;
}) {
  const limit = finiteOr(max, 100) > 0 ? max : 100;
  const count = Math.max(1, Math.floor(finiteOr(segments, 20)));
  const current = Math.min(limit, Math.max(0, finiteOr(value, 0)));
  const filled = Math.floor((current / limit) * count);
  const percent = Math.round((current / limit) * 100);

  return (
    <div className={cn("flex flex-col gap-3 font-mono text-ink", className)} {...props}>
      {(showValue || phase) && (
        <div className="flex items-baseline justify-between gap-4">
          {showValue ? (
            <span aria-hidden="true" className="font-display text-[4rem] leading-[0.9] tabular-nums">
              {String(percent).padStart(3, "0")}%
            </span>
          ) : (
            <span />
          )}
          {phase && <span className="text-caption tracking-label text-label">{phase}</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={limit}
        aria-valuenow={current}
        className="grid h-5.5 gap-1 border-(length:--border-base) border-ink p-0.75"
        style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className={i < filled ? "bg-signal" : undefined} />
        ))}
      </div>
    </div>
  );
}
