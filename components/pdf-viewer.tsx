"use client"

import { useState, useEffect } from "react"
import { Download, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"

interface PDFViewerProps {
  pdfUrl: string
  title: string
}

export default function PDFViewer({ pdfUrl, title }: PDFViewerProps) {
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(5) // Default to 5 pages
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Reset when PDF changes
  useEffect(() => {
    setPageNumber(1)
    // Generate a random number of pages between 3 and 8 for simulation
    setTotalPages(Math.floor(Math.random() * 6) + 3)
  }, [pdfUrl])

  const nextPage = () => {
    if (pageNumber < totalPages) {
      setPageNumber(pageNumber + 1)
    }
  }

  const prevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1)
    }
  }

  // Generate a consistent background color based on the book title and page number
  const getPageColor = () => {
    const hash = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const hue = (hash * 40 + pageNumber * 20) % 360
    return `hsl(${hue}, 20%, 95%)`
  }

  return (
    <div className="flex flex-col h-full">
      {/* PDF Viewer Header */}
      <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium truncate dark:text-white">{title}</h3>
        <div className="flex space-x-2">
          <a
            href={pdfUrl}
            download={`${title}.pdf`}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            aria-label="Download PDF"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download size={16} className="dark:text-white" />
          </a>
          <a
            href={pdfUrl}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            aria-label="Open PDF in new tab"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={16} className="dark:text-white" />
          </a>
        </div>
      </div>

      {/* PDF Document */}
      <div className="flex-grow overflow-auto bg-gray-50 dark:bg-gray-900 flex justify-center">
        <div className="m-4 shadow-lg bg-white dark:bg-gray-800 rounded-md overflow-hidden max-w-2xl w-full">
          {/* Simulated page content */}
          <div className="p-8 h-[600px] flex flex-col" style={{ backgroundColor: getPageColor() }}>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold dark:text-white">{title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Page {pageNumber} of {totalPages}
              </p>
            </div>

            <div className="flex-grow flex flex-col">
              {/* Simulate text lines */}
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-3"
                  style={{
                    width: `${70 + Math.sin(i * 0.5) * 30}%`,
                    opacity: 0.7 + Math.sin(i * 0.2) * 0.3,
                  }}
                />
              ))}

              {/* Simulate an image in the page */}
              {pageNumber % 2 === 0 && (
                <div className="my-4 mx-auto w-3/4 h-32 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Figure {pageNumber}</span>
                </div>
              )}

              {/* More text lines */}
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i + 15}
                  className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-3"
                  style={{
                    width: `${50 + Math.cos(i * 0.5) * 50}%`,
                    opacity: 0.7 + Math.cos(i * 0.2) * 0.3,
                  }}
                />
              ))}
            </div>

            <div className="text-center text-sm text-gray-400 dark:text-gray-500 mt-4">
              {title} - Page {pageNumber} of {totalPages}
            </div>
          </div>
        </div>
      </div>

      {/* PDF Controls */}
      <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={prevPage}
          disabled={pageNumber <= 1}
          className={`p-1 rounded ${pageNumber <= 1 ? "text-gray-400 dark:text-gray-500" : "hover:bg-gray-200 dark:hover:bg-gray-600"}`}
          aria-label="Previous page"
        >
          <ChevronLeft size={20} className={pageNumber <= 1 ? "text-gray-400 dark:text-gray-500" : "dark:text-white"} />
        </button>

        <p className="text-sm dark:text-white">
          Page {pageNumber} of {totalPages}
        </p>

        <button
          onClick={nextPage}
          disabled={pageNumber >= totalPages}
          className={`p-1 rounded ${pageNumber >= totalPages ? "text-gray-400 dark:text-gray-500" : "hover:bg-gray-200 dark:hover:bg-gray-600"}`}
          aria-label="Next page"
        >
          <ChevronRight
            size={20}
            className={pageNumber >= totalPages ? "text-gray-400 dark:text-gray-500" : "dark:text-white"}
          />
        </button>
      </div>
    </div>
  )
}
