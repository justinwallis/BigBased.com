"use client"

import type React from "react"

import { useState, useEffect, useRef, useMemo } from "react"
import { Search, X, TrendingUp, Layout, FileText, Layers, GitBranch, Info } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { useMobile } from "@/hooks/use-mobile"

// Define the same custom event name used in side-menu.tsx
const OPEN_SEARCH_EVENT = "bb:openSearchPopup"

type SearchPopupProps = {
  isOpen: boolean
  onClose: () => void
}

type CategoryType = {
  id: string
  name: string
  icon: React.ReactNode
}

type SearchableItem = {
  id: string
  name: string
  description?: string
  image?: string
  icon?: string
  href: string
  type: "feature" | "screen" | "page" | "content"
  tags?: string[]
}

const categories: CategoryType[] = [
  { id: "all", name: "All Results", icon: <Search className="h-5 w-5" /> },
  { id: "features", name: "Features", icon: <TrendingUp className="h-5 w-5" /> },
  { id: "screens", name: "Screens", icon: <Layout className="h-5 w-5" /> },
  { id: "pages", name: "Content Pages", icon: <FileText className="h-5 w-5" /> },
  { id: "ui", name: "UI Elements", icon: <Layers className="h-5 w-5" /> },
  { id: "flows", name: "User Flows", icon: <GitBranch className="h-5 w-5" /> },
]

// Combined searchable items
const searchableItems: SearchableItem[] = [
  // Features
  {
    id: "feature-1",
    name: "Digital Library",
    description: "Access our collection of digital resources",
    icon: "/digital-library.png",
    href: "/features/library",
    type: "feature",
    tags: ["books", "resources", "library", "reading", "education"],
  },
  {
    id: "feature-2",
    name: "Community",
    description: "Connect with like-minded individuals",
    icon: "/diverse-community-gathering.png",
    href: "/features/community",
    type: "feature",
    tags: ["people", "network", "social", "connect", "community"],
  },
  {
    id: "feature-3",
    name: "Resources",
    description: "Tools and resources for your journey",
    icon: "/resource-toolkit.png",
    href: "/features/resources",
    type: "feature",
    tags: ["tools", "resources", "help", "support", "materials"],
  },
  {
    id: "feature-4",
    name: "Revolution",
    description: "Join the cultural revolution",
    icon: "/revolution-background.png",
    href: "/revolution",
    type: "feature",
    tags: ["change", "movement", "action", "revolution", "transform"],
  },
  {
    id: "feature-5",
    name: "Partners",
    description: "Our network of trusted partners",
    icon: "/partnership-hands.png",
    href: "/partners",
    type: "feature",
    tags: ["allies", "network", "collaboration", "partners", "organizations"],
  },
  {
    id: "feature-6",
    name: "Transform",
    description: "Tools for personal and cultural transformation",
    icon: "/abstract-digital-landscape.png",
    href: "/transform",
    type: "feature",
    tags: ["change", "growth", "development", "transform", "improve"],
  },

  // Screens
  {
    id: "screen-1",
    name: "Home",
    description: "Main landing page",
    image: "/website-preview.png",
    href: "/",
    type: "screen",
    tags: ["home", "main", "landing", "start"],
  },
  {
    id: "screen-2",
    name: "About",
    description: "Learn about our mission and vision",
    image: "/mission-statement-document.png",
    href: "/about",
    type: "screen",
    tags: ["about", "mission", "vision", "purpose", "organization"],
  },
  {
    id: "screen-3",
    name: "Features",
    description: "Explore our platform features",
    image: "/digital-library.png",
    href: "/features",
    type: "screen",
    tags: ["features", "tools", "capabilities", "functions"],
  },
  {
    id: "screen-4",
    name: "Contact",
    description: "Get in touch with our team",
    image: "/diverse-group.png",
    href: "/contact",
    type: "screen",
    tags: ["contact", "support", "help", "reach", "message"],
  },
  {
    id: "screen-5",
    name: "Profile",
    description: "Manage your personal profile",
    image: "/abstract-profile.png",
    href: "/profile",
    type: "screen",
    tags: ["profile", "account", "personal", "settings", "user"],
  },
  {
    id: "screen-6",
    name: "FAQ",
    description: "Frequently asked questions",
    image: "/resource-toolkit.png",
    href: "/faq",
    type: "screen",
    tags: ["faq", "questions", "help", "support", "information"],
  },

  // Content Pages
  {
    id: "page-1",
    name: "Mission",
    description: "Our mission and purpose",
    image: "/mission-statement-document.png",
    href: "/about/mission",
    type: "page",
    tags: ["mission", "purpose", "goals", "vision", "values"],
  },
  {
    id: "page-2",
    name: "Team",
    description: "Meet our dedicated team",
    image: "/team-of-professionals.png",
    href: "/about/team",
    type: "page",
    tags: ["team", "people", "staff", "members", "leadership"],
  },
  {
    id: "page-3",
    name: "History",
    description: "The history of our movement",
    image: "/historical-timeline.png",
    href: "/about/history",
    type: "page",
    tags: ["history", "timeline", "past", "origins", "story"],
  },
  {
    id: "page-4",
    name: "Manifesto",
    description: "Our guiding principles",
    image: "/manifesto-document.png",
    href: "/revolution/manifesto",
    type: "page",
    tags: ["manifesto", "principles", "beliefs", "values", "philosophy"],
  },
]

// Tooltip component for category icons
function CategoryTooltip({
  show,
  children,
  isDarkMode,
}: {
  show: boolean
  children: React.ReactNode
  isDarkMode: boolean
}) {
  if (!show) return null

  return (
    <div
      className={cn(
        "absolute left-full ml-2 px-3 py-1.5 rounded-md text-sm whitespace-nowrap z-50",
        "transform transition-opacity duration-200",
        "shadow-lg",
        isDarkMode ? "bg-gray-800 text-white border border-gray-700" : "bg-white text-gray-900 border border-gray-200",
        show ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
      style={{ top: "50%", transform: "translateY(-50%)" }}
    >
      {children}
      {/* Triangle pointer */}
      <div
        className={cn(
          "absolute w-2 h-2 transform rotate-45 -left-1",
          isDarkMode ? "bg-gray-800 border-l border-b border-gray-700" : "bg-white border-l border-b border-gray-200",
        )}
        style={{ top: "50%", marginTop: "-4px" }}
      />
    </div>
  )
}

export default function SearchPopup({ isOpen, onClose }: SearchPopupProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [internalIsOpen, setInternalIsOpen] = useState(isOpen)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const resultsContainerRef = useRef<HTMLDivElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const { isMobile } = useMobile()
  const isDarkMode = theme === "dark"

  // Sync internal state with prop
  useEffect(() => {
    setInternalIsOpen(isOpen)
  }, [isOpen])

  // Listen for custom event to open search popup
  useEffect(() => {
    const handleOpenSearchEvent = () => {
      setInternalIsOpen(true)
    }

    // Listen for the custom event
    window.addEventListener(OPEN_SEARCH_EVENT, handleOpenSearchEvent)

    // Also expose a global function to open the search popup
    if (typeof window !== "undefined") {
      window.openSearchPopup = () => {
        setInternalIsOpen(true)
      }
    }

    return () => {
      window.removeEventListener(OPEN_SEARCH_EVENT, handleOpenSearchEvent)
      // Clean up global function
      if (typeof window !== "undefined") {
        window.openSearchPopup = undefined
      }
    }
  }, [])

  // Notify parent component when internal state changes
  useEffect(() => {
    if (!internalIsOpen && isOpen) {
      onClose()
    }
  }, [internalIsOpen, isOpen, onClose])

  // Focus the search input when the popup opens
  useEffect(() => {
    if (internalIsOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [internalIsOpen])

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setInternalIsOpen(false)
        onClose()
      }
    }

    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  // Prevent body scrolling when popup is open
  useEffect(() => {
    if (internalIsOpen) {
      // Save the current overflow style
      const originalOverflow = document.body.style.overflow
      // Prevent scrolling on the body
      document.body.style.overflow = "hidden"

      // Restore original overflow when component unmounts or popup closes
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [internalIsOpen])

  // Prevent scroll events from closing the popup
  useEffect(() => {
    if (!internalIsOpen) return

    const handleWheel = (e: WheelEvent) => {
      // Check if the event target is inside the popup
      if (popupRef.current && popupRef.current.contains(e.target as Node)) {
        // Don't do anything special, just let the scroll happen within the popup
        return
      }

      // If we're here, the wheel event is outside the popup, so prevent it
      e.preventDefault()
    }

    const handleTouchMove = (e: TouchEvent) => {
      // Check if the event target is inside the popup
      if (popupRef.current && popupRef.current.contains(e.target as Node)) {
        // Don't do anything special, just let the touch move happen within the popup
        return
      }

      // If we're here, the touch move is outside the popup, so prevent it
      e.preventDefault()
    }

    // Add event listeners to the document
    document.addEventListener("wheel", handleWheel, { passive: false })
    document.addEventListener("touchmove", handleTouchMove, { passive: false })

    return () => {
      // Clean up event listeners
      document.removeEventListener("wheel", handleWheel)
      document.removeEventListener("touchmove", handleTouchMove)
    }
  }, [internalIsOpen])

  // Search functionality
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) {
      // If no search term, return all items or filtered by category
      return selectedCategory === "all"
        ? searchableItems
        : searchableItems.filter((item) => {
            if (selectedCategory === "features") return item.type === "feature"
            if (selectedCategory === "screens") return item.type === "screen"
            if (selectedCategory === "pages") return item.type === "page"
            return true
          })
    }

    const searchTermLower = searchTerm.toLowerCase().trim()

    // Search through all items
    return searchableItems.filter((item) => {
      // Filter by category if needed
      if (selectedCategory !== "all") {
        if (selectedCategory === "features" && item.type !== "feature") return false
        if (selectedCategory === "screens" && item.type !== "screen") return false
        if (selectedCategory === "pages" && item.type !== "page") return false
      }

      // Search in name
      if (item.name.toLowerCase().includes(searchTermLower)) return true

      // Search in description
      if (item.description?.toLowerCase().includes(searchTermLower)) return true

      // Search in tags
      if (item.tags?.some((tag) => tag.toLowerCase().includes(searchTermLower))) return true

      return false
    })
  }, [searchTerm, selectedCategory])

  // Group items by type for display
  const groupedItems = useMemo(() => {
    const grouped = {
      features: filteredItems.filter((item) => item.type === "feature"),
      screens: filteredItems.filter((item) => item.type === "screen"),
      pages: filteredItems.filter((item) => item.type === "page"),
    }

    return grouped
  }, [filteredItems])

  if (!internalIsOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if the click is directly on the backdrop
    if (e.target === e.currentTarget) {
      setInternalIsOpen(false)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center" onClick={handleBackdropClick}>
      {/* Backdrop */}
      <div className={cn("absolute inset-0 backdrop-blur-sm", isDarkMode ? "bg-black/70" : "bg-gray-500/30")} />

      {/* Search Popup */}
      <div
        ref={popupRef}
        className={cn(
          "relative w-full max-w-4xl h-[85vh] rounded-lg shadow-2xl overflow-hidden flex flex-col",
          isDarkMode ? "bg-gray-900" : "bg-white",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Responsive: icons only on mobile */}
          <div
            className={cn(
              "border-r flex-shrink-0",
              isDarkMode ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200",
              isMobile ? "w-16" : "w-64",
            )}
          >
            <div className="space-y-2 p-4">
              {categories.map((category) => (
                <div key={category.id} className="relative">
                  <button
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
                    onMouseEnter={() => isMobile && setHoveredCategory(category.id)}
                    onMouseLeave={() => isMobile && setHoveredCategory(null)}
                  >
                    <span className={cn("flex-shrink-0", isMobile ? "mr-0" : "mr-3")}>{category.icon}</span>
                    {!isMobile && <span className="truncate">{category.name}</span>}
                  </button>

                  {/* Tooltip that appears on hover in mobile mode */}
                  {isMobile && (
                    <CategoryTooltip show={hoveredCategory === category.id} isDarkMode={isDarkMode}>
                      {category.name}
                    </CategoryTooltip>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search Bar - Fixed at top */}
            <div
              className={cn(
                "p-4 border-b sticky top-0 z-10",
                isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200",
              )}
            >
              <div className="relative">
                <Search
                  className={cn(
                    "absolute left-3 top-1/2 transform -translate-y-1/2",
                    isDarkMode ? "text-gray-400" : "text-gray-500",
                  )}
                />
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
                <button
                  className={cn(
                    "absolute right-3 top-1/2 transform -translate-y-1/2",
                    isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900",
                  )}
                  onClick={() => {
                    setInternalIsOpen(false)
                    onClose()
                  }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Results Area */}
            <div
              ref={resultsContainerRef}
              className={cn("flex-1 overflow-y-auto overscroll-contain p-6", isDarkMode ? "bg-gray-900" : "bg-white")}
            >
              {/* Search Results */}
              {searchTerm && (
                <div className="mb-6">
                  <h3 className={cn("text-sm font-medium mb-2", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                    Search Results for "{searchTerm}"
                  </h3>
                  {filteredItems.length === 0 ? (
                    <div className={cn("text-center py-8", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                      No results found for "{searchTerm}"
                    </div>
                  ) : (
                    <div className="text-sm mb-2">
                      Found {filteredItems.length} {filteredItems.length === 1 ? "result" : "results"}
                    </div>
                  )}
                </div>
              )}

              {/* Features Section */}
              {(!searchTerm || groupedItems.features.length > 0) && (
                <div className="mb-8">
                  <h3 className={cn("text-sm font-medium mb-4", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                    Features
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {(searchTerm ? groupedItems.features : filteredItems.filter((item) => item.type === "feature")).map(
                      (item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          className={cn(
                            "flex flex-col items-center justify-center p-3 rounded-lg transition-colors",
                            isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100",
                          )}
                          onClick={() => {
                            setInternalIsOpen(false)
                            onClose()
                          }}
                        >
                          <div className="relative w-12 h-12 mb-2 rounded-lg overflow-hidden">
                            <Image
                              src={item.icon || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className={cn("text-xs text-center", isDarkMode ? "text-white" : "text-gray-900")}>
                            {item.name}
                          </span>
                        </Link>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Screens Section */}
              {(!searchTerm || groupedItems.screens.length > 0) && (
                <div className="mb-8">
                  <h3 className={cn("text-sm font-medium mb-4", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                    Screens
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(searchTerm ? groupedItems.screens : filteredItems.filter((item) => item.type === "screen")).map(
                      (item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          className="group"
                          onClick={() => {
                            setInternalIsOpen(false)
                            onClose()
                          }}
                        >
                          <div
                            className={cn(
                              "relative aspect-[4/3] rounded-lg overflow-hidden mb-2 border group-hover:border-blue-500 transition-colors",
                              isDarkMode ? "border-gray-800" : "border-gray-200",
                            )}
                          >
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className={cn("text-sm", isDarkMode ? "text-white" : "text-gray-900")}>
                            {item.name}
                          </span>
                          {item.description && (
                            <p className={cn("text-xs mt-1", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                              {item.description}
                            </p>
                          )}
                        </Link>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Content Pages Section */}
              {(!searchTerm || groupedItems.pages.length > 0) && (
                <div className="mb-8">
                  <h3 className={cn("text-sm font-medium mb-4", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                    Content Pages
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(searchTerm ? groupedItems.pages : filteredItems.filter((item) => item.type === "page")).map(
                      (item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          className="group"
                          onClick={() => {
                            setInternalIsOpen(false)
                            onClose()
                          }}
                        >
                          <div
                            className={cn(
                              "relative aspect-[4/3] rounded-lg overflow-hidden mb-2 border group-hover:border-blue-500 transition-colors",
                              isDarkMode ? "border-gray-800" : "border-gray-200",
                            )}
                          >
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className={cn("text-sm", isDarkMode ? "text-white" : "text-gray-900")}>
                            {item.name}
                          </span>
                          {item.description && (
                            <p className={cn("text-xs mt-1", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                              {item.description}
                            </p>
                          )}
                        </Link>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={cn(
            "border-t p-3 text-xs flex items-center",
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
