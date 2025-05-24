"use client"
import BookLibrary from "./book-library"
import { ErrorBoundary } from "@/components/error-boundary"
import { useState, useEffect } from "react"

export default function DigitalLibrarySection() {
  const [libraryError, setLibraryError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    console.log("[DigitalLibrarySection] Component mounted")
    setIsLoading(false)

    // Test if image loads
    const img = new Image()
    img.onload = () => {
      console.log("Wood table image loaded successfully")
      setImageLoaded(true)
    }
    img.onerror = () => {
      console.log("Wood table image failed to load")
      setImageLoaded(false)
    }
    img.src = "/wood-table.png"

    return () => console.log("[DigitalLibrarySection] Component unmounted")
  }, [])

  return (
    <section
      id="digital-library"
      className="py-16 relative min-h-screen"
      style={{
        // Multiple background approaches for debugging
        backgroundImage: imageLoaded
          ? `url('/wood-table.png')`
          : `linear-gradient(45deg, #8B4513 25%, #A0522D 25%, #A0522D 50%, #8B4513 50%, #8B4513 75%, #A0522D 75%, #A0522D)`,
        backgroundSize: imageLoaded ? "cover" : "20px 20px",
        backgroundPosition: "center",
        backgroundRepeat: imageLoaded ? "no-repeat" : "repeat",
        backgroundColor: "#D2B48C", // Tan fallback color
      }}
    >
      {/* Debug info - remove this later */}
      <div className="absolute top-4 right-4 bg-black/80 text-white p-2 rounded text-xs z-50">
        Image loaded: {imageLoaded ? "✅" : "❌"}
      </div>

      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60"></div>

      {/* Content container */}
      <div className="container mx-auto px-4 relative z-10">
        {/* Title area */}
        <div className="text-center mb-12 py-8 rounded-lg bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-white/30 dark:border-gray-700/30">
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

        {/* Bottom wood table area */}
        <div
          className="mt-8 h-32 rounded-lg border border-gray-300 dark:border-gray-600"
          style={{
            backgroundImage: imageLoaded
              ? `url('/wood-table.png')`
              : `linear-gradient(45deg, #8B4513 25%, #A0522D 25%, #A0522D 50%, #8B4513 50%, #8B4513 75%, #A0522D 75%, #A0522D)`,
            backgroundSize: imageLoaded ? "cover" : "20px 20px",
            backgroundPosition: "center",
            backgroundRepeat: imageLoaded ? "no-repeat" : "repeat",
            backgroundColor: "#D2B48C",
          }}
        >
          <div className="h-full bg-white/30 dark:bg-gray-900/30 rounded-lg flex items-center justify-center">
            <p className="text-gray-700 dark:text-gray-200 font-medium">
              {imageLoaded ? "Wood Table Background" : "Wood Pattern Fallback"}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
