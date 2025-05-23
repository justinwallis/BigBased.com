import type { Metadata, Viewport } from "next/types"
import { viewportConfig, generateMetadata } from "../metadata-config"
import { getWebPageData, getBreadcrumbData, getFAQPageData } from "@/lib/structured-data"
import StructuredData from "@/components/structured-data"
import FAQSection from "@/components/faq-section"
import { faqItems } from "@/data/faq-data"

export const metadata: Metadata = generateMetadata(
  "Frequently Asked Questions",
  "Find answers to common questions about Big Based, our mission, resources, and how to get involved.",
)

export const viewport: Viewport = viewportConfig

export default function FAQPage() {
  // Get unique categories from FAQ items
  const categories = Array.from(new Set(faqItems.map((item) => item.category))).filter(Boolean) as string[]

  // Structured data for the FAQ page
  const pageStructuredData = getWebPageData(
    "Frequently Asked Questions - Big Based",
    "Find answers to common questions about Big Based, our mission, resources, and how to get involved.",
    "/faq",
    "https://bigbased.com/og-image.png",
  )

  // FAQ structured data
  const faqStructuredData = getFAQPageData(
    faqItems.map((item) => ({
      question: item.question,
      answer: item.answer,
    })),
  )

  // Breadcrumb data
  const breadcrumbData = getBreadcrumbData([
    { name: "Home", path: "/" },
    { name: "FAQ", path: "/faq" },
  ])

  // Combine structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [pageStructuredData, faqStructuredData, breadcrumbData],
  }

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Find answers to common questions about Big Based, our mission, and how to get involved.
            </p>
          </div>

          <FAQSection
            faqs={faqItems}
            categories={categories}
            description="Browse our comprehensive FAQ by category or search for specific topics."
          />
        </div>
      </div>
      <StructuredData data={structuredData} />
    </>
  )
}
