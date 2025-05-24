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
      {/* Animated Scroll/Parchment Background */}
      <div className="absolute inset-0 opacity-20 dark:opacity-25 pointer-events-none overflow-hidden z-0">
        {/* Large Floating Ancient Scrolls */}
        <div className="absolute top-16 left-16 w-48 h-12 bg-gradient-to-r from-amber-200 to-amber-300 dark:from-amber-700 dark:to-amber-600 rounded-full transform rotate-12 animate-float-slow shadow-xl border border-amber-300 dark:border-amber-600"></div>
        <div className="absolute top-40 right-24 w-56 h-14 bg-gradient-to-r from-yellow-200 to-yellow-300 dark:from-yellow-700 dark:to-yellow-600 rounded-full transform -rotate-6 animate-float-delayed shadow-xl border border-yellow-300 dark:border-yellow-600"></div>
        <div className="absolute bottom-32 left-1/4 w-52 h-13 bg-gradient-to-r from-orange-200 to-orange-300 dark:from-orange-700 dark:to-orange-600 rounded-full transform rotate-3 animate-float-reverse shadow-xl border border-orange-300 dark:border-orange-600"></div>
        <div className="absolute top-1/2 left-1/2 w-44 h-11 bg-gradient-to-r from-amber-200 to-yellow-200 dark:from-amber-700 dark:to-yellow-700 rounded-full transform -rotate-8 animate-float-slow shadow-xl border border-amber-300 dark:border-amber-600"></div>

        {/* Large Rolling Scroll Effect */}
        <div className="absolute top-1/3 right-12 transform -translate-y-1/2">
          <div className="w-8 h-48 bg-gradient-to-b from-amber-300 to-amber-400 dark:from-amber-600 dark:to-amber-500 rounded-full animate-scroll-roll shadow-lg border-2 border-amber-400 dark:border-amber-500"></div>
          <div className="w-8 h-48 bg-gradient-to-b from-yellow-300 to-yellow-400 dark:from-yellow-600 dark:to-yellow-500 rounded-full animate-scroll-roll-delayed ml-3 shadow-lg border-2 border-yellow-400 dark:border-yellow-500"></div>
        </div>

        {/* Enhanced Parchment Waves */}
        <div className="absolute bottom-0 left-0 w-full h-40 opacity-60">
          <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M0,60 C300,120 600,0 900,60 C1050,90 1150,30 1200,60 L1200,120 L0,120 Z"
              fill="url(#parchmentGradient)"
              className="animate-wave"
            />
            <defs>
              <linearGradient id="parchmentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fde68a" className="dark:stop-color-amber-600" />
                <stop offset="50%" stopColor="#fbbf24" className="dark:stop-color-amber-500" />
                <stop offset="100%" stopColor="#fde68a" className="dark:stop-color-amber-600" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Larger Floating Book Pages */}
        <div className="absolute top-24 left-1/3 w-12 h-16 bg-white dark:bg-gray-700 transform rotate-45 animate-page-flutter shadow-md border-2 border-gray-300 dark:border-gray-600 rounded-sm"></div>
        <div className="absolute bottom-48 right-1/3 w-10 h-14 bg-white dark:bg-gray-700 transform -rotate-12 animate-page-flutter-delayed shadow-md border-2 border-gray-300 dark:border-gray-600 rounded-sm"></div>
        <div className="absolute top-1/3 left-1/2 w-11 h-15 bg-white dark:bg-gray-700 transform rotate-30 animate-page-flutter-reverse shadow-md border-2 border-gray-300 dark:border-gray-600 rounded-sm"></div>
        <div className="absolute top-2/3 right-1/4 w-9 h-13 bg-white dark:bg-gray-700 transform -rotate-25 animate-page-flutter shadow-md border-2 border-gray-300 dark:border-gray-600 rounded-sm"></div>

        {/* More Visible Ancient Text Lines */}
        <div className="absolute top-1/4 left-20 opacity-40">
          <div className="w-40 h-1 bg-amber-600 dark:bg-amber-400 mb-3 animate-text-reveal rounded-full"></div>
          <div className="w-36 h-1 bg-amber-600 dark:bg-amber-400 mb-3 animate-text-reveal-delayed rounded-full"></div>
          <div className="w-38 h-1 bg-amber-600 dark:bg-amber-400 animate-text-reveal-slow rounded-full"></div>
        </div>

        {/* Additional Scroll Elements */}
        <div className="absolute bottom-1/4 right-20 opacity-40">
          <div className="w-32 h-1 bg-yellow-600 dark:bg-yellow-400 mb-3 animate-text-reveal-slow rounded-full"></div>
          <div className="w-28 h-1 bg-yellow-600 dark:bg-yellow-400 mb-3 animate-text-reveal rounded-full"></div>
          <div className="w-30 h-1 bg-yellow-600 dark:bg-yellow-400 animate-text-reveal-delayed rounded-full"></div>
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
