"use client";

import { useState, type ReactNode } from "react";

import { TerminalButton } from "@/registry/ui/terminal-button";

// Remounts its children so a one-shot animation plays again.
export function Replay({ children }: { children: ReactNode }) {
  const [run, setRun] = useState(0);

  return (
    <div className="flex w-full flex-col items-center gap-10">
      <div key={run} className="w-full">
        {children}
      </div>
      <TerminalButton onClick={() => setRun((n) => n + 1)}>replay</TerminalButton>
    </div>
  );
}
