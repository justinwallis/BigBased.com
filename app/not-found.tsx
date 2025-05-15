import Link from "next/link"
import type { Metadata, Viewport } from "next/types"
import { baseMetadata, viewportConfig } from "./metadata-config"

export const metadata: Metadata = {
  ...baseMetadata,
  title: "Page Not Found | Big Based",
  description: "The page you are looking for does not exist or has been moved.",
  robots: {
    index: false,
    follow: true,
  },
}

export const viewport: Viewport = viewportConfig

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-white dark:bg-gray-900">
      <h1 className="text-4xl font-bold mb-4 dark:text-white">404 - Page Not Found</h1>
      <p className="mb-8 text-lg dark:text-gray-200">The page you are looking for does not exist or has been moved.</p>
      <Link
        href="/"
        className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
      >
        Return Home
      </Link>
    </div>
  )
}
