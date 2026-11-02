"use client";

import { useEffect, useId, useRef, useState, type ComponentProps, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export type TerminalNavbarLink = { label: string; href: string; current?: boolean };

const focus =
  "focus-visible:outline-(length:--focus-width) focus-visible:outline-offset-[-3px] focus-visible:outline-solid focus-visible:outline-signal";

// Primary nav bar: display wordmark, mono links split by rules, and an actions
// slot on the right. The current link shows as [ LABEL ] in --signal; the
// brackets are aria-hidden so its name stays LABEL. `children` renders after
// the links, for extra triggers such as a mega menu.
//
// The nav is a container: below @3xl (48rem) of its own width, the links,
// children and actions fold into a panel under the bar, opened by a MENU
// disclosure button. They render once and reflow, so nothing is duplicated.
export function TerminalNavbar({
  brand,
  brandHref = "/",
  links,
  actions,
  children,
  "aria-label": ariaLabel = "Primary",
  className,
  onKeyDown,
  onPointerDown,
  ...props
}: ComponentProps<"nav"> & {
  brand?: ReactNode;
  brandHref?: string;
  links: TerminalNavbarLink[];
  actions?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const navRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  // Set by React's pointerdown, which also bubbles out of portaled children
  // such as a mega menu popup, so presses there do not count as outside.
  const pressedInside = useRef(false);

  useEffect(() => {
    if (!open) return;
    const onDocumentPointerDown = () => {
      if (!pressedInside.current) setOpen(false);
      pressedInside.current = false;
    };
    document.addEventListener("pointerdown", onDocumentPointerDown);
    return () => document.removeEventListener("pointerdown", onDocumentPointerDown);
  }, [open]);

  return (
    <nav
      ref={navRef}
      aria-label={ariaLabel}
      className={cn("@container relative flex h-15.5 w-full items-stretch bg-ground-deep font-mono", className)}
      onPointerDown={(event) => {
        pressedInside.current = true;
        onPointerDown?.(event);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        // Only for keys pressed in the nav's own DOM, not in a portaled popup,
        // which handles its own Escape.
        if (open && event.key === "Escape" && navRef.current?.contains(event.target as Node)) {
          setOpen(false);
          buttonRef.current?.focus();
        }
      }}
      {...props}
    >
      <a
        href={brandHref}
        className={cn(
          "flex shrink-0 items-center px-4 font-display text-[1.375rem] tracking-[0.02em] whitespace-nowrap text-ink @xs:px-6 @3xl:px-10",
          focus,
        )}
      >
        {brand ?? (
          <>
            CYBR<span className="text-signal">{"//"}</span>UI
          </>
        )}
      </a>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "ml-auto flex cursor-pointer items-center gap-3 border-0 border-l-(length:--border-base) border-line bg-transparent px-4 text-[0.8125rem] font-bold tracking-label text-ink hover:bg-bg aria-expanded:bg-bg @3xl:hidden",
          focus,
        )}
      >
        <span aria-hidden="true" className="relative block h-3 w-4.5">
          <span className={cn("absolute inset-x-0 top-0 h-0.5 bg-current", open && "top-1.25 rotate-45")} />
          <span className={cn("absolute inset-x-0 top-1.25 h-0.5 bg-current", open && "hidden")} />
          <span className={cn("absolute inset-x-0 bottom-0 h-0.5 bg-current", open && "bottom-1.25 -rotate-45")} />
        </span>
        {/* The word hides under @xs (20rem) to fit; it stays the button's name. */}
        <span className="sr-only @xs:not-sr-only">MENU</span>
      </button>
      <div
        id={panelId}
        onClick={(event) => {
          if ((event.target as Element).closest("a")) setOpen(false);
        }}
        className={cn(
          "absolute inset-x-0 top-full z-40 hidden flex-col border-y-(length:--border-base) border-line bg-ground-deep",
          "@3xl:static @3xl:z-auto @3xl:flex @3xl:min-w-0 @3xl:flex-1 @3xl:flex-row @3xl:border-0",
          open && "flex",
        )}
      >
        <div className="flex flex-col @3xl:min-w-0 @3xl:flex-1 @3xl:flex-row @3xl:overflow-x-auto @3xl:[scrollbar-width:none]">
          <ul className="m-0 flex list-none flex-col p-0 @3xl:flex-row">
            {links.map((link) => (
              <li key={link.href} className="flex">
                <a
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  className={cn(
                    "flex min-h-12 w-full items-center border-b-(length:--border-hair) border-line px-6 text-[0.8125rem] font-bold tracking-label whitespace-nowrap hover:bg-bg hover:text-ink",
                    "@3xl:min-h-0 @3xl:border-b-0 @3xl:border-l-(length:--border-base) @3xl:px-5",
                    link.current ? "text-signal" : "text-label",
                    focus,
                  )}
                >
                  {link.current && <span aria-hidden="true">[&nbsp;</span>}
                  {link.label}
                  {link.current && <span aria-hidden="true">&nbsp;]</span>}
                </a>
              </li>
            ))}
          </ul>
          {children}
        </div>
        {actions && <div className="flex min-h-12 items-stretch @3xl:shrink-0">{actions}</div>}
      </div>
    </nav>
  );
}

// Solid --signal call to action for the actions slot. Hover and focus turn it
// --ink so the --signal focus outline stays visible.
export function TerminalNavbarCta({ className, ...props }: ComponentProps<"a">) {
  return (
    <a
      className={cn(
        "flex grow items-center border-l-(length:--border-base) border-ground-deep bg-signal px-6 text-[0.8125rem] font-bold tracking-label whitespace-nowrap text-ground-deep hover:bg-ink focus-visible:bg-ink @3xl:grow-0",
        focus,
        className,
      )}
      {...props}
    />
  );
}
