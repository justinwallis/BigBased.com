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
      <div className="bb-2025-page min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
            <p className="bb-2025-dim mt-3 text-base">
              Find answers to common questions about Big Based, our mission, and how to get involved.
            </p>
          </div>

          <FAQSection
            faqs={faqItems}
            categories={categories}
            title={null}
            description={null}
          />
        </div>
      </div>
      <StructuredData data={structuredData} />
    </>
  )
}
