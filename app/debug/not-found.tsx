import Link from "next/link"
import type { Metadata } from "next"

// Add static metadata to prevent build errors
export const metadata: Metadata = {
  title: "Debug Page Not Found | Big Based",
  description: "The debug page you are looking for does not exist or has been moved.",
}

export default function DebugNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-white dark:bg-gray-900">
      <h1 className="text-4xl font-bold mb-4 dark:text-white">404 - Debug Page Not Found</h1>
      <p className="mb-8 text-lg dark:text-gray-200">
        The debug page you are looking for does not exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/debug"
          className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          Return to Debug
        </Link>
        <Link
          href="/"
          className="px-6 py-3 bg-transparent border border-black dark:border-white text-black dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
