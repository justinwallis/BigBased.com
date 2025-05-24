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
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none overflow-hidden">
        {/* Floating Ancient Scrolls */}
        <div className="absolute top-10 left-10 w-32 h-8 bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 rounded-full transform rotate-12 animate-float-slow shadow-lg"></div>
        <div className="absolute top-32 right-20 w-40 h-10 bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 rounded-full transform -rotate-6 animate-float-delayed shadow-lg"></div>
        <div className="absolute bottom-20 left-1/4 w-36 h-9 bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 rounded-full transform rotate-3 animate-float-reverse shadow-lg"></div>

        {/* Rolling Scroll Effect */}
        <div className="absolute top-1/2 right-10 transform -translate-y-1/2">
          <div className="w-6 h-40 bg-gradient-to-b from-amber-200 to-amber-300 dark:from-amber-800 dark:to-amber-700 rounded-full animate-scroll-roll shadow-md"></div>
          <div className="w-6 h-40 bg-gradient-to-b from-amber-200 to-amber-300 dark:from-amber-800 dark:to-amber-700 rounded-full animate-scroll-roll-delayed ml-2 shadow-md"></div>
        </div>

        {/* Parchment Waves */}
        <div className="absolute bottom-0 left-0 w-full h-32 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M0,60 C300,120 600,0 900,60 C1050,90 1150,30 1200,60 L1200,120 L0,120 Z"
              fill="url(#parchmentGradient)"
              className="animate-wave"
            />
            <defs>
              <linearGradient id="parchmentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fef3c7" className="dark:stop-color-amber-900" />
                <stop offset="50%" stopColor="#fde68a" className="dark:stop-color-amber-800" />
                <stop offset="100%" stopColor="#fef3c7" className="dark:stop-color-amber-900" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Floating Book Pages */}
        <div className="absolute top-20 left-1/3 w-8 h-12 bg-white dark:bg-gray-800 transform rotate-45 animate-page-flutter shadow-sm border border-gray-200 dark:border-gray-700"></div>
        <div className="absolute bottom-40 right-1/3 w-6 h-10 bg-white dark:bg-gray-800 transform -rotate-12 animate-page-flutter-delayed shadow-sm border border-gray-200 dark:border-gray-700"></div>
        <div className="absolute top-1/3 left-1/2 w-7 h-11 bg-white dark:bg-gray-800 transform rotate-30 animate-page-flutter-reverse shadow-sm border border-gray-200 dark:border-gray-700"></div>

        {/* Ancient Text Lines */}
        <div className="absolute top-1/4 left-20 opacity-20">
          <div className="w-32 h-0.5 bg-amber-600 dark:bg-amber-400 mb-2 animate-text-reveal"></div>
          <div className="w-28 h-0.5 bg-amber-600 dark:bg-amber-400 mb-2 animate-text-reveal-delayed"></div>
          <div className="w-30 h-0.5 bg-amber-600 dark:bg-amber-400 animate-text-reveal-slow"></div>
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
