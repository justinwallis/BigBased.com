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
      <div className="absolute inset-0 opacity-60 dark:opacity-50 pointer-events-none overflow-hidden z-0">
        {/* Large Floating Ancient Scrolls - Much more visible colors */}
        <div className="absolute top-16 left-16 w-64 h-16 bg-gradient-to-r from-orange-300 to-red-300 dark:from-orange-500 dark:to-red-500 rounded-full transform rotate-12 animate-float-slow shadow-2xl border-2 border-orange-400 dark:border-orange-400"></div>
        <div className="absolute top-40 right-24 w-72 h-18 bg-gradient-to-r from-amber-400 to-yellow-400 dark:from-amber-400 dark:to-yellow-400 rounded-full transform -rotate-6 animate-float-delayed shadow-2xl border-2 border-amber-500 dark:border-amber-300"></div>
        <div className="absolute bottom-32 left-1/4 w-68 h-17 bg-gradient-to-r from-red-300 to-pink-300 dark:from-red-400 dark:to-pink-400 rounded-full transform rotate-3 animate-float-reverse shadow-2xl border-2 border-red-400 dark:border-red-300"></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-15 bg-gradient-to-r from-yellow-400 to-orange-400 dark:from-yellow-300 dark:to-orange-300 rounded-full transform -rotate-8 animate-float-slow shadow-2xl border-2 border-yellow-500 dark:border-yellow-200"></div>

        {/* Large Rolling Scroll Effect - More visible */}
        <div className="absolute top-1/3 right-12 transform -translate-y-1/2">
          <div className="w-12 h-64 bg-gradient-to-b from-orange-400 to-red-400 dark:from-orange-300 dark:to-red-300 rounded-full animate-scroll-roll shadow-2xl border-4 border-orange-500 dark:border-orange-200"></div>
          <div className="w-12 h-64 bg-gradient-to-b from-amber-400 to-yellow-400 dark:from-amber-300 dark:to-yellow-300 rounded-full animate-scroll-roll-delayed ml-4 shadow-2xl border-4 border-amber-500 dark:border-amber-200"></div>
        </div>

        {/* Enhanced Parchment Waves - More visible */}
        <div className="absolute bottom-0 left-0 w-full h-48 opacity-80">
          <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M0,60 C300,120 600,0 900,60 C1050,90 1150,30 1200,60 L1200,120 L0,120 Z"
              fill="url(#parchmentGradient)"
              className="animate-wave"
            />
            <defs>
              <linearGradient id="parchmentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fb923c" className="dark:stop-color-orange-400" />
                <stop offset="50%" stopColor="#f59e0b" className="dark:stop-color-amber-400" />
                <stop offset="100%" stopColor="#fb923c" className="dark:stop-color-orange-400" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Much Larger Floating Book Pages */}
        <div className="absolute top-24 left-1/3 w-20 h-28 bg-gray-100 dark:bg-gray-600 transform rotate-45 animate-page-flutter shadow-xl border-4 border-gray-400 dark:border-gray-400 rounded-lg"></div>
        <div className="absolute bottom-48 right-1/3 w-18 h-26 bg-gray-200 dark:bg-gray-500 transform -rotate-12 animate-page-flutter-delayed shadow-xl border-4 border-gray-400 dark:border-gray-300 rounded-lg"></div>
        <div className="absolute top-1/3 left-1/2 w-19 h-27 bg-gray-100 dark:bg-gray-600 transform rotate-30 animate-page-flutter-reverse shadow-xl border-4 border-gray-400 dark:border-gray-400 rounded-lg"></div>
        <div className="absolute top-2/3 right-1/4 w-17 h-25 bg-gray-200 dark:bg-gray-500 transform -rotate-25 animate-page-flutter shadow-xl border-4 border-gray-400 dark:border-gray-300 rounded-lg"></div>

        {/* Much More Visible Ancient Text Lines */}
        <div className="absolute top-1/4 left-20 opacity-70">
          <div className="w-48 h-2 bg-orange-600 dark:bg-orange-300 mb-4 animate-text-reveal rounded-full shadow-lg"></div>
          <div className="w-44 h-2 bg-red-600 dark:bg-red-300 mb-4 animate-text-reveal-delayed rounded-full shadow-lg"></div>
          <div className="w-46 h-2 bg-amber-600 dark:bg-amber-300 animate-text-reveal-slow rounded-full shadow-lg"></div>
        </div>

        {/* Additional Scroll Elements */}
        <div className="absolute bottom-1/4 right-20 opacity-70">
          <div className="w-40 h-2 bg-yellow-600 dark:bg-yellow-300 mb-4 animate-text-reveal-slow rounded-full shadow-lg"></div>
          <div className="w-36 h-2 bg-orange-600 dark:bg-orange-300 mb-4 animate-text-reveal rounded-full shadow-lg"></div>
          <div className="w-38 h-2 bg-red-600 dark:bg-red-300 animate-text-reveal-delayed rounded-full shadow-lg"></div>
        </div>

        {/* Additional Large Floating Elements for More Drama */}
        <div className="absolute top-12 right-1/3 w-56 h-14 bg-gradient-to-r from-pink-300 to-red-300 dark:from-pink-400 dark:to-red-400 rounded-full transform rotate-15 animate-float-delayed shadow-2xl border-2 border-pink-400 dark:border-pink-300"></div>
        <div className="absolute bottom-16 left-12 w-52 h-13 bg-gradient-to-r from-yellow-300 to-amber-300 dark:from-yellow-400 dark:to-amber-400 rounded-full transform -rotate-10 animate-float-reverse shadow-2xl border-2 border-yellow-400 dark:border-yellow-300"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">Digital Library</h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
          Access our curated collection of books, articles, and resources that promote traditional values,
          constitutional principles, and a free society.
        </p>

        <div className="h-[600px] md:h-[700px] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800 relative z-20">
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
