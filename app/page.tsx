// Temporary token specimen; Feature 13 replaces it with the real landing page.

const colors = [
  { token: "--bg", swatch: "bg-bg", use: "Base canvas" },
  { token: "--surface", swatch: "bg-surface", use: "Panels, cards" },
  { token: "--line", swatch: "bg-line", use: "Borders, decoration only" },
  { token: "--muted", swatch: "bg-muted", use: "Large secondary UI only" },
  { token: "--signal", swatch: "bg-signal", use: "The one accent" },
  { token: "--ink", swatch: "bg-ink", use: "Body text" },
  { token: "--label", swatch: "bg-label", use: "Small mono labels" },
  { token: "--ground-deep", swatch: "bg-ground-deep", use: "Insets, text on accent" },
  { token: "--ground-void", swatch: "bg-ground-void", use: "Terminals, frames" },
  { token: "--neon-2", swatch: "bg-neon-2", use: "Provisional second accent" },
];

const displaySizes = [
  { name: "display-xl", className: "text-display-xl" },
  { name: "display-lg", className: "text-display-lg" },
  { name: "display-md", className: "text-display-md" },
];

const monoSizes = [
  { name: "micro / 10px", className: "text-micro" },
  { name: "caption / 11px", className: "text-caption" },
  { name: "xs / 12px", className: "text-xs" },
  { name: "sm / 14px", className: "text-sm" },
  { name: "base / 16px", className: "text-base" },
];

const borders = [
  { token: "--border-hair", className: "border-(length:--border-hair)" },
  { token: "--border-base", className: "border-(length:--border-base)" },
  { token: "--border-heavy", className: "border-(length:--border-heavy)" },
  { token: "--border-max", className: "border-(length:--border-max)" },
];

const shadows = [
  { name: "idle / shadow-hard", className: "shadow-hard" },
  {
    name: "hover / shadow-hard-hover",
    className: "shadow-hard-hover translate-x-(--offset-hard-hover) translate-y-(--offset-hard-hover)",
  },
  {
    name: "pressed / no shadow",
    className: "shadow-none translate-x-(--offset-hard) translate-y-(--offset-hard)",
  },
];

const motion = [
  "--duration-snap 90ms",
  "--duration-fast 120ms",
  "--duration-base 200ms",
  "--duration-slow 300ms",
  "ease-step-2 steps(2)",
  "ease-step-3 steps(3)",
  "ease-step-12 steps(12)",
];

function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <h2 className="text-xs tracking-label uppercase text-label">
      <span className="text-signal">{index}</span> / {title}
    </h2>
  );
}

export default function Home() {
  return (
    <main className="flex flex-col gap-16 px-6 py-12 sm:px-10">
      <header className="flex flex-col gap-4 border-b-(length:--border-base) border-line pb-10">
        <p className="text-xs tracking-label uppercase text-label">
          CYBR//UI · TOKENS · REV 0.1 · SYS:OK
        </p>
        <h1 className="font-display text-display-xl uppercase">
          Tokens<span className="text-signal">_</span>
        </h1>
      </header>

      <section className="flex flex-col gap-6">
        <SectionLabel index="01" title="Colour" />
        <ul className="grid grid-cols-2 gap-px bg-line sm:grid-cols-5">
          {colors.map(({ token, swatch, use }) => (
            <li key={token} className="flex flex-col gap-3 bg-bg p-4">
              <div className={`h-16 border-(length:--border-hair) border-line ${swatch}`} />
              <span className="text-xs text-ink">{token}</span>
              <span className="text-caption text-label">{use}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-6">
        <SectionLabel index="02" title="Display" />
        {displaySizes.map(({ name, className }) => (
          <div key={name} className="flex flex-col gap-2">
            <span className="text-caption tracking-label uppercase text-label">{name}</span>
            <p className={`font-display uppercase ${className}`}>
              Signal<span className="text-signal">_</span>
            </p>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-6">
        <SectionLabel index="03" title="Mono" />
        {monoSizes.map(({ name, className }) => (
          <p key={name} className={`tracking-button uppercase ${className}`}>
            {name} · Unit / D-01 · Rev 2.6
          </p>
        ))}
      </section>

      <section className="flex flex-col gap-6">
        <SectionLabel index="04" title="Borders" />
        <div className="flex flex-wrap gap-6">
          {borders.map(({ token, className }) => (
            <div key={token} className={`border-ink px-6 py-4 text-xs ${className}`}>
              {token}
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <SectionLabel index="05" title="Hard shadow" />
        <div className="flex flex-wrap gap-10">
          {shadows.map(({ name, className }) => (
            <div
              key={name}
              className={`border-(length:--border-heavy) border-ink bg-signal px-6 py-4 text-xs tracking-button uppercase text-ground-deep ${className}`}
            >
              {name}
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <SectionLabel index="06" title="Motion" />
        <ul className="flex flex-col gap-2 text-sm">
          {motion.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
