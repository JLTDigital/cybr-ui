import Link from "next/link";

import "@/app/docs/docs.css";

export default function ComponentDocsLayout({ children }: LayoutProps<"/docs/components">) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between gap-4 border-b-(length:--border-base) border-line bg-ground-deep px-6 py-3 sm:px-10">
        <Link
          href="/"
          className="text-xs tracking-label uppercase text-ink focus-visible:outline-(length:--focus-width) focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-signal"
        >
          CYBR<span className="text-signal">{"//"}</span>UI · DOCS
        </Link>
        <span className="text-micro tracking-label uppercase text-label">COMPONENTS · SYS:OK</span>
      </header>
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12 sm:px-10">
        {children}
      </main>
    </div>
  );
}
