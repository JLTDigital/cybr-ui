import "@/app/docs/docs.css";

export default function ComponentDocsLayout({ children }: LayoutProps<"/docs/components">) {
  return (
    <main id="main" className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12 sm:px-10">
      {children}
    </main>
  );
}
