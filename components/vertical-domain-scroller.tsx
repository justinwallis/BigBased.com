"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { generateAllDomains } from "@/utils/domain-generator"
import { motion } from "framer-motion"
import { Search, Filter, X, ChevronDown } from "lucide-react"
import DomainCollectionBackground from "./domain-collection-background"

interface DomainItemProps {
  domain: { name: string; category: string }
  index: number
  totalVisible: number
}

// Component for individual domain items with styling based on position
const DomainItem = ({ domain, index, totalVisible }: DomainItemProps) => {
  // Calculate opacity based on position (for fade effect)
  const getOpacity = () => {
    // Center items are fully opaque
    if (index >= 1 && index < totalVisible - 1) return 1
    // Top and bottom items fade out
    return index === 0 ? 0.3 : index === totalVisible - 1 ? 0.3 : 1
  }

  // Calculate scale based on position (for focus effect)
  const getScale = () => {
    // Center items are full size
    if (index >= 1 && index < totalVisible - 1) return 1
    // Top and bottom items are slightly smaller
    return 0.95
  }

  // Split domain name and TLD for styling
  const [name, tld] = domain.name.split(/\.(?=[^.]+$)/)

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
        return "text-gray-800 dark:text-gray-200"
    }
  }

  // Get TLD color
  const getTldColor = (tld: string) => {
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

  return (
    <motion.div
      className="px-6 py-3 transition-all duration-200 flex items-center justify-between"
      style={{
        opacity: getOpacity(),
        scale: getScale(),
      }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="font-sans text-lg md:text-xl">
        <span className={getCategoryColor(domain.category)}>{name}</span>
        <span className={getTldColor(tld)}>.{tld}</span>
      </div>
      <div className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
        {domain.category}
      </div>
    </motion.div>
  )
}

// Filter dropdown component
const FilterDropdown = ({
  label,
  options,
  selectedOption,
  setSelectedOption,
}: {
  label: string
  options: string[]
  selectedOption: string
  setSelectedOption: (option: string) => void
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
      >
        <span>{selectedOption === "all" ? label : selectedOption}</span>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  setSelectedOption(option)
                  setIsOpen(false)
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  selectedOption === option
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function VerticalDomainScroller() {
  // State for domains and scrolling
  const [allDomains] = useState(() => generateAllDomains())
  const [filteredDomains, setFilteredDomains] = useState(allDomains)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)
  const [scrollVelocity, setScrollVelocity] = useState(1) // pixels per frame
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTld, setSelectedTld] = useState("all")

  // Refs for DOM elements and animation
  const parentRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const isDraggingRef = useRef(false)
  const lastTouchYRef = useRef(0)
  const lastScrollTopRef = useRef(0)
  const velocityRef = useRef(0)
  const velocityHistoryRef = useRef<number[]>([])
  const lastTimeRef = useRef(0)

  // Number of visible items (adjust based on screen size)
  const [visibleItems, setVisibleItems] = useState(7)

  // Extract unique categories and TLDs for filters
  const categories = useMemo(() => {
    const uniqueCategories = new Set(allDomains.map((domain) => domain.category))
    return ["all", ...Array.from(uniqueCategories)]
  }, [allDomains])

  const tlds = useMemo(() => {
    const uniqueTlds = new Set(allDomains.map((domain) => domain.name.split(".").pop()))
    return ["all", ...Array.from(uniqueTlds)] as string[]
  }, [allDomains])

  // Filter domains based on search query and selected filters
  useEffect(() => {
    let result = allDomains

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

    setFilteredDomains(result)
  }, [allDomains, searchQuery, selectedCategory, selectedTld])

  // Update visible items based on screen size
  useEffect(() => {
    const handleResize = () => {
      const height = window.innerHeight
      // Adjust number of visible items based on screen height
      if (height < 600) {
        setVisibleItems(5)
      } else if (height < 800) {
        setVisibleItems(7)
      } else {
        setVisibleItems(9)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Set up virtualization for efficient rendering
  const rowVirtualizer = useVirtualizer({
    count: filteredDomains.length || 1, // Ensure at least 1 item for empty state
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // estimated row height
    overscan: 5, // number of items to render outside of the visible area
  })

  // Handle auto-scrolling animation
  useEffect(() => {
    if (!isAutoScrolling || !parentRef.current || filteredDomains.length === 0) return

    let lastTime = 0
    const scrollStep = (timestamp: number) => {
      if (!parentRef.current) return

      // Calculate delta time for smooth animation regardless of frame rate
      const deltaTime = lastTime ? (timestamp - lastTime) / 16.67 : 1 // normalize to 60fps
      lastTime = timestamp

      // Apply scroll
      parentRef.current.scrollTop += scrollVelocity * deltaTime

      // Loop back to top when reaching the end
      if (parentRef.current.scrollTop >= rowVirtualizer.getTotalSize() - parentRef.current.clientHeight) {
        parentRef.current.scrollTop = 0
      }

      // Continue animation
      animationRef.current = requestAnimationFrame(scrollStep)
    }

    animationRef.current = requestAnimationFrame(scrollStep)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isAutoScrolling, rowVirtualizer, scrollVelocity, filteredDomains.length])

  // Handle mouse/touch interaction
  useEffect(() => {
    const parentElement = parentRef.current
    if (!parentElement) return

    // Mouse events
    const handleMouseDown = (e: MouseEvent) => {
      setIsAutoScrolling(false)
      isDraggingRef.current = true
      lastTouchYRef.current = e.clientY
      lastScrollTopRef.current = parentElement.scrollTop
      lastTimeRef.current = performance.now()
      velocityHistoryRef.current = []

      // Prevent text selection during drag
      document.body.style.userSelect = "none"
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return

      const deltaY = lastTouchYRef.current - e.clientY
      parentElement.scrollTop = lastScrollTopRef.current + deltaY

      // Calculate and store velocity
      const now = performance.now()
      const dt = now - lastTimeRef.current
      if (dt > 0) {
        const instantVelocity = (deltaY / dt) * 16.67 // normalize to 60fps
        velocityHistoryRef.current.push(instantVelocity)
        // Keep only the last 5 velocity samples
        if (velocityHistoryRef.current.length > 5) {
          velocityHistoryRef.current.shift()
        }
        lastTimeRef.current = now
      }

      lastTouchYRef.current = e.clientY
      lastScrollTopRef.current = parentElement.scrollTop
    }

    const handleMouseUp = () => {
      if (!isDraggingRef.current) return

      isDraggingRef.current = false
      document.body.style.userSelect = ""

      // Calculate average velocity from history
      if (velocityHistoryRef.current.length > 0) {
        const avgVelocity =
          velocityHistoryRef.current.reduce((sum, v) => sum + v, 0) / velocityHistoryRef.current.length

        // Apply momentum scrolling
        velocityRef.current = avgVelocity

        // Start deceleration animation
        let lastTimestamp = 0
        const decelerate = (timestamp: number) => {
          if (!parentElement) return

          const deltaTime = lastTimestamp ? (timestamp - lastTimestamp) / 16.67 : 1
          lastTimestamp = timestamp

          // Apply scroll with current velocity
          parentElement.scrollTop += velocityRef.current * deltaTime

          // Handle wrapping
          if (parentElement.scrollTop >= rowVirtualizer.getTotalSize() - parentElement.clientHeight) {
            parentElement.scrollTop = 0
          } else if (parentElement.scrollTop < 0) {
            parentElement.scrollTop = rowVirtualizer.getTotalSize() - parentElement.clientHeight
          }

          // Decelerate
          velocityRef.current *= 0.95

          // Continue animation until velocity is very small
          if (Math.abs(velocityRef.current) > 0.5) {
            requestAnimationFrame(decelerate)
          } else {
            // Resume auto-scrolling after deceleration
            setIsAutoScrolling(true)
          }
        }

        requestAnimationFrame(decelerate)
      } else {
        // If no velocity data, just resume auto-scrolling
        setIsAutoScrolling(true)
      }
    }

    // Touch events
    const handleTouchStart = (e: TouchEvent) => {
      setIsAutoScrolling(false)
      isDraggingRef.current = true
      lastTouchYRef.current = e.touches[0].clientY
      lastScrollTopRef.current = parentElement.scrollTop
      lastTimeRef.current = performance.now()
      velocityHistoryRef.current = []
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return

      const deltaY = lastTouchYRef.current - e.touches[0].clientY
      parentElement.scrollTop = lastScrollTopRef.current + deltaY

      // Calculate and store velocity
      const now = performance.now()
      const dt = now - lastTimeRef.current
      if (dt > 0) {
        const instantVelocity = (deltaY / dt) * 16.67 // normalize to 60fps
        velocityHistoryRef.current.push(instantVelocity)
        // Keep only the last 5 velocity samples
        if (velocityHistoryRef.current.length > 5) {
          velocityHistoryRef.current.shift()
        }
        lastTimeRef.current = now
      }

      lastTouchYRef.current = e.touches[0].clientY
      lastScrollTopRef.current = parentElement.scrollTop

      // Prevent page scrolling
      e.preventDefault()
    }

    const handleTouchEnd = () => {
      if (!isDraggingRef.current) return

      isDraggingRef.current = false

      // Calculate average velocity from history
      if (velocityHistoryRef.current.length > 0) {
        const avgVelocity =
          velocityHistoryRef.current.reduce((sum, v) => sum + v, 0) / velocityHistoryRef.current.length

        // Apply momentum scrolling
        velocityRef.current = avgVelocity

        // Start deceleration animation
        let lastTimestamp = 0
        const decelerate = (timestamp: number) => {
          if (!parentElement) return

          const deltaTime = lastTimestamp ? (timestamp - lastTimestamp) / 16.67 : 1
          lastTimestamp = timestamp

          // Apply scroll with current velocity
          parentElement.scrollTop += velocityRef.current * deltaTime

          // Handle wrapping
          if (parentElement.scrollTop >= rowVirtualizer.getTotalSize() - parentElement.clientHeight) {
            parentElement.scrollTop = 0
          } else if (parentElement.scrollTop < 0) {
            parentElement.scrollTop = rowVirtualizer.getTotalSize() - parentElement.clientHeight
          }

          // Decelerate
          velocityRef.current *= 0.95

          // Continue animation until velocity is very small
          if (Math.abs(velocityRef.current) > 0.5) {
            requestAnimationFrame(decelerate)
          } else {
            // Resume auto-scrolling after deceleration
            setIsAutoScrolling(true)
          }
        }

        requestAnimationFrame(decelerate)
      } else {
        // If no velocity data, just resume auto-scrolling
        setIsAutoScrolling(true)
      }
    }

    // Add event listeners
    parentElement.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    parentElement.addEventListener("touchstart", handleTouchStart, { passive: false })
    parentElement.addEventListener("touchmove", handleTouchMove, { passive: false })
    parentElement.addEventListener("touchend", handleTouchEnd)

    // Clean up
    return () => {
      parentElement.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      parentElement.removeEventListener("touchstart", handleTouchStart)
      parentElement.removeEventListener("touchmove", handleTouchMove)
      parentElement.removeEventListener("touchend", handleTouchEnd)
    }
  }, [rowVirtualizer])

  // Handle mouse enter/leave to pause/resume auto-scrolling
  const handleMouseEnter = useCallback(() => {
    setIsAutoScrolling(false)
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!isDraggingRef.current) {
      setIsAutoScrolling(true)
    }
  }, [])

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedTld("all")
  }

  return (
    <div className="bg-white dark:bg-gray-900 py-12 relative">
      <DomainCollectionBackground />
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          My Domain Collection
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Browse through my collection of {allDomains.length} premium domains
        </p>

        {/* Search and filter controls */}
        <div className="mb-6 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search domains..."
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label="Clear search"
              >
                <X size={18} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
              </button>
            )}
          </div>

          {/* Filter controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <FilterDropdown
              label="Category"
              options={categories}
              selectedOption={selectedCategory}
              setSelectedOption={setSelectedCategory}
            />

            <FilterDropdown
              label="TLD"
              options={tlds}
              selectedOption={selectedTld}
              setSelectedOption={setSelectedTld}
            />

            <button
              onClick={resetFilters}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none flex items-center justify-center"
              aria-label="Reset filters"
            >
              <Filter size={16} className="mr-2" />
              Reset
            </button>
          </div>

          {/* Results count */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredDomains.length} of {allDomains.length} domains
          </div>
        </div>

        <div className="relative mx-auto" style={{ maxWidth: "600px" }}>
          {/* Fade gradient at top */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white dark:from-gray-900 to-transparent z-10 pointer-events-none"></div>

          {/* Main scroller */}
          <div
            ref={parentRef}
            className="h-[420px] overflow-auto scrollbar-hide relative cursor-grab active:cursor-grabbing border border-gray-200 dark:border-gray-800 rounded-lg"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {filteredDomains.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <p className="mb-2">No domains found</p>
                <button
                  onClick={resetFilters}
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div
                ref={scrollerRef}
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow, arrayIndex) => {
                  const domain = filteredDomains[virtualRow.index % filteredDomains.length]
                  return (
                    <div
                      key={virtualRow.index}
                      className="absolute top-0 left-0 w-full"
                      style={{
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <DomainItem
                        domain={domain}
                        index={arrayIndex}
                        totalVisible={rowVirtualizer.getVirtualItems().length}
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Fade gradient at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-gray-900 to-transparent z-10 pointer-events-none"></div>

          {/* Instruction text */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">Scroll or drag to explore domains</p>
        </div>
      </div>
    </div>
  )
}
