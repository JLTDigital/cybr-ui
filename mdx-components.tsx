import type { MDXComponents } from "mdx/types";

// Token-styled prose for docs pages. Required by @next/mdx in the App Router.
const components: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-6 border-b-(length:--border-base) border-line pb-3 text-xs tracking-label uppercase text-label"
      {...props}
    />
  ),
  h3: (props) => (
    <h3 className="mt-4 text-sm tracking-button uppercase text-ink" {...props} />
  ),
  p: (props) => <p className="max-w-prose text-sm leading-relaxed text-ink" {...props} />,
  ul: (props) => (
    <ul
      className="flex max-w-prose list-['//_'] flex-col gap-2 pl-6 text-sm leading-relaxed text-ink marker:text-signal"
      {...props}
    />
  ),
  li: (props) => <li className="pl-1" {...props} />,
  a: (props) => (
    <a
      className="text-signal underline underline-offset-4 focus-visible:outline-(length:--focus-width) focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-signal"
      {...props}
    />
  ),
  code: (props) => (
    <code className="bg-surface px-1.5 py-0.5 text-[0.8125rem] text-ink" {...props} />
  ),
  pre: (props) => (
    <pre
      className="overflow-x-auto border-(length:--border-base) border-line bg-ground-void p-4 text-[0.8125rem] leading-relaxed text-ink [&_code]:bg-transparent [&_code]:p-0"
      {...props}
    />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
