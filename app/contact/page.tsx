import type { Metadata, Viewport } from "next/types"
import { viewportConfig, generateMetadata } from "../metadata-config"

export const metadata: Metadata = generateMetadata(
  "Contact",
  "Get in touch with Big Based. Whether you have questions, feedback, or want to join our movement, we'd love to hear from you.",
)

export const viewport: Viewport = viewportConfig

export default function ContactPage() {
  return (
    <div className="bb-2025-page bb-2025-reading-page min-h-screen px-4 py-8 sm:px-8">
      <div className="bb-2025-panel max-w-4xl mx-auto p-5 sm:p-8">
        <h1 className="mb-6 text-2xl font-bold">Contact Us</h1>

        <p className="mb-4 bb-2025-dim">
          We'd love to hear from you. Whether you have questions, feedback, or want to join our movement, please don't
          hesitate to reach out.
        </p>

        <p className="mb-8 bb-2025-dim">
          This page is currently under construction. Please check back soon for our contact form and information.
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
