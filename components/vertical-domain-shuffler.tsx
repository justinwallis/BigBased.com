"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Search, Filter, X, ChevronUp, ChevronDown, Pause, Play, Heart, ExternalLink } from "lucide-react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { motion, AnimatePresence } from "framer-motion"
import { generateAllDomains } from "@/utils/domain-generator"

// Domain categories and TLDs for filtering
const CATEGORIES = [
  { id: "all", label: "All Categories" },
  { id: "organization", label: "Organizations" },
  { id: "company", label: "Companies" },
  { id: "education", label: "Education" },
  { id: "technology", label: "Technology" },
  { id: "network", label: "Networks" },
]

const TLDS = [
  { id: "all", label: "All TLDs" },
  { id: "com", label: ".com" },
  { id: "org", label: ".org" },
  { id: "net", label: ".net" },
  { id: "io", label: ".io" },
  { id: "edu", label: ".edu" },
  { id: "app", label: ".app" },
  { id: "dev", label: ".dev" },
  { id: "tech", label: ".tech" },
  { id: "ai", label: ".ai" },
]

// Get color based on domain category
const getCategoryColor = (category: string) => {
  switch (category) {
    case "organization":
      return "text-blue-600 dark:text-blue-400"
    case "company":
      return "text-green-600 dark:text-green-400"
    case "education":
      return "text-red-600 dark:text-red-400"
    case "technology":
      return "text-purple-600 dark:text-purple-400"
    case "network":
      return "text-yellow-600 dark:text-yellow-400"
    default:
      return "text-gray-600 dark:text-gray-300"
  }
}

// Get TLD color
const getTldColor = (domain: string) => {
  const tld = domain.split(".").pop()
  switch (tld) {
    case "org":
      return "text-blue-500 dark:text-blue-300"
    case "com":
      return "text-green-500 dark:text-green-300"
    case "edu":
      return "text-red-500 dark:text-red-300"
    case "io":
      return "text-purple-500 dark:text-purple-300"
    case "net":
      return "text-yellow-500 dark:text-yellow-300"
    case "app":
      return "text-orange-500 dark:text-orange-300"
    case "dev":
      return "text-cyan-500 dark:text-cyan-300"
    case "tech":
      return "text-indigo-500 dark:text-indigo-300"
    case "ai":
      return "text-pink-500 dark:text-pink-300"
    default:
      return "text-gray-500 dark:text-gray-300"
  }
}

export default function VerticalDomainShuffler() {
  // State for domains and filtering
  const [allDomains, setAllDomains] = useState(() => generateAllDomains())
  const [filteredDomains, setFilteredDomains] = useState(allDomains)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTld, setSelectedTld] = useState("all")
  const [isShuffling, setIsShuffling] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState<null | { name: string; category: string }>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)

  // Refs for virtualization and animation
  const parentRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const shufflePositionRef = useRef(0)
  const shuffleSpeedRef = useRef(0.5) // pixels per frame

  // Filter domains based on search, category, TLD, and favorites
  useEffect(() => {
    let result = [...allDomains]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((domain) => domain.name.toLowerCase().includes(query))
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((domain) => domain.category === selectedCategory)
    }

    // Filter by TLD
    if (selectedTld !== "all") {
      result = result.filter((domain) => domain.name.endsWith(`.${selectedTld}`))
    }

    // Filter by favorites
    if (showOnlyFavorites) {
      result = result.filter((domain) => favorites.has(domain.name))
    }

    setFilteredDomains(result)
  }, [allDomains, searchQuery, selectedCategory, selectedTld, favorites, showOnlyFavorites])

  // Set up virtualization for efficient rendering
  const rowVirtualizer = useVirtualizer({
    count: filteredDomains.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40, // estimated row height
    overscan: 10, // number of items to render outside of the visible area
  })

  // Handle shuffling animation
  useEffect(() => {
    if (!isShuffling || !parentRef.current) return

    const animate = () => {
      if (!parentRef.current) return

      // Update shuffle position
      shufflePositionRef.current += shuffleSpeedRef.current

      // Reset position when we've scrolled through all items
      const maxScroll = rowVirtualizer.getTotalSize() - parentRef.current.clientHeight
      if (shufflePositionRef.current >= maxScroll) {
        shufflePositionRef.current = 0
      }

      // Apply scroll position
      parentRef.current.scrollTop = shufflePositionRef.current

      // Continue animation
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isShuffling, rowVirtualizer])

  // Handle search input with debounce
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  // Toggle favorite status for a domain
  const toggleFavorite = useCallback((domainName: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(domainName)) {
        newFavorites.delete(domainName)
      } else {
        newFavorites.add(domainName)
      }
      return newFavorites
    })
  }, [])

  // Handle domain selection for details view
  const handleDomainClick = useCallback((domain: { name: string; category: string }) => {
    setSelectedDomain(domain)
  }, [])

  // Close domain details panel
  const closeDomainDetails = useCallback(() => {
    setSelectedDomain(null)
  }, [])

  // Toggle shuffling animation
  const toggleShuffling = useCallback(() => {
    setIsShuffling((prev) => !prev)
  }, [])

  // Toggle filter panel
  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev)
  }, [])

  // Toggle favorites filter
  const toggleFavoritesFilter = useCallback(() => {
    setShowOnlyFavorites((prev) => !prev)
  }, [])

  // Change shuffle speed
  const changeSpeed = useCallback((direction: "up" | "down") => {
    shuffleSpeedRef.current = Math.max(0.1, Math.min(3, shuffleSpeedRef.current + (direction === "up" ? 0.2 : -0.2)))
  }, [])

  // Render the domain shuffler
  return (
    <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
            Available Domains{" "}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              ({filteredDomains.length} of {allDomains.length})
            </span>
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search domains..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter button */}
            <button
              onClick={toggleFilters}
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                showFilters
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {(selectedCategory !== "all" || selectedTld !== "all" || showOnlyFavorites) && (
                <span className="flex items-center justify-center w-5 h-5 bg-blue-500 text-white text-xs rounded-full">
                  {(selectedCategory !== "all" ? 1 : 0) + (selectedTld !== "all" ? 1 : 0) + (showOnlyFavorites ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Shuffle controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleShuffling}
                className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label={isShuffling ? "Pause shuffling" : "Start shuffling"}
              >
                {isShuffling ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>

              <button
                onClick={() => changeSpeed("up")}
                className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Increase speed"
              >
                <ChevronUp className="h-4 w-4" />
              </button>

              <button
                onClick={() => changeSpeed("down")}
                className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Decrease speed"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category filter */}
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Category</h3>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-3 py-1 text-sm rounded-full ${
                          selectedCategory === category.id
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TLD filter */}
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Domain Extension</h3>
                  <div className="flex flex-wrap gap-2">
                    {TLDS.map((tld) => (
                      <button
                        key={tld.id}
                        onClick={() => setSelectedTld(tld.id)}
                        className={`px-3 py-1 text-sm rounded-full ${
                          selectedTld === tld.id
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {tld.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Favorites filter */}
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Other Filters</h3>
                  <button
                    onClick={toggleFavoritesFilter}
                    className={`flex items-center gap-2 px-3 py-1 text-sm rounded-full ${
                      showOnlyFavorites
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${showOnlyFavorites ? "fill-blue-700 dark:fill-blue-300" : ""}`} />
                    <span>Favorites ({favorites.size})</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content area with domain list and details panel */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Domain list with virtualization */}
          <div
            className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm"
            style={{ height: "500px" }}
          >
            {filteredDomains.length > 0 ? (
              <div
                ref={parentRef}
                className="h-full overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
                onMouseEnter={() => setIsShuffling(false)}
                onMouseLeave={() => setIsShuffling(true)}
              >
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const domain = filteredDomains[virtualRow.index]
                    const [name, tld] = domain.name.split(/\.(?=[^.]+$)/)
                    const isFavorite = favorites.has(domain.name)

                    return (
                      <div
                        key={virtualRow.index}
                        className={`absolute top-0 left-0 w-full flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          selectedDomain?.name === domain.name ? "bg-blue-50 dark:bg-blue-900/20" : ""
                        }`}
                        style={{
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                        onClick={() => handleDomainClick(domain)}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(domain.name)
                            }}
                            className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                          >
                            <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                          </button>

                          <div className="font-mono">
                            <span className={getCategoryColor(domain.category)}>{name}</span>
                            <span className={getTldColor(domain.name)}>.{tld}</span>
                          </div>
                        </div>

                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <span className="capitalize bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                            {domain.category}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-8 text-center">
                <div className="mb-4">
                  <Search className="h-12 w-12 mx-auto opacity-20" />
                </div>
                <h3 className="text-lg font-medium mb-2">No domains found</h3>
                <p>Try adjusting your search or filters to find what you're looking for.</p>
                {(searchQuery || selectedCategory !== "all" || selectedTld !== "all" || showOnlyFavorites) && (
                  <button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("all")
                      setSelectedTld("all")
                      setShowOnlyFavorites(false)
                    }}
                    className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-md"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Domain details panel */}
          <AnimatePresence>
            {selectedDomain && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="lg:w-96 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Domain Details</h3>
                    <button
                      onClick={closeDomainDetails}
                      className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mb-6">
                    <div className="text-2xl font-mono mb-2">
                      {(() => {
                        const [name, tld] = selectedDomain.name.split(/\.(?=[^.]+$)/)
                        return (
                          <>
                            <span className={getCategoryColor(selectedDomain.category)}>{name}</span>
                            <span className={getTldColor(selectedDomain.name)}>.{tld}</span>
                          </>
                        )
                      })()}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="capitalize bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                        {selectedDomain.category}
                      </span>
                      <span>•</span>
                      <span>{selectedDomain.name.split(".").pop()} domain</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Domain Information</h4>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
                        <dl className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <dt className="text-gray-500 dark:text-gray-400">Type:</dt>
                            <dd className="font-medium text-gray-900 dark:text-white capitalize">
                              {selectedDomain.category}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500 dark:text-gray-400">Extension:</dt>
                            <dd className="font-medium text-gray-900 dark:text-white">
                              .{selectedDomain.name.split(".").pop()}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500 dark:text-gray-400">Length:</dt>
                            <dd className="font-medium text-gray-900 dark:text-white">
                              {selectedDomain.name.length} characters
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Potential Uses</h4>
                      <ul className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 text-sm space-y-1">
                        {selectedDomain.category === "organization" && (
                          <>
                            <li className="text-gray-700 dark:text-gray-300">• Non-profit organization website</li>
                            <li className="text-gray-700 dark:text-gray-300">• Community group portal</li>
                            <li className="text-gray-700 dark:text-gray-300">• Foundation or charity site</li>
                          </>
                        )}
                        {selectedDomain.category === "company" && (
                          <>
                            <li className="text-gray-700 dark:text-gray-300">• Corporate website</li>
                            <li className="text-gray-700 dark:text-gray-300">• Business services platform</li>
                            <li className="text-gray-700 dark:text-gray-300">• E-commerce store</li>
                          </>
                        )}
                        {selectedDomain.category === "education" && (
                          <>
                            <li className="text-gray-700 dark:text-gray-300">• Educational institution</li>
                            <li className="text-gray-700 dark:text-gray-300">• Online learning platform</li>
                            <li className="text-gray-700 dark:text-gray-300">• Research publication site</li>
                          </>
                        )}
                        {selectedDomain.category === "technology" && (
                          <>
                            <li className="text-gray-700 dark:text-gray-300">• Tech startup</li>
                            <li className="text-gray-700 dark:text-gray-300">• Software as a service</li>
                            <li className="text-gray-700 dark:text-gray-300">• Developer tools platform</li>
                          </>
                        )}
                        {selectedDomain.category === "network" && (
                          <>
                            <li className="text-gray-700 dark:text-gray-300">• Social networking site</li>
                            <li className="text-gray-700 dark:text-gray-300">• Community forum</li>
                            <li className="text-gray-700 dark:text-gray-300">• Content sharing platform</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => toggleFavorite(selectedDomain.name)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md ${
                        favorites.has(selectedDomain.name)
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${favorites.has(selectedDomain.name) ? "fill-red-500" : ""}`} />
                      <span>{favorites.has(selectedDomain.name) ? "Favorited" : "Add to Favorites"}</span>
                    </button>

                    <a
                      href={`https://whois.domaintools.com/${selectedDomain.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Check Availability</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
