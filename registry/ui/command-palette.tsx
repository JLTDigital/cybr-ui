"use client";

import { Autocomplete } from "@base-ui/react/autocomplete";
import { Dialog } from "@base-ui/react/dialog";
import { useEffect, useId, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export type CommandPaletteItem = { value: string; label: string; hint?: string };
export type CommandPaletteGroup = { label: string; items: CommandPaletteItem[] };

const focus =
  "focus-visible:outline-(length:--focus-width) focus-visible:outline-offset-(--focus-offset) focus-visible:outline-solid focus-visible:outline-signal";

function ResultCount() {
  const groups = Autocomplete.useFilteredItems<CommandPaletteGroup>();
  const count = groups.reduce((sum, group) => sum + group.items.length, 0);
  return <span className="tabular-nums">{String(count).padStart(2, "0")} RESULTS</span>;
}

// ⌘K / Ctrl+K command dialog on Base UI: a Dialog holding an always-open,
// inline Autocomplete, as in Base UI's own command-palette example. Typing
// filters items by label; Enter or a click runs onSelect and closes. The
// dialog and its input unmount on close, so the query starts empty each time.
// Nothing animates.
export function CommandPalette({
  groups,
  onSelect,
  open,
  defaultOpen = false,
  onOpenChange,
  shortcut = true,
  shortcutLabel = "⌘K",
  trigger,
  label = "Command palette",
  placeholder = "Type a command…",
  className,
}: {
  groups: CommandPaletteGroup[];
  onSelect: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  shortcut?: boolean;
  shortcutLabel?: string;
  trigger?: ReactNode | false;
  label?: string;
  placeholder?: string;
  className?: string;
}) {
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const isOpen = open ?? innerOpen;
  const instructionsId = useId();

  const setOpen = (next: boolean) => {
    if (open === undefined) setInnerOpen(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (!shortcut) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.isComposing || event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      if (open === undefined) setInnerOpen(!isOpen);
      onOpenChange?.(!isOpen);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [shortcut, isOpen, open, onOpenChange]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      {trigger !== false && (
        <Dialog.Trigger
          className={cn(
            "inline-flex min-h-11 cursor-pointer items-center gap-3 border-(length:--border-base) border-line bg-ground-deep pr-1.5 pl-4 font-mono text-xs font-bold tracking-label text-ink hover:border-ink",
            focus,
            className,
          )}
        >
          {trigger ?? "SEARCH"}
          <kbd className="border-(length:--border-hair) border-line bg-ground-void px-2 py-1 font-mono text-caption font-normal text-label">
            {shortcutLabel}
          </kbd>
        </Dialog.Trigger>
      )}
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-ground-void/80" />
        <Dialog.Viewport className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[15vh]">
          <Dialog.Popup
            aria-label={label}
            className="flex w-full max-w-160 flex-col border-(length:--border-base) border-line bg-ground-deep font-mono text-ink shadow-hard outline-none"
          >
            <Autocomplete.Root open inline items={groups} autoHighlight="always" keepHighlight>
              <Autocomplete.InputGroup className="flex items-center gap-3 border-b-(length:--border-base) border-line px-4">
                <span aria-hidden="true" className="text-signal">
                  &gt;
                </span>
                <Autocomplete.Input
                  aria-label="Search commands"
                  aria-describedby={instructionsId}
                  placeholder={placeholder}
                  className="h-13 min-w-0 flex-1 border-0 bg-transparent font-mono text-sm text-ink caret-signal outline-none placeholder:text-label"
                />
              </Autocomplete.InputGroup>
              <Dialog.Close className="sr-only">Close</Dialog.Close>
              <div className="max-h-[min(60dvh,24rem)] overflow-y-auto overscroll-contain">
                <Autocomplete.Empty>
                  <p className="m-0 px-4 py-8 text-center text-xs tracking-label text-label">NO MATCH // 0 RESULTS</p>
                </Autocomplete.Empty>
                <Autocomplete.List className="py-1">
                  {(group: CommandPaletteGroup) => (
                    <Autocomplete.Group key={group.label} items={group.items} className="pb-1">
                      <Autocomplete.GroupLabel className="px-4 pt-3 pb-1.5 text-micro tracking-label text-label">
                        {"// "}
                        {group.label}
                      </Autocomplete.GroupLabel>
                      <Autocomplete.Collection>
                        {(entry: CommandPaletteItem) => (
                          <Autocomplete.Item
                            key={entry.value}
                            value={entry}
                            onClick={() => {
                              onSelect(entry.value);
                              setOpen(false);
                            }}
                            className="flex min-h-10 cursor-pointer items-center justify-between gap-4 px-4 text-[0.8125rem] text-ink data-highlighted:bg-signal data-highlighted:text-ground-deep"
                          >
                            <span>{entry.label}</span>
                            {entry.hint && (
                              <span className="text-caption tracking-label text-label in-data-highlighted:text-ground-deep">
                                {entry.hint}
                              </span>
                            )}
                          </Autocomplete.Item>
                        )}
                      </Autocomplete.Collection>
                    </Autocomplete.Group>
                  )}
                </Autocomplete.List>
              </div>
              <div className="flex items-center justify-between gap-4 border-t-(length:--border-base) border-line bg-ground-void px-4 py-2 text-micro tracking-label text-label">
                <span aria-hidden="true">↑↓ NAVIGATE · ↵ RUN · ESC CLOSE</span>
                <span id={instructionsId} className="sr-only">
                  Use the up and down arrows to move through commands, Enter to run one and Escape to close.
                </span>
                <ResultCount />
              </div>
            </Autocomplete.Root>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
