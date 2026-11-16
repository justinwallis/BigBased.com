import type { Metadata, Viewport } from "next/types"
import { viewportConfig, generateMetadata } from "../metadata-config"

export const metadata: Metadata = generateMetadata(
  "Partners",
  "Big Based partners with freedom-minded organizations, companies, and institutions to build a parallel economy based on shared values.",
)

export const viewport: Viewport = viewportConfig

export default function PartnersPage() {
  return (
    <div className="bb-2025-page min-h-screen px-4 py-8 sm:px-8">
      <div className="bb-2025-panel max-w-4xl mx-auto p-5 sm:p-8">
        <h1 className="mb-6 text-2xl font-bold">Partners</h1>

        <p className="mb-4 bb-2025-dim">
          Big Based partners with freedom-minded organizations, companies, and institutions to build a parallel economy
          based on shared values.
        </p>

        <p className="mb-8 bb-2025-dim">
          This page is currently under construction. Please check back soon for more information about our partner
          network.
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
