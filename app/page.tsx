import type { Metadata, Viewport } from "next/types"
import { baseMetadata, viewportConfig } from "./metadata-config"

// Get the base URL for absolute URLs
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com"

export const metadata: Metadata = {
  ...baseMetadata,
  title: "Big Based - Answer to Madness",
  description:
    "Big Based isn't just a platform, it's a cultural revolution. At its core lies a living library of truth, faith, and insight, 10,000+ meticulously researched pages designed to educate, inspire, and transform.",
  openGraph: {
    ...baseMetadata.openGraph,
    title: "Big Based - Answer to Madness",
    description:
      "Big Based isn't just a platform, it's a cultural revolution. At its core lies a living library of truth, faith, and insight, 10,000+ meticulously researched pages designed to educate, inspire, and transform.",
    url: baseUrl,
    images: [
      {
        url: `${baseUrl}/BigBasedPreview.png`,
        width: 1200,
        height: 630,
        alt: "Big Based - Answer to Madness",
      },
    ],
  },
  twitter: {
    ...baseMetadata.twitter,
    title: "Big Based - Answer to Madness",
    description:
      "Big Based isn't just a platform, it's a cultural revolution. At its core lies a living library of truth, faith, and insight, 10,000+ meticulously researched pages designed to educate, inspire, and transform.",
    images: [`${baseUrl}/BigBasedPreview.png`],
  },
}

export const viewport: Viewport = viewportConfig

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-6">Big Based</h1>
      <p className="text-xl">Website coming soon</p>
    </main>
  )
}
