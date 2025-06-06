import type { Metadata, Viewport } from "next/types"
import { baseMetadata, viewportConfig } from "./metadata-config"
import ClientPage from "./ClientPage"
import BasedBookLanding from "@/components/basedbook-landing"
import { getWebPageData, getBreadcrumbData } from "@/lib/structured-data"
import StructuredData from "@/components/structured-data"
import { siteConfig } from "@/lib/site-config"

// Get the base URL for absolute URLs
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com"

export const metadata: Metadata = {
  ...baseMetadata,
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
  openGraph: {
    ...baseMetadata.openGraph,
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    url: baseUrl,
    images: [
      {
        url: `${baseUrl}${siteConfig.seo.ogImage}`,
        width: 1200,
        height: 630,
        alt: siteConfig.seo.title,
      },
    ],
  },
  twitter: {
    ...baseMetadata.twitter,
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: [`${baseUrl}${siteConfig.seo.ogImage}`],
  },
}

export const viewport: Viewport = viewportConfig

export default function Home() {
  // Structured data for the homepage
  const pageStructuredData = getWebPageData(
    siteConfig.seo.title,
    siteConfig.seo.description,
    "/",
    `${baseUrl}${siteConfig.seo.ogImage}`,
  )

  // Breadcrumb data for the homepage
  const breadcrumbData = getBreadcrumbData([{ name: "Home", path: "/" }])

  // Combine structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [pageStructuredData, breadcrumbData],
  }

  // Conditional rendering based on site
  if (siteConfig.isBasedBook) {
    return (
      <>
        <BasedBookLanding />
        <StructuredData data={structuredData} />
      </>
    )
  }

  // Default to Big Based
  return (
    <>
      <ClientPage />
      <StructuredData data={structuredData} />
    </>
  )
}
