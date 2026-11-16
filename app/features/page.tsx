import type { Metadata, Viewport } from "next/types"
import { viewportConfig, generateMetadata } from "../metadata-config"

export const metadata: Metadata = generateMetadata(
  "Features",
  "Explore the comprehensive suite of features designed to empower freedom-minded individuals and organizations.",
)

export const viewport: Viewport = viewportConfig

export default function FeaturesPage() {
  return (
    <div className="bb-2025-page min-h-screen px-4 py-8 sm:px-8">
      <div className="bb-2025-panel max-w-4xl mx-auto p-5 sm:p-8">
        <h1 className="mb-6 text-2xl font-bold">Features</h1>

        <p className="mb-4 bb-2025-dim">
          Big Based offers a comprehensive suite of features designed to empower freedom-minded individuals and
          organizations.
        </p>

        <p className="mb-8 bb-2025-dim">
          This page is currently under construction. Please check back soon for more information about our feature
          offerings.
        </p>

        <a
          href="/"
          className="bb-2025-action inline-flex items-center px-4 text-sm transition-colors"
        >
          Back to Home
        </a>
      </div>
    </div>
  )
}
