import type { Metadata, Viewport } from "next/types"
import { baseMetadata, viewportConfig } from "./metadata-config"
import ClientPage from "./ClientPage"
import { getWebPageData, getBreadcrumbData } from "@/lib/structured-data"
import StructuredData from "@/components/structured-data"

export const metadata: Metadata = {
  ...baseMetadata,
  title: "Big Based - Answer to Madness",
  description:
    "Big Based isn't just a platform, it's a cultural revolution. At its core lies a living library of truth, faith, and insight, 6000 meticulously researched pages designed to educate, inspire, and transform.",
  openGraph: {
    ...baseMetadata.openGraph,
    title: "Big Based - Answer to Madness",
    description:
      "Big Based isn't just a platform, it's a cultural revolution. At its core lies a living library of truth, faith, and insight, 6000 meticulously researched pages designed to educate, inspire, and transform.",
  },
  twitter: {
    ...baseMetadata.twitter,
    title: "Big Based - Answer to Madness",
    description:
      "Big Based isn't just a platform, it's a cultural revolution. At its core lies a living library of truth, faith, and insight, 6000 meticulously researched pages designed to educate, inspire, and transform.",
  },
}

export const viewport: Viewport = viewportConfig

export default function Home() {
  // Structured data for the homepage
  const pageStructuredData = getWebPageData(
    "Big Based - Answer to Madness",
    "Big Based isn't just a platform, it's a cultural revolution. At its core lies a living library of truth, faith, and insight, 6000 meticulously researched pages designed to educate, inspire, and transform.",
    "/",
    "https://bigbased.com/og-image.png",
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
