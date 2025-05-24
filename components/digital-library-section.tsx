"use client"
import BookLibrary from "./book-library"
import { ErrorBoundary } from "@/components/error-boundary"
import { useState, useEffect } from "react"

export default function DigitalLibrarySection() {
  const [libraryError, setLibraryError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("[DigitalLibrarySection] Component mounted")
    setIsLoading(false)
    return () => console.log("[DigitalLibrarySection] Component unmounted")
  }, [])

  return (
    <section
      id="digital-library"
      className="py-16 relative min-h-screen"
      style={{
        backgroundImage: `url('/vintage-wood-table-background.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Semi-transparent overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/80 to-white/70 dark:from-gray-900/70 dark:via-gray-900/80 dark:to-gray-900/70"></div>

      {/* Content container */}
      <div className="container mx-auto px-4 relative z-10">
        {/* Title area with wood table background visible */}
        <div className="text-center mb-12 py-8 rounded-lg bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
          <h2 className="text-3xl font-bold mb-4 dark:text-white text-gray-800">Digital Library</h2>
          <p className="text-gray-700 dark:text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Access our curated collection of books, articles, and resources that promote traditional values,
            constitutional principles, and a free society.
          </p>
        </div>

        {/* Library container */}
        <div className="h-[600px] md:h-[700px] border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
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
                  className="px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-700"
                >
                  Retry Loading
                </button>
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
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
