import "@/app/docs/docs.css";

import { highlight } from "@/app/docs/_lib/source";

// Input is repo source or a fixed snippet, never user text, and Shiki escapes it.
export async function CodeBlock({ code, lang }: { code: string; lang?: "tsx" | "css" }) {
  const html = await highlight(code, lang);

  return (
    <div
      className="overflow-x-auto text-[0.8125rem] leading-relaxed [&_pre]:p-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
