import type { Metadata, Viewport } from "next/types"
import { viewportConfig, generateMetadata } from "../metadata-config"

export const metadata: Metadata = generateMetadata(
  "Transform",
  "Discover how Big Based is transforming the digital landscape by reclaiming sovereignty, preserving truth, and building alternative systems rooted in freedom.",
)

export const viewport: Viewport = viewportConfig

export default function TransformPage() {
  return (
    <div className="bb-2025-page min-h-screen p-8">
      <div className="bb-2025-panel max-w-4xl mx-auto p-5 sm:p-8">
        <h1 className="mb-6 text-2xl font-bold">How We Transform</h1>

        <p className="mb-4 dark:text-gray-200">
          Big Based is transforming the digital landscape by reclaiming sovereignty, preserving truth, and building
          alternative systems rooted in freedom.
        </p>

        <p className="mb-8 dark:text-gray-200">
          This page is currently under construction. Please check back soon for more information about our
          transformative approach.
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
