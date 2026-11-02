import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const PULSE_TRACE = "M0 150 H80 L110 180 H250 V250 H425";

// Circuit-board background: --dim traces, solder pads and an IC block, with a
// --signal pulse running along one trace. The SVG covers the root (cropped, not
// stretched), is aria-hidden and sits behind the children. Under reduced
// motion the pulse rests at the start of its trace.
export function ExposedWiring({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("relative isolate overflow-hidden bg-bg", className)} {...props}>
      <svg
        aria-hidden="true"
        viewBox="0 0 425 360"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 -z-10 size-full"
      >
        <g fill="none" strokeWidth="2" className="stroke-dim">
          <path d="M0 80 H120 L150 110 H300 L330 80 H425" />
          <path d={PULSE_TRACE} />
          <path d="M60 360 V280 H180 L210 250" />
          <path d="M380 0 V60 L350 90 V200 H425" />
          <path d="M0 310 H40 L70 280" />
        </g>
        {/* pathLength makes one 40 + 400 dash cycle span the whole trace, so a single dash shows. */}
        <path
          d={PULSE_TRACE}
          pathLength={440}
          fill="none"
          strokeWidth="3"
          strokeDasharray="40 400"
          className="trace-pulse stroke-signal"
        />
        <g strokeWidth="2" className="fill-ground-deep stroke-label">
          <rect x="144" y="104" width="12" height="12" />
          <rect x="244" y="174" width="12" height="12" />
          <rect x="204" y="244" width="12" height="12" />
          <rect x="344" y="84" width="12" height="12" />
          <rect x="64" y="274" width="12" height="12" />
        </g>
        <rect x="236" y="214" width="96" height="60" strokeWidth="2" className="fill-surface stroke-label" />
        <text x="284" y="249" fontSize="12" textAnchor="middle" className="fill-ink font-mono">
          IC-07
        </text>
      </svg>
      {children}
    </div>
  );
}
