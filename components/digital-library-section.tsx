"use client"
import BookLibrary from "./book-library"
import { ErrorBoundary } from "@/components/error-boundary"
import { useState, useEffect } from "react"
import WoodenTableBackground from "./wooden-table-background"

export default function DigitalLibrarySection() {
  const [libraryError, setLibraryError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("[DigitalLibrarySection] Component mounted")
    setIsLoading(false)
    return () => console.log("[DigitalLibrarySection] Component unmounted")
  }, [])

  return (
    <section id="digital-library" className="py-16 bg-amber-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Wooden table background */}
      <WoodenTableBackground />

      {/* Content container */}
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-8 text-amber-900 dark:text-amber-100 drop-shadow-sm">
          Digital Library
        </h2>
        <p className="text-center text-amber-800 dark:text-amber-200 mb-12 max-w-3xl mx-auto drop-shadow-sm">
          Access our curated collection of books, articles, and resources that promote traditional values,
          constitutional principles, and a free society.
        </p>

        <div className="h-[600px] md:h-[700px] border border-amber-200 dark:border-amber-700 rounded-lg shadow-2xl overflow-hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
          {libraryError ? (
            <div className="flex items-center justify-center h-full bg-red-50 dark:bg-red-900/20 p-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Error Loading Library</h3>
                <p className="text-red-500 dark:text-red-300 mb-4">{libraryError.message}</p>
                <button
                  onClick={() => {
                    console.log("[DigitalLibrarySection] Retrying library load")
                    setLibraryError(null)
                    setIsLoading(true)
                    setTimeout(() => setIsLoading(false), 500)
                  }}
                  className="px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
                >
                  Retry Loading
                </button>
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 dark:border-amber-400"></div>
            </div>
          ) : (
            <ErrorBoundary
              fallback={(error) => {
                console.error("[DigitalLibrarySection] Error in BookLibrary:", error)
                setLibraryError(error)
                return null
              }}
            >
              <BookLibrary />
            </ErrorBoundary>
          )}
        </div>
      </div>
    </section>
  )
}
