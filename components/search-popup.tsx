"use client"

import type React from "react"

import { useState, useEffect, useRef, useMemo } from "react"
import { Search, X, TrendingUp, Layout, FileText, Layers, GitBranch, Info, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { allSearchableItems, getFeaturedItems, type SearchableItem } from "@/data/search-data"
import { searchItems, groupSearchResults, highlightMatch } from "@/utils/search-utils"
import { useDebounce } from "@/hooks/use-debounce"

type SearchPopupProps = {
  isOpen: boolean
  onClose: () => void
}

type CategoryType = {
  id: string
  name: string
  icon: React.ReactNode
}

const categories: CategoryType[] = [
  { id: "trending", name: "Trending", icon: <TrendingUp className="h-5 w-5" /> },
  { id: "screens", name: "Screens", icon: <Layout className="h-5 w-5" /> },
  { id: "pages", name: "Content Pages", icon: <FileText className="h-5 w-5" /> },
  { id: "resources", name: "Resources", icon: <Layers className="h-5 w-5" /> },
  { id: "features", name: "Features", icon: <GitBranch className="h-5 w-5" /> },
]

export default function SearchPopup({ isOpen, onClose }: SearchPopupProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("trending")
  const [isSearching, setIsSearching] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  // Debounce search term to prevent excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Get featured items for initial display
  const featuredItems = useMemo(() => getFeaturedItems(), [])

  // Search results
  const searchResults = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return {}
    }

    setIsSearching(true)
    const results = searchItems(allSearchableItems, debouncedSearchTerm)
    const grouped = groupSearchResults(results)
    setIsSearching(false)

    return grouped
  }, [debouncedSearchTerm])

  // Determine what to display based on search term
  const hasSearchResults = Object.keys(searchResults).length > 0
  const hasNoResults = debouncedSearchTerm.trim() !== "" && !hasSearchResults
  const shouldShowFeatured = !debouncedSearchTerm.trim()

  // Focus the search input when the popup opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Reset search when popup closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("")
    }
  }, [isOpen])

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  if (!isOpen) return null

  // Render search result item
  const renderSearchItem = (item: SearchableItem) => {
    const hasImage = !!item.image
    const hasIcon = !!item.icon

    return (
      <Link
        key={item.id}
        href={item.href}
        className={cn(
          "flex items-center p-3 rounded-lg transition-colors",
          isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100",
        )}
        onClick={onClose}
      >
        {hasImage && (
          <div className="relative w-12 h-12 mr-4 rounded-lg overflow-hidden flex-shrink-0">
            <Image src={item.image! || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
          </div>
        )}
        {hasIcon && !hasImage && (
          <div className="relative w-10 h-10 mr-4 rounded-lg overflow-hidden flex-shrink-0">
            <Image src={item.icon! || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
          </div>
        )}
        {!hasImage && !hasIcon && (
          <div
            className={cn(
              "w-10 h-10 mr-4 rounded-lg flex items-center justify-center flex-shrink-0",
              isDarkMode ? "bg-gray-800" : "bg-gray-100",
            )}
          >
            <span className="text-lg font-bold">{item.name.charAt(0)}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className={cn("font-medium truncate", isDarkMode ? "text-white" : "text-gray-900")}>
            {highlightMatch(item.name, debouncedSearchTerm)}
          </h4>
          {item.description && (
            <p className={cn("text-sm truncate", isDarkMode ? "text-gray-400" : "text-gray-500")}>
              {highlightMatch(item.description, debouncedSearchTerm)}
            </p>
          )}
        </div>
      </Link>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={cn("absolute inset-0 backdrop-blur-sm", isDarkMode ? "bg-black/70" : "bg-gray-500/30")}
        onClick={onClose}
      />

      {/* Search Popup */}
      <div
        className={cn(
          "relative w-full max-w-4xl max-h-[85vh] rounded-lg shadow-2xl overflow-hidden",
          isDarkMode ? "bg-gray-900" : "bg-white",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full">
          {/* Sidebar */}
          <div
            className={cn(
              "w-64 p-4 border-r",
              isDarkMode ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200",
            )}
          >
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={cn(
                    "flex items-center w-full px-4 py-2 rounded-md text-left transition-colors",
                    selectedCategory === category.id
                      ? isDarkMode
                        ? "bg-gray-800 text-white"
                        : "bg-gray-200 text-gray-900"
                      : isDarkMode
                        ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  )}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="mr-3">{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Search Bar */}
            <div
              className={cn(
                "p-4 border-b sticky top-0 z-10",
                isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200",
              )}
            >
              <div className="relative">
                {isSearching ? (
                  <Loader2
                    className={cn(
                      "absolute left-3 top-1/2 transform -translate-y-1/2 animate-spin",
                      isDarkMode ? "text-gray-400" : "text-gray-500",
                    )}
                  />
                ) : (
                  <Search
                    className={cn(
                      "absolute left-3 top-1/2 transform -translate-y-1/2",
                      isDarkMode ? "text-gray-400" : "text-gray-500",
                    )}
                  />
                )}
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search Big Based..."
                  className={cn(
                    "w-full pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2",
                    isDarkMode
                      ? "bg-gray-800 text-white focus:ring-blue-500"
                      : "bg-gray-100 text-gray-900 focus:ring-blue-400",
                  )}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className={cn(
                      "absolute right-3 top-1/2 transform -translate-y-1/2",
                      isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900",
                    )}
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Content Sections */}
            <div className={cn("p-6", isDarkMode ? "bg-gray-900" : "bg-white")}>
              {/* No Results State */}
              {hasNoResults && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className={cn("text-center", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No results found</h3>
                    <p>We couldn't find anything matching "{debouncedSearchTerm}"</p>
                  </div>
                </div>
              )}

              {/* Search Results */}
              {hasSearchResults && (
                <div className="space-y-8">
                  {Object.entries(searchResults).map(([category, items]) => (
                    <div key={category} className="mb-8">
                      <h3
                        className={cn(
                          "text-sm font-medium mb-4 capitalize",
                          isDarkMode ? "text-gray-400" : "text-gray-500",
                        )}
                      >
                        {category} ({items.length})
                      </h3>
                      <div className="space-y-2">{items.map((item) => renderSearchItem(item))}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Featured Content (when no search) */}
              {shouldShowFeatured && (
                <div className="space-y-8">
                  {/* Features Section */}
                  {featuredItems.features && featuredItems.features.length > 0 && (
                    <div className="mb-8">
                      <h3 className={cn("text-sm font-medium mb-4", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                        Features
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        {featuredItems.features.map((feature) => (
                          <Link
                            key={feature.id}
                            href={feature.href}
                            className={cn(
                              "flex flex-col items-center justify-center p-3 rounded-lg transition-colors",
                              isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100",
                            )}
                            onClick={onClose}
                          >
                            <div className="relative w-12 h-12 mb-2 rounded-lg overflow-hidden">
                              <Image
                                src={feature.icon || "/placeholder.svg"}
                                alt={feature.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className={cn("text-xs text-center", isDarkMode ? "text-white" : "text-gray-900")}>
                              {feature.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Screens Section */}
                  {featuredItems.screens && featuredItems.screens.length > 0 && (
                    <div className="mb-8">
                      <h3 className={cn("text-sm font-medium mb-4", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                        Screens
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {featuredItems.screens.map((screen) => (
                          <Link key={screen.id} href={screen.href} className="group" onClick={onClose}>
                            <div
                              className={cn(
                                "relative aspect-[4/3] rounded-lg overflow-hidden mb-2 border group-hover:border-blue-500 transition-colors",
                                isDarkMode ? "border-gray-800" : "border-gray-200",
                              )}
                            >
                              <Image
                                src={screen.image || "/placeholder.svg"}
                                alt={screen.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className={cn("text-sm", isDarkMode ? "text-white" : "text-gray-900")}>
                              {screen.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Content Pages Section */}
                  {featuredItems.pages && featuredItems.pages.length > 0 && (
                    <div>
                      <h3 className={cn("text-sm font-medium mb-4", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                        Content Pages
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {featuredItems.pages.map((page) => (
                          <Link key={page.id} href={page.href} className="group" onClick={onClose}>
                            <div
                              className={cn(
                                "relative aspect-[4/3] rounded-lg overflow-hidden mb-2 border group-hover:border-blue-500 transition-colors",
                                isDarkMode ? "border-gray-800" : "border-gray-200",
                              )}
                            >
                              <Image
                                src={page.image || "/placeholder.svg"}
                                alt={page.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className={cn("text-sm", isDarkMode ? "text-white" : "text-gray-900")}>
                              {page.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={cn(
            "absolute bottom-0 left-0 w-full border-t p-3 text-xs flex items-center",
            isDarkMode ? "border-gray-800 bg-gray-900 text-gray-400" : "border-gray-200 bg-gray-50 text-gray-500",
          )}
        >
          <Info className="h-4 w-4 mr-2" />
          <span>Press ESC to close or click outside</span>
        </div>
      </div>
    </div>
  )
}
