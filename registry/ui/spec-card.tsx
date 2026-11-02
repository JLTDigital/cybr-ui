import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type SpecRow = { label: ReactNode; value: ReactNode; accent?: boolean };

// Decorative barcode bar widths in px, from the artboard.
const BARCODE = ["w-0.5", "w-1", "w-px", "w-0.75", "w-px", "w-1.25", "w-0.5"];

// Product card with a meta header, a big title, a description, an optional
// action and a spec list, sitting on a solid signal offset shadow.
export function SpecCard({
  title,
  titleAs: Title = "h3",
  meta,
  specs,
  action,
  className,
  children,
  ...props
}: Omit<ComponentProps<"article">, "title"> & {
  title: ReactNode;
  titleAs?: "h2" | "h3" | "h4";
  meta?: ReactNode;
  specs?: SpecRow[];
  action?: ReactNode;
}) {
  return (
    <article
      className={cn(
        "mr-2 mb-2 border-(length:--border-base) border-solid border-ink bg-ground-deep font-mono text-ink shadow-[8px_8px_0_0_var(--signal)]",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-4 border-b-(length:--border-base) border-solid border-ink px-4.5 py-2.5 text-caption tracking-label text-label">
        <span>{meta}</span>
        <span aria-hidden="true" className="flex shrink-0 gap-0.75">
          {BARCODE.map((width, i) => (
            <span key={i} className={cn("h-3.5 bg-ink", width)} />
          ))}
        </span>
      </div>
      <div className="flex flex-col gap-6 p-4.5 sm:flex-row">
        <div className="min-w-0 grow">
          <Title className="mb-2 font-display text-[2.125rem] [line-height:0.95] uppercase">
            {title}
          </Title>
          {children ? (
            <div className="mb-4 text-[0.8125rem] [line-height:1.6] text-label">{children}</div>
          ) : null}
          {action}
        </div>
        {specs && specs.length > 0 ? (
          <dl className="flex shrink-0 flex-col text-caption tracking-[0.1em] sm:w-47.5">
            {specs.map((spec, i) => (
              <div
                key={i}
                className="flex justify-between gap-4 border-b-(length:--border-hair) border-solid border-line py-1.75 last:border-b-0"
              >
                <dt className="text-label">{spec.label}</dt>
                <dd className={spec.accent ? "text-signal" : undefined}>{spec.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </article>
  );
}

// Ink-filled link with a signal offset shadow that halves on hover.
export function SpecCardAction({ className, ...props }: ComponentProps<"a">) {
  return (
    <a
      className={cn(
        "inline-flex min-h-11 items-center border-(length:--border-base) border-solid border-ink bg-ink px-4.5",
        "font-mono text-xs font-bold tracking-label text-ground-deep no-underline shadow-[4px_4px_0_0_var(--signal)]",
        "transition-[translate,box-shadow] duration-(--duration-snap) ease-step-2 motion-reduce:transition-none",
        "hover:translate-0.5 hover:shadow-[2px_2px_0_0_var(--signal)]",
        "focus-visible:outline-(length:--focus-width) focus-visible:outline-offset-4 focus-visible:outline-solid focus-visible:outline-signal",
        className,
      )}
      {...props}
    />
  );
}
