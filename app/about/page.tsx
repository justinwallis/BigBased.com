import type { Metadata, Viewport } from "next/types"
import { viewportConfig, generateMetadata } from "../metadata-config"
import Link from "next/link"
import { getWebPageData, getBreadcrumbData } from "@/lib/structured-data"
import StructuredData from "@/components/structured-data"

// Get the base URL for absolute URLs
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com"

export const metadata: Metadata = generateMetadata(
  "About",
  "Learn about Big Based, a cultural revolution platform dedicated to reclaiming digital sovereignty, preserving truth, and building a parallel economy.",
)

export const viewport: Viewport = viewportConfig

export default function AboutPage() {
  // Structured data for the about page
  const pageStructuredData = getWebPageData(
    "About Big Based",
    "Learn about Big Based, a cultural revolution platform dedicated to reclaiming digital sovereignty, preserving truth, and building a parallel economy.",
    "/about",
    `${baseUrl}/og-image.png`,
  )

  // Breadcrumb data for the about page
  const breadcrumbData = getBreadcrumbData([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ])

  // Combine structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [pageStructuredData, breadcrumbData],
  }

  return (
    <>
      <div className="bb-2025-page bb-2025-reading-page min-h-screen px-4 py-8 sm:px-8">
        <div className="bb-2025-container max-w-4xl">
          <div className="bb-2025-panel p-5 sm:p-8">
          <h1 className="mb-6 text-2xl font-bold">About Big Based</h1>

          <p className="mb-4 bb-2025-dim">
            Big Based is a cultural revolution platform dedicated to reclaiming digital sovereignty, preserving truth,
            and building a parallel economy based on freedom and responsibility.
          </p>

          <p className="mb-4 dark:text-gray-200">
            Our mission is to provide tools, knowledge, and community for those seeking to break free from manipulation
            and censorship while fostering connections between freedom-minded individuals.
          </p>

          <p className="mb-8 bb-2025-dim">
            Founded on principles of truth, faith, and freedom, Big Based offers a comprehensive library of 10,000+
            meticulously researched pages, community connections, and practical solutions for navigating the challenges
            of our time.
          </p>

          <Link
            href="/"
            className="bb-2025-action inline-flex items-center px-4 text-sm transition-colors"
          >
            Back to Home
          </Link>
          </div>
        </div>
      </div>
      <StructuredData data={structuredData} />
    </>
  )
}
