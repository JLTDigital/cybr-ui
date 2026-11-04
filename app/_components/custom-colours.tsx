import { CodeBlock } from "@/app/docs/_components/code-block";
import { CopyButton } from "@/app/docs/_components/copy-button";

const EXAMPLE = `/* styles/my-theme.css: import after cybr-tokens.css */
[data-theme="synthwave"] {
  --bg: #1a1033;
  --surface: #2a1a4d;
  --line: #4a3a6d;
  --dim: #7a6a9d;
  --signal: #ff2bd6;
  --ink: #fdf4ff;
  --label: #c9b8e8;
  --ground-deep: #0f0820;
  --ground-void: #080410;
  --neon-2: #2bf0ff;
}`;

const TOKENS = [
  { name: "bg", use: "Page background." },
  { name: "surface", use: "Raised, hover and disabled fills." },
  { name: "line", use: "Borders and grid lines. Decoration only." },
  { name: "dim", use: "Disabled and low-emphasis marks." },
  { name: "signal", use: "Main accent: buttons, highlights, focus rings." },
  { name: "ink", use: "Main text and hard offset shadows." },
  { name: "label", use: "Secondary text and captions." },
  { name: "ground-deep", use: "Dark panels, and text on top of --signal." },
  { name: "ground-void", use: "Darkest wells: code boxes and terminals." },
  { name: "neon-2", use: "Second accent: glitch split and code highlighting." },
];

const CONTRAST = [
  { pair: "--ink and --label on --bg", min: "4.5:1" },
  { pair: "--signal on --bg (accent text)", min: "4.5:1" },
  { pair: "--ground-deep on --signal (button labels)", min: "4.5:1" },
  { pair: "--signal on --surface, --dim on --bg", min: "3:1" },
];

const CELL = "border-t-(length:--border-hair) border-line px-4 py-3 align-top";
const text = "m-0 max-w-prose text-sm leading-relaxed text-ink";
const code = "whitespace-nowrap text-signal";

// Keeps token names such as --ground-deep on one line; browsers otherwise break at the hyphens.
function WithTokens({ text }: { text: string }) {
  return text.split(/(--[a-z0-9-]+)/).map((part, i) =>
    part.startsWith("--") ? (
      <code key={i} className="whitespace-nowrap">
        {part}
      </code>
    ) : (
      part
    ),
  );
}

export function CustomColours() {
  return (
    <>
      <p className={text}>
        Every colour is one of ten CSS variables in <code className={code}>styles/cybr-tokens.css</code>. Edit the
        values under <code className={code}>:root</code> to change the default palette, or add a preset of your own
        next to it:
      </p>

      <div className="flex flex-col border-(length:--border-base) border-line bg-ground-void">
        <div className="flex justify-end border-b-(length:--border-hair) border-line p-2">
          <CopyButton text={EXAMPLE} label="Copy theme example" />
        </div>
        <CodeBlock code={EXAMPLE} lang="css" />
      </div>

      <p className={text}>
        Then set <code className={code}>data-theme=&quot;synthwave&quot;</code> on{" "}
        <code className={code}>&lt;html&gt;</code>, or on any element to theme only that section. Variables you leave
        out fall back to the defaults, so a preset can be as small as one <code className={code}>--signal</code>.
      </p>

      <div className="overflow-x-auto border-(length:--border-base) border-line">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">Colour tokens and what they control</caption>
          <thead className="bg-ground-deep text-caption tracking-label uppercase text-label">
            <tr>
              <th scope="col" className="px-4 py-2 font-normal">Token</th>
              <th scope="col" className="px-4 py-2 font-normal">Used for</th>
            </tr>
          </thead>
          <tbody className="bg-bg">
            {TOKENS.map((token) => (
              <tr key={token.name}>
                <td className={`${CELL} whitespace-nowrap`}>
                  <span className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="size-4 shrink-0 border-(length:--border-hair) border-ink"
                      style={{ background: `var(--${token.name})` }}
                    />
                    <code className={code}>--{token.name}</code>
                  </span>
                </td>
                <td className={`${CELL} text-ink`}>
                  <WithTokens text={token.use} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3">
        <p className={text}>
          Check contrast before you ship a palette. These are the WCAG AA minimums the built-in presets meet:
        </p>
        <ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm text-ink">
          {CONTRAST.map((row) => (
            <li key={row.pair} className="grid grid-cols-[3.5rem_1fr] gap-x-3">
              <span className="text-signal">{row.min}</span>
              <span>
                <WithTokens text={row.pair} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
