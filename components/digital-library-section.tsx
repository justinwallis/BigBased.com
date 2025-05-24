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
    <section id="digital-library" className="py-16 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Dramatic Scrolling Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Matrix Rain Effect */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`matrix-${i}`}
              className="absolute text-xs font-mono text-gray-600 dark:text-green-400 whitespace-nowrap animate-pulse"
              style={{
                left: `${(i * 5) % 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + (i % 3)}s`,
              }}
            >
              <div className="animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}>
                01001100 01101001 01100010 01110010 01100001 01110010 01111001
              </div>
            </div>
          ))}
        </div>

        {/* Floating Book Icons */}
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`book-${i}`}
              className="absolute text-2xl text-gray-400 dark:text-gray-600 animate-pulse"
              style={{
                left: `${(i * 12.5) % 100}%`,
                top: `${(i * 15) % 80}%`,
                animationDelay: `${i * 1.2}s`,
                animationDuration: `${4 + (i % 2)}s`,
              }}
            >
              📚
            </div>
          ))}
        </div>

        {/* Scrolling Text Snippets */}
        <div className="absolute inset-0 opacity-5 dark:opacity-15">
          {["KNOWLEDGE", "WISDOM", "TRUTH", "FREEDOM", "LIBERTY", "FAITH"].map((word, i) => (
            <div
              key={`word-${i}`}
              className="absolute text-lg font-bold text-gray-500 dark:text-gray-400 tracking-widest animate-pulse"
              style={{
                left: `${(i * 16) % 100}%`,
                top: `${(i * 20) % 90}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${5 + (i % 3)}s`,
                transform: `rotate(${((i * 15) % 45) - 22.5}deg)`,
              }}
            >
              {word}
            </div>
          ))}
        </div>

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div
            className="w-full h-full bg-gradient-to-br from-transparent via-gray-200 dark:via-gray-700 to-transparent animate-pulse"
            style={{
              backgroundImage: `
            linear-gradient(90deg, transparent 98%, rgba(128,128,128,0.1) 100%),
            linear-gradient(0deg, transparent 98%, rgba(128,128,128,0.1) 100%)
          `,
              backgroundSize: "50px 50px",
              animationDuration: "8s",
            }}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">Digital Library</h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
          Access our curated collection of books, articles, and resources that promote traditional values,
          constitutional principles, and a free society.
        </p>

        <div className="h-[600px] md:h-[700px] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
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
