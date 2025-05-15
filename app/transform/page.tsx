import type { Metadata, Viewport } from "next/types"
import { baseMetadata, viewportConfig } from "../metadata-config"

export const metadata: Metadata = {
  ...baseMetadata,
  title: "Transform | Big Based",
}

export const viewport: Viewport = viewportConfig

export default function TransformPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">How We Transform</h1>

        <p className="mb-4">
          Big Based is transforming the digital landscape by reclaiming sovereignty, preserving truth, and building
          alternative systems rooted in freedom.
        </p>

        <p className="mb-8">
          This page is currently under construction. Please check back soon for more information about our
          transformative approach.
        </p>

        <a
          href="/"
          className="bg-black text-white px-6 py-3 rounded-full font-medium inline-block hover:bg-gray-800 transition-colors"
        >
          Back to Home
        </a>
      </div>
    </div>
  )
}
