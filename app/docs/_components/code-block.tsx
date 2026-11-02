import { highlight } from "@/app/docs/_lib/source";

// Input is repo source read on the server, never user text, and Shiki escapes it.
export async function CodeBlock({ code }: { code: string }) {
  const html = await highlight(code);

  return (
    <div
      className="overflow-x-auto text-[0.8125rem] leading-relaxed [&_pre]:p-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
