export type PropRow = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

const CELL = "border-t-(length:--border-hair) border-line px-4 py-3 align-top";

export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <section aria-labelledby="props-heading" className="flex flex-col gap-4">
      <h2 id="props-heading" className="text-xs tracking-label uppercase text-label">
        Props
      </h2>
      <div className="overflow-x-auto border-(length:--border-base) border-line">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">Component props</caption>
          <thead className="bg-ground-deep text-caption tracking-label uppercase text-label">
            <tr>
              <th scope="col" className="px-4 py-2 font-normal">Prop</th>
              <th scope="col" className="px-4 py-2 font-normal">Type</th>
              <th scope="col" className="px-4 py-2 font-normal">Default</th>
              <th scope="col" className="px-4 py-2 font-normal">Description</th>
            </tr>
          </thead>
          <tbody className="bg-bg">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className={`${CELL} text-caption tracking-label uppercase text-label`}>
                  NO PROPS / NATIVE ATTRIBUTES ONLY
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.name}>
                  <td className={`${CELL} whitespace-nowrap text-signal`}>{row.name}</td>
                  <td className={`${CELL} text-xs text-label`}>
                    <code>{row.type}</code>
                  </td>
                  <td className={`${CELL} text-xs text-ink`}>
                    {row.default ? <code>{row.default}</code> : "—"}
                  </td>
                  <td className={`${CELL} text-ink`}>{row.description}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
