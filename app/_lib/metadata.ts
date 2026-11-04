import type { Metadata } from "next";

export const SITE_NAME = "CYBR//UI";

const SHARE_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "CYBR//UI: Cyberpunk Brutalism. Animated React components for Next.js and Tailwind CSS v4.",
};

// Next.js replaces a parent's `openGraph` and `twitter` objects wholesale when a
// page sets its own (inherited file-based share images included), so every page
// builds both through here to keep the shared fields and image.
export function pageMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_GB",
      title,
      description,
      images: [SHARE_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [SHARE_IMAGE] },
  };
}
