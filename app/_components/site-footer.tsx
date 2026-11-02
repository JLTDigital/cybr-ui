import { THEMES } from "@/app/_lib/themes";
import { CATALOG, CATALOG_ITEMS } from "@/app/docs/_lib/catalog";
import { MonolithFooter } from "@/registry/ui/monolith-footer";

export function SiteFooter() {
  return (
    <MonolithFooter
      className="mt-auto"
      columns={[
        {
          heading: "SETS",
          items: CATALOG.map((set) => ({ label: set.label.toUpperCase(), href: `/docs/components#${set.id}` })),
        },
        {
          heading: "DOCS",
          items: [
            { label: "COMPONENTS", href: "/docs/components" },
            { label: "INSTALL", href: "/#install" },
          ],
        },
        {
          heading: "SYSTEM",
          items: [
            { text: `UNITS: ${CATALOG_ITEMS.length}` },
            { text: `PRESETS: ${THEMES.length}` },
            { text: "REV 0.1 · SYS:OK" },
          ],
        },
      ]}
    />
  );
}
