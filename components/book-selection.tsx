"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import BookCoverPlaceholder from "./book-cover-placeholder"

interface Book {
  id: number
  title: string
  author: string
  coverImage: string
  pdfUrl: string
  description: string
  categories: string[]
  publishedYear: string
  pages: number
  publisher: string
}

interface BookSelectionProps {
  books: Book[]
  selectedBookId: number | null
  onSelectBook: (book: Book) => void
  filteredCategories: string[]
}

export default function BookSelection({ books, selectedBookId, onSelectBook, filteredCategories }: BookSelectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  // Filter books based on selected categories
  const filteredBooks = filteredCategories.includes("all")
    ? books
    : books.filter((book) => book.categories.some((category) => filteredCategories.includes(category)))

  // Check if scroll arrows should be shown
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setShowLeftArrow(scrollLeft > 0)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10) // 10px buffer
  }

  // Add scroll event listener
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScrollPosition)
      // Initial check
      checkScrollPosition()

      return () => {
        scrollContainer.removeEventListener("scroll", checkScrollPosition)
      }
    }
  }, [filteredBooks])

  // Recheck scroll arrows when books are filtered
  useEffect(() => {
    checkScrollPosition()
  }, [filteredCategories])

  // Scroll functions
  const scrollLeft = () => {
    if (!scrollContainerRef.current) return
    scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" })
  }

  const scrollRight = () => {
    if (!scrollContainerRef.current) return
    scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" })
  }

  const handleBookClick = (book) => {
    onSelectBook(book)
  }

  if (filteredBooks.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 bg-gray-50 rounded-md">
        <p className="text-gray-500">No books found in the selected categories.</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Left scroll arrow */}
      {showLeftArrow && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1 shadow-md"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Book scroll container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto py-4 px-2 space-x-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className={`flex-shrink-0 cursor-pointer transition-all duration-200 transform ${
              selectedBookId === book.id ? "scale-105 shadow-lg" : "hover:scale-105 shadow-md"
            }`}
            onClick={() => handleBookClick(book)}
          >
            {book.coverImage.includes("placeholder") ? (
              <BookCoverPlaceholder
                title={book.title}
                author={book.author}
                width={120}
                height={180}
                className={selectedBookId === book.id ? "ring-2 ring-black" : ""}
              />
            ) : (
              <div className="relative w-[120px] h-[180px]">
                <Image
                  src={book.coverImage || "/placeholder.svg"}
                  alt={`Cover of ${book.title}`}
                  fill
                  sizes="120px"
                  className={`rounded-md object-cover ${selectedBookId === book.id ? "ring-2 ring-black" : ""}`}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right scroll arrow */}
      {showRightArrow && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1 shadow-md"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  )
}
