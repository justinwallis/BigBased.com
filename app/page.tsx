import type { Metadata, Viewport } from "next/types"
import { baseMetadata, viewportConfig } from "./metadata-config"
import ClientPage from "./ClientPage"
import { getWebPageData, getBreadcrumbData } from "@/lib/structured-data"
import StructuredData from "@/components/structured-data"

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
  // Structured data for the homepage
  const pageStructuredData = getWebPageData(
    "Big Based - Answer to Madness",
    "Big Based isn't just a platform, it's a cultural revolution. At its core lies a living library of truth, faith, and insight, 10,000+ meticulously researched pages designed to educate, inspire, and transform.",
    "/",
    `${baseUrl}/BigBasedPreview.png`,
  )

  // Breadcrumb data for the homepage
  const breadcrumbData = getBreadcrumbData([{ name: "Home", path: "/" }])

  // Combine structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [pageStructuredData, breadcrumbData],
  }

  return (
    <>
      <ClientPage />
      <StructuredData data={structuredData} />
    </>
  )
}
