"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from "lucide-react"
// Add fallback viewer import and state
import FallbackPDFViewer from "./fallback-pdf-viewer"

interface MockPDFViewerProps {
  title: string
  bookId: number
}

export default function MockPDFViewer({ title, bookId }: MockPDFViewerProps) {
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [numPages, setNumPages] = useState<number>(0)
  const [scale, setScale] = useState<number>(1.0)
  const [rotation, setRotation] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [useFallback, setUseFallback] = useState<boolean>(false)

  // Simulate loading the PDF
  useEffect(() => {
    console.log(`[MockPDFViewer] Loading PDF for book ID: ${bookId}, title: ${title}`)
    setIsLoading(true)
    setPageNumber(1)

    // Generate a random number of pages based on the book ID
    const randomPages = 10 + (bookId % 20)

    console.log(`[MockPDFViewer] Generated ${randomPages} pages for book ID: ${bookId}`)

    // Simulate loading delay
    const timer = setTimeout(() => {
      try {
        setNumPages(randomPages)
        setIsLoading(false)
        console.log(`[MockPDFViewer] Successfully loaded PDF for book ID: ${bookId} with ${randomPages} pages`)
      } catch (error) {
        console.error(`[MockPDFViewer] Error loading PDF for book ID: ${bookId}:`, error)
        setIsLoading(false)
      }
    }, 1000)

    return () => {
      console.log(`[MockPDFViewer] Cleaning up timer for book ID: ${bookId}`)
      clearTimeout(timer)
    }
  }, [bookId, title])

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

  function zoomIn() {
    setScale((prevScale) => Math.min(prevScale + 0.2, 2.5))
  }

  function zoomOut() {
    setScale((prevScale) => Math.max(prevScale - 0.2, 0.5))
  }

  function rotate() {
    setRotation((prevRotation) => (prevRotation + 90) % 360)
  }

  // Generate a consistent background color based on the book ID and page number
  const getPageColor = (bookId: number, pageNumber: number) => {
    const hue = (bookId * 40 + pageNumber * 10) % 360
    return `hsl(${hue}, 30%, 95%)`
  }

  // Add a function to handle fallback retry
  function handleRetry() {
    console.log("[MockPDFViewer] Retrying with normal viewer")
    setUseFallback(false)
    setIsLoading(true)
    setError(null)

    // Simulate loading delay
    setTimeout(() => {
      try {
        const randomPages = 10 + (bookId % 20)
        setNumPages(randomPages)
        setIsLoading(false)
      } catch (err) {
        console.error("[MockPDFViewer] Error in retry:", err)
        setError("Failed to load PDF after retry")
        setUseFallback(true)
      }
    }, 1000)
  }

  // Modify the return statement to include the fallback viewer
  return (
    <div className="flex flex-col h-full">
      {/* PDF Viewer Header */}
      <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium truncate dark:text-white">{title}</h3>
        <div className="flex space-x-2">
          {useFallback ? (
            <button
              onClick={handleRetry}
              className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-700"
            >
              Try Normal View
            </button>
          ) : (
            <>
              <button
                onClick={zoomOut}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                aria-label="Zoom out"
              >
                <ZoomOut size={16} className="dark:text-white" />
              </button>
              <button
                onClick={zoomIn}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                aria-label="Zoom in"
              >
                <ZoomIn size={16} className="dark:text-white" />
              </button>
              <button
                onClick={rotate}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                aria-label="Rotate"
              >
                <RotateCw size={16} className="dark:text-white" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex items-center justify-center h-full w-full bg-gray-50 dark:bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full w-full bg-gray-50 dark:bg-gray-900">
          <div className="text-red-500 text-center p-4">
            <p>{error}</p>
            <div className="flex space-x-2 justify-center mt-4">
              <button
                onClick={() => {
                  console.log("[MockPDFViewer] Retrying PDF load")
                  setError(null)
                  setIsLoading(true)
                  setTimeout(() => {
                    try {
                      setNumPages(10 + (bookId % 20))
                      setIsLoading(false)
                    } catch (err) {
                      setError("Failed to load PDF after retry")
                    }
                  }, 1000)
                }}
                className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 dark:bg-red-800 dark:text-red-200 dark:hover:bg-red-700"
              >
                Retry
              </button>
              <button
                onClick={() => {
                  console.log("[MockPDFViewer] Switching to fallback viewer")
                  setUseFallback(true)
                  setError(null)
                }}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-200 dark:hover:bg-blue-700"
              >
                Use Fallback Viewer
              </button>
            </div>
          </div>
        </div>
      ) : useFallback ? (
        <FallbackPDFViewer title={title} bookId={bookId} onRetry={handleRetry} />
      ) : (
        /* Mock PDF Document - Original viewer */
        <div className="flex-grow overflow-auto bg-gray-50 dark:bg-gray-900 flex justify-center">
          <div
            className="m-4 shadow-lg bg-white dark:bg-gray-800 rounded-md overflow-hidden"
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              transformOrigin: "center center",
              transition: "transform 0.3s ease",
              width: "80%",
              maxWidth: "600px",
              height: "80%",
              backgroundColor: getPageColor(bookId, pageNumber),
            }}
          >
            {/* Mock page content */}
            <div className="p-8 h-full flex flex-col">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold dark:text-white">{title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Page {pageNumber}</p>
              </div>

              <div className="flex-grow flex flex-col">
                {/* Simulate text lines */}
                {Array.from({ length: 15 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-3"
                    style={{
                      width: `${70 + Math.random() * 30}%`,
                      opacity: 0.7 + Math.random() * 0.3,
                    }}
                  />
                ))}

                {/* Simulate an image in the page */}
                {pageNumber % 3 === 1 && (
                  <div className="my-4 mx-auto w-3/4 h-40 relative">
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Book Illustration</span>
                    </div>
                  </div>
                )}

                {/* More text lines */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i + 15}
                    className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-3"
                    style={{
                      width: `${50 + Math.random() * 50}%`,
                      opacity: 0.7 + Math.random() * 0.3,
                    }}
                  />
                ))}
              </div>

              <div className="text-center text-sm text-gray-400 dark:text-gray-500 mt-4">
                {title} - Page {pageNumber} of {numPages}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Controls - Only show if not loading and not in error state and not using fallback */}
      {!isLoading && !error && !useFallback && (
        <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={previousPage}
            disabled={pageNumber <= 1}
            className={`p-1 rounded ${pageNumber <= 1 ? "text-gray-400 dark:text-gray-500" : "hover:bg-gray-200 dark:hover:bg-gray-600"}`}
            aria-label="Previous page"
          >
            <ChevronLeft
              size={20}
              className={pageNumber <= 1 ? "text-gray-400 dark:text-gray-500" : "dark:text-white"}
            />
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
      )}
    </div>
  )
}
