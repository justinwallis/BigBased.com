import type { Metadata, Viewport } from "next/types"
import { viewportConfig, generateMetadata } from "../metadata-config"

export const metadata: Metadata = generateMetadata(
  "Contact",
  "Get in touch with Big Based. Whether you have questions, feedback, or want to join our movement, we'd love to hear from you.",
)

export const viewport: Viewport = viewportConfig

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 dark:text-white">Contact Us</h1>

        <p className="mb-4 dark:text-gray-200">
          We'd love to hear from you. Whether you have questions, feedback, or want to join our movement, please don't
          hesitate to reach out.
        </p>

        <p className="mb-8 dark:text-gray-200">
          This page is currently under construction. Please check back soon for our contact form and information.
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
