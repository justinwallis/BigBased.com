import type { Metadata, Viewport } from "next/types"
import { viewportConfig, generateMetadata } from "../metadata-config"
import Link from "next/link"
import { getWebPageData, getBreadcrumbData } from "@/lib/structured-data"
import StructuredData from "@/components/structured-data"

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
    "https://bigbased.com/og-image.png",
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
      <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 dark:text-white">About Big Based</h1>

          <p className="mb-4 dark:text-gray-200">
            Big Based is a cultural revolution platform dedicated to reclaiming digital sovereignty, preserving truth,
            and building a parallel economy based on freedom and responsibility.
          </p>

          <p className="mb-4 dark:text-gray-200">
            Our mission is to provide tools, knowledge, and community for those seeking to break free from manipulation
            and censorship while fostering connections between freedom-minded individuals.
          </p>

          <p className="mb-8 dark:text-gray-200">
            Founded on principles of truth, faith, and freedom, Big Based offers a comprehensive library of resources,
            community connections, and practical solutions for navigating the challenges of our time.
          </p>

          <Link
            href="/"
            className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-medium inline-block hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
      <StructuredData data={structuredData} />
    </>
  )
}
