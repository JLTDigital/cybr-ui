import type { Metadata } from "next";
import { Archivo_Black, JetBrains_Mono } from "next/font/google";
import { SiteFooter } from "@/app/_components/site-footer";
import { SiteHeader } from "@/app/_components/site-header";
import { pageMetadata, SITE_NAME } from "@/app/_lib/metadata";
import { themeInitScript } from "@/app/_lib/themes";
import { CATALOG } from "@/app/docs/_lib/catalog";
import { getRegistryOrigin } from "@/app/docs/_lib/registry";

import "./globals.css";

const archivoBlack = Archivo_Black({
  weight: "400",
  variable: "--font-archivo-black",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteMetadata = pageMetadata(
  SITE_NAME,
  "Animated React components in a Cyberpunk Brutalism design language.",
);

export const metadata: Metadata = {
  ...siteMetadata,
  metadataBase: new URL(getRegistryOrigin()),
  openGraph: { ...siteMetadata.openGraph, url: "/" },
};

const searchGroups = CATALOG.map((set) => ({
  label: set.label.toUpperCase(),
  items: set.items.map((item) => ({ value: item.name, label: item.title, hint: item.code })),
}));

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivoBlack.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-ink font-mono">
        <SiteHeader searchGroups={searchGroups} />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
