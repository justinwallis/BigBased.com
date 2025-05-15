import type { Metadata, Viewport } from "next/types"
import { viewportConfig, generateMetadata } from "../metadata-config"

export const metadata: Metadata = generateMetadata(
  "Partners",
  "Big Based partners with freedom-minded organizations, companies, and institutions to build a parallel economy based on shared values.",
)

export const viewport: Viewport = viewportConfig

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 dark:text-white">Partners</h1>

        <p className="mb-4 dark:text-gray-200">
          Big Based partners with freedom-minded organizations, companies, and institutions to build a parallel economy
          based on shared values.
        </p>

        <p className="mb-8 dark:text-gray-200">
          This page is currently under construction. Please check back soon for more information about our partner
          network.
        </p>

        <a
          href="/"
          className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-medium inline-block hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          Back to Home
        </a>
      </div>
    </div>
  )
}
