"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react"

interface FallbackPDFViewerProps {
  title: string
  bookId: number
  onRetry: () => void
}

export default function FallbackPDFViewer({ title, bookId, onRetry }: FallbackPDFViewerProps) {
  const [pageNumber, setPageNumber] = useState<number>(1)
  const numPages = 5 // Fixed number of pages for fallback

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => {
      const newPageNumber = prevPageNumber + offset
      return Math.max(1, Math.min(numPages, newPageNumber))
    })
  }

  function previousPage() {
    changePage(-1)
  }

  function nextPage() {
    changePage(1)
  }

  // Generate a consistent background color based on the book ID and page number
  const getPageColor = (bookId: number, pageNumber: number) => {
    const hue = (bookId * 40 + pageNumber * 10) % 360
    return `hsl(${hue}, 20%, 90%)`
  }

  return (
    <div className="flex flex-col h-full">
      {/* PDF Viewer Header */}
      <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <AlertTriangle size={16} className="text-amber-500 mr-2" />
          <h3 className="text-sm font-medium truncate dark:text-white">{title} (Fallback Mode)</h3>
        </div>
        <button
          onClick={onRetry}
          className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-700"
        >
          Retry Loading
        </button>
      </div>

      {/* Fallback PDF Document */}
      <div className="flex-grow overflow-auto bg-gray-50 dark:bg-gray-900 flex justify-center">
        <div
          className="m-4 shadow-lg bg-white dark:bg-gray-800 rounded-md overflow-hidden"
          style={{
            width: "80%",
            maxWidth: "600px",
            height: "80%",
            backgroundColor: getPageColor(bookId, pageNumber),
          }}
        >
          {/* Fallback page content */}
          <div className="p-8 h-full flex flex-col">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold dark:text-white">{title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Page {pageNumber} (Fallback View)</p>
              <div className="mt-4 p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded text-sm">
                PDF viewer is in fallback mode. Some features may be limited.
              </div>
            </div>

            <div className="flex-grow flex flex-col">
              {/* Simulate text lines */}
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-3"
                  style={{
                    width: `${70 + Math.random() * 30}%`,
                    opacity: 0.5 + Math.random() * 0.3,
                  }}
                />
              ))}

              {/* Simulate an image in the page */}
              <div className="my-4 mx-auto w-3/4 h-32 relative">
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Content Placeholder</span>
                </div>
              </div>

              {/* More text lines */}
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i + 10}
                  className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-3"
                  style={{
                    width: `${50 + Math.random() * 50}%`,
                    opacity: 0.5 + Math.random() * 0.3,
                  }}
                />
              ))}
            </div>

            <div className="text-center text-sm text-gray-400 dark:text-gray-500 mt-4">
              {title} - Page {pageNumber} of {numPages} (Fallback Mode)
            </div>
          </div>
        </div>
      </div>

      {/* PDF Controls */}
      <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={previousPage}
          disabled={pageNumber <= 1}
          className={`p-1 rounded ${pageNumber <= 1 ? "text-gray-400 dark:text-gray-500" : "hover:bg-gray-200 dark:hover:bg-gray-600"}`}
          aria-label="Previous page"
        >
          <ChevronLeft size={20} className={pageNumber <= 1 ? "text-gray-400 dark:text-gray-500" : "dark:text-white"} />
        </button>

        <p className="text-sm dark:text-white">
          Page {pageNumber} of {numPages}
        </p>

        <button
          onClick={nextPage}
          disabled={pageNumber >= numPages}
          className={`p-1 rounded ${pageNumber >= numPages ? "text-gray-400 dark:text-gray-500" : "hover:bg-gray-200 dark:hover:bg-gray-600"}`}
          aria-label="Next page"
        >
          <ChevronRight
            size={20}
            className={pageNumber >= numPages ? "text-gray-400 dark:text-gray-500" : "dark:text-white"}
          />
        </button>
      </div>
    </div>
  )
}
