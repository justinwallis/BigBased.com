"use client"

import { useState } from "react"
import { Book, Info } from "lucide-react"
import PDFViewer from "./pdf-viewer"
import BookSelection from "./book-selection"
import CategoryFilter from "./category-filter"
import { books, bookCategories } from "@/data/books-data"

export default function BookLibrary() {
  const [selectedBook, setSelectedBook] = useState(books[0])
  const [selectedCategories, setSelectedCategories] = useState(["all"])
  const [showBookInfo, setShowBookInfo] = useState(true)
  const [key, setKey] = useState(0) // Add a key to force re-render when needed

  // Handle book selection
  const handleSelectBook = (book) => {
    setSelectedBook(book)
    // Force re-render of PDF viewer when book changes
    setKey((prevKey) => prevKey + 1)
  }

  // Handle category filter change
  const handleCategoryChange = (categories) => {
    setSelectedCategories(categories)

    // If the currently selected book is not in the filtered categories,
    // select the first book that matches the filter
    const isCurrentBookInFilter =
      categories.includes("all") || selectedBook.categories.some((cat) => categories.includes(cat))

    if (!isCurrentBookInFilter) {
      const filteredBooks = categories.includes("all")
        ? books
        : books.filter((book) => book.categories.some((category) => categories.includes(category)))

      if (filteredBooks.length > 0) {
        setSelectedBook(filteredBooks[0])
        setKey((prevKey) => prevKey + 1) // Force re-render
      }
    }
  }

  // Toggle book information panel
  const toggleBookInfo = () => {
    setShowBookInfo(!showBookInfo)
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
      {/* Library Header */}
      <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Book size={18} className="mr-2 dark:text-white" />
          <h2 className="text-lg font-semibold dark:text-white">Browse Books</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleBookInfo}
            className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${showBookInfo ? "bg-gray-200 dark:bg-gray-600" : ""}`}
            aria-label="Book information"
          >
            <Info size={18} className="dark:text-white" />
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <CategoryFilter
          categories={bookCategories}
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {/* Book Selection */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <BookSelection
          books={books}
          selectedBookId={selectedBook?.id}
          onSelectBook={handleSelectBook}
          filteredCategories={selectedCategories}
        />
      </div>

      {/* Main Content Area - PDF Viewer and Book Info */}
      <div className="flex-grow flex overflow-hidden">
        {/* PDF Viewer */}
        <div className={`flex-grow transition-all duration-300 ${showBookInfo ? "w-2/3" : "w-full"}`}>
          {selectedBook ? (
            <PDFViewer title={selectedBook.title} pdfUrl={selectedBook.pdfUrl} key={`pdf-${key}-${selectedBook.id}`} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400">No book selected</p>
            </div>
          )}
        </div>

        {/* Book Information Panel */}
        {showBookInfo && (
          <div className="w-1/3 border-l border-gray-200 dark:border-gray-700 overflow-y-auto p-4 dark:bg-gray-800">
            <h3 className="text-xl font-bold mb-2 dark:text-white">{selectedBook.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">by {selectedBook.author}</p>

            <div className="mb-4">
              <p className="text-sm mb-3 dark:text-gray-200">{selectedBook.description}</p>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
                <div>
                  <span className="font-semibold">Published:</span> {selectedBook.publishedYear}
                </div>
                <div>
                  <span className="font-semibold">Pages:</span> {selectedBook.pages}
                </div>
                <div>
                  <span className="font-semibold">Publisher:</span> {selectedBook.publisher}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2 dark:text-white">Categories</h4>
              <div className="flex flex-wrap gap-1">
                {selectedBook.categories.map((categoryId) => {
                  const category = bookCategories.find((c) => c.id === categoryId)
                  return (
                    <span
                      key={categoryId}
                      className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-xs"
                    >
                      {category?.name || categoryId}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
