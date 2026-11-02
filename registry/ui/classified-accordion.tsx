"use client";

import { Accordion } from "@base-ui/react/accordion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const headings = {
  h2: <h2 />,
  h3: <h3 />,
  h4: <h4 />,
};

// FAQ accordion on Base UI. One item open at a time by default (pass `multiple`
// to allow several), and an open item can be closed again. Panels open
// instantly, with no height animation.
export function ClassifiedAccordion({
  className,
  ...props
}: Omit<Accordion.Root.Props, "className"> & { className?: string }) {
  return <Accordion.Root className={cn("border-(length:--border-base) border-line", className)} {...props} />;
}

export function ClassifiedAccordionItem({
  id,
  question,
  headingAs = "h3",
  children,
  className,
  ...props
}: Omit<Accordion.Item.Props, "className" | "children" | "id"> & {
  value: string;
  id?: ReactNode;
  question: ReactNode;
  headingAs?: "h2" | "h3" | "h4";
  children: ReactNode;
  className?: string;
}) {
  return (
    <Accordion.Item
      className={cn("border-b-(length:--border-hair) border-line last:border-b-0", className)}
      {...props}
    >
      <Accordion.Header render={headings[headingAs]} className="m-0">
        <Accordion.Trigger className="group flex min-h-13 w-full cursor-pointer items-center justify-between gap-4 bg-transparent px-4.5 text-left font-mono text-[0.8125rem] font-bold tracking-button text-ink hover:bg-surface focus-visible:outline-(length:--focus-width) focus-visible:outline-offset-[-3px] focus-visible:outline-signal">
          <span>
            {id ? (
              <>
                <span className="text-signal group-hover:text-ink">{id}</span>{" "}
              </>
            ) : null}
            {question}
          </span>
          <span aria-hidden="true" className="text-lg leading-none">
            <span className="group-data-panel-open:hidden">+</span>
            <span className="hidden group-data-panel-open:inline">−</span>
          </span>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel className="border-t-(length:--border-hair) border-dashed border-line bg-ground-deep px-4.5 pt-0.5 pb-3.5 text-xs [line-height:1.7] text-label">
        {children}
      </Accordion.Panel>
    </Accordion.Item>
  );
}
