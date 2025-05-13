"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  LayoutGrid,
  Network,
  Map,
  ChevronDown,
  ChevronRight,
  Home,
  Info,
  BookOpen,
  Users,
  Share2,
  Mail,
  Shield,
  Search,
  X,
} from "lucide-react"

// Define the site structure
const siteStructure = [
  {
    id: "home",
    title: "Home",
    path: "/",
    icon: <Home className="w-5 h-5" />,
    description: "Return to the main page",
    keywords: ["home", "main", "landing", "start"],
  },
  {
    id: "about",
    title: "About",
    path: "/about",
    icon: <Info className="w-5 h-5" />,
    description: "Learn about our mission and team",
    keywords: ["about", "mission", "team", "history", "values", "company"],
    children: [
      {
        id: "mission",
        title: "Our Mission",
        path: "/about/mission",
        description: "Our core values and purpose",
        keywords: ["mission", "values", "purpose", "goals"],
      },
      {
        id: "team",
        title: "Our Team",
        path: "/about/team",
        description: "Meet the people behind Big Based",
        keywords: ["team", "staff", "employees", "leadership", "management"],
      },
      {
        id: "history",
        title: "History",
        path: "/about/history",
        description: "Our journey from inception to today",
        keywords: ["history", "timeline", "journey", "story", "past"],
      },
    ],
  },
  {
    id: "revolution",
    title: "Revolution",
    path: "/revolution",
    icon: <BookOpen className="w-5 h-5" />,
    description: "Explore our revolutionary ideas",
    keywords: ["revolution", "change", "movement", "manifesto", "ideas"],
    children: [
      {
        id: "manifesto",
        title: "Manifesto",
        path: "/revolution/manifesto",
        description: "The foundational principles",
        keywords: ["manifesto", "principles", "foundation", "beliefs"],
      },
      {
        id: "movement",
        title: "The Movement",
        path: "/revolution/movement",
        description: "How we're changing culture",
        keywords: ["movement", "culture", "change", "impact", "influence"],
      },
      {
        id: "join",
        title: "Join Us",
        path: "/revolution/join",
        description: "Become part of the revolution",
        keywords: ["join", "participate", "membership", "involvement", "contribute"],
      },
    ],
  },
  {
    id: "features",
    title: "Features",
    path: "/features",
    icon: <Users className="w-5 h-5" />,
    description: "Discover our platform features",
    keywords: ["features", "platform", "tools", "capabilities", "services"],
    children: [
      {
        id: "library",
        title: "Truth Library",
        path: "/features/library",
        description: "Access our resource collection",
        keywords: ["library", "resources", "collection", "knowledge", "information"],
      },
      {
        id: "community",
        title: "Community",
        path: "/features/community",
        description: "Connect with others",
        keywords: ["community", "connect", "network", "members", "forum"],
      },
      {
        id: "resources",
        title: "Resources",
        path: "/features/resources",
        description: "Tools and materials",
        keywords: ["resources", "tools", "materials", "downloads", "guides"],
      },
    ],
  },
  {
    id: "partners",
    title: "Partners",
    path: "/partners",
    icon: <Share2 className="w-5 h-5" />,
    description: "Our network of allies",
    keywords: ["partners", "allies", "network", "collaboration", "organizations"],
    children: [
      {
        id: "organizations",
        title: "Organizations",
        path: "/partners/organizations",
        description: "Allied organizations",
        keywords: ["organizations", "allies", "institutions", "associations"],
      },
      {
        id: "companies",
        title: "Companies",
        path: "/partners/companies",
        description: "Corporate partners",
        keywords: ["companies", "corporate", "business", "industry", "enterprises"],
      },
      {
        id: "become",
        title: "Become a Partner",
        path: "/partners/become",
        description: "Join our network",
        keywords: ["become", "join", "apply", "partnership", "collaboration"],
      },
    ],
  },
  {
    id: "contact",
    title: "Contact",
    path: "/contact",
    icon: <Mail className="w-5 h-5" />,
    description: "Get in touch with us",
    keywords: ["contact", "reach", "message", "email", "phone", "support"],
  },
  {
    id: "legal",
    title: "Legal",
    path: "#",
    icon: <Shield className="w-5 h-5" />,
    description: "Legal information",
    keywords: ["legal", "terms", "privacy", "policy", "disclaimer", "copyright"],
    children: [
      {
        id: "privacy",
        title: "Privacy Policy",
        path: "/privacy",
        description: "Our privacy practices",
        keywords: ["privacy", "policy", "data", "information", "protection"],
      },
      {
        id: "disclaimer",
        title: "Disclaimer",
        path: "/disclaimer",
        description: "Important disclaimers",
        keywords: ["disclaimer", "liability", "responsibility", "notice"],
      },
      {
        id: "terms",
        title: "Terms of Service",
        path: "/terms",
        description: "Terms and conditions",
        keywords: ["terms", "conditions", "service", "agreement", "rules"],
      },
    ],
  },
]

// Flatten the site structure for search
const flattenSiteStructure = (structure) => {
  const flattenedItems = []

  structure.forEach((item) => {
    flattenedItems.push({
      id: item.id,
      title: item.title,
      path: item.path,
      description: item.description,
      icon: item.icon,
      keywords: item.keywords || [],
      parent: null,
    })

    if (item.children && item.children.length > 0) {
      item.children.forEach((child) => {
        flattenedItems.push({
          id: child.id,
          title: child.title,
          path: child.path,
          description: child.description,
          keywords: child.keywords || [],
          parent: item.id,
        })
      })
    }
  })

  return flattenedItems
}

const flattenedItems = flattenSiteStructure(siteStructure)

// View types
type ViewType = "grid" | "tree" | "map"

export default function EnhancedInlineSitemap() {
  const [view, setView] = useState<ViewType>("grid")
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState(flattenedItems)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Handle search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(flattenedItems)
      return
    }

    const query = searchQuery.toLowerCase()
    const results = flattenedItems.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.keywords?.some((keyword) => keyword.toLowerCase().includes(query)),
    )

    // Expand parent sections of search results
    const parentsToExpand = results
      .filter((item) => item.parent)
      .map((item) => item.parent)
      .filter((value, index, self) => self.indexOf(value) === index)

    setExpandedSections((prev) => {
      const newExpanded = [...prev]
      parentsToExpand.forEach((parent) => {
        if (!newExpanded.includes(parent)) {
          newExpanded.push(parent)
        }
      })
      return newExpanded
    })

    setSearchResults(results)
  }, [searchQuery])

  // Toggle section expansion
  const toggleSection = (id: string) => {
    setExpandedSections((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  // Check if section is expanded
  const isSectionExpanded = (id: string) => expandedSections.includes(id)

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  // Highlight search terms in text
  const highlightSearchTerms = (text: string) => {
    if (!searchQuery.trim()) return text

    const regex = new RegExp(`(${searchQuery})`, "gi")
    const parts = text.split(regex)

    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span key={i} className="bg-yellow-200 dark:bg-yellow-800 text-black dark:text-white">
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </>
    )
  }

  // Render view selector
  const ViewSelector = () => (
    <div className="flex justify-center mb-8 space-x-2">
      <button
        onClick={() => setView("grid")}
        className={`flex items-center px-4 py-2 rounded-md transition-all ${
          view === "grid"
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        }`}
        aria-label="Grid View"
      >
        <LayoutGrid className="w-4 h-4 mr-2" />
        <span>Grid</span>
      </button>
      <button
        onClick={() => setView("tree")}
        className={`flex items-center px-4 py-2 rounded-md transition-all ${
          view === "tree"
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        }`}
        aria-label="Tree View"
      >
        <Network className="w-4 h-4 mr-2" />
        <span>Tree</span>
      </button>
      <button
        onClick={() => setView("map")}
        className={`flex items-center px-4 py-2 rounded-md transition-all ${
          view === "map"
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        }`}
        aria-label="Map View"
      >
        <Map className="w-4 h-4 mr-2" />
        <span>Map</span>
      </button>
    </div>
  )

  // Search component
  const SearchComponent = () => (
    <div className="mb-8 max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search site navigation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {searchQuery && (
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Found {searchResults.length} {searchResults.length === 1 ? "result" : "results"}
        </div>
      )}
    </div>
  )

  // Grid View Component
  const GridView = () => {
    // Filter the site structure based on search results
    const filteredStructure = siteStructure
      .map((section) => {
        // Check if this section or any of its children are in search results
        const sectionInResults = searchResults.some((item) => item.id === section.id)
        const childrenInResults = section.children?.filter((child) =>
          searchResults.some((item) => item.id === child.id),
        )

        // If neither section nor children are in results, don't include
        if (!sectionInResults && (!childrenInResults || childrenInResults.length === 0)) {
          return null
        }

        // Return section with filtered children
        return {
          ...section,
          children: childrenInResults || [],
        }
      })
      .filter(Boolean) // Remove null items

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredStructure.map((section) => (
          <motion.div
            key={section.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
            whileHover={{ y: -5 }}
            onMouseEnter={() => setHoveredItem(section.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div
              className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center cursor-pointer"
              onClick={() => section.children && toggleSection(section.id)}
            >
              <div className="flex items-center">
                <div className="mr-3 text-gray-700 dark:text-gray-300">{section.icon}</div>
                <Link href={section.path} className="font-medium text-lg hover:underline">
                  {highlightSearchTerms(section.title)}
                </Link>
              </div>
              {section.children && section.children.length > 0 && (
                <button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label={isSectionExpanded(section.id) ? "Collapse section" : "Expand section"}
                >
                  {isSectionExpanded(section.id) ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>

            <AnimatePresence>
              {section.children && section.children.length > 0 && isSectionExpanded(section.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-gray-50 dark:bg-gray-900">
                    <ul className="space-y-2">
                      {section.children.map((child) => (
                        <li key={child.id} className="ml-6">
                          <Link
                            href={child.path}
                            className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white flex items-center"
                          >
                            <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full mr-2"></div>
                            {highlightSearchTerms(child.title)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">{highlightSearchTerms(section.description)}</p>
            </div>
          </motion.div>
        ))}

        {filteredStructure.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No results found for "{searchQuery}"</p>
            <button onClick={clearSearch} className="mt-2 text-black dark:text-white underline">
              Clear search
            </button>
          </div>
        )}
      </motion.div>
    )
  }

  // Tree View Component
  const TreeView = () => {
    // Filter the site structure based on search results
    const filteredStructure = siteStructure
      .map((section) => {
        // Check if this section or any of its children are in search results
        const sectionInResults = searchResults.some((item) => item.id === section.id)
        const childrenInResults = section.children?.filter((child) =>
          searchResults.some((item) => item.id === child.id),
        )

        // If neither section nor children are in results, don't include
        if (!sectionInResults && (!childrenInResults || childrenInResults.length === 0)) {
          return null
        }

        // Return section with filtered children
        return {
          ...section,
          children: childrenInResults || [],
        }
      })
      .filter(Boolean) // Remove null items

    const centerX = containerWidth / 2
    const nodeRadius = 40

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative"
        style={{ height: "500px" }}
      >
        {filteredStructure.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">No results found for "{searchQuery}"</p>
              <button onClick={clearSearch} className="mt-2 text-black dark:text-white underline">
                Clear search
              </button>
            </div>
          </div>
        ) : (
          <>
            <svg width="100%" height="100%" className="absolute top-0 left-0 z-0">
              {/* Draw connections */}
              {filteredStructure.map((section, index) => {
                const x = centerX
                const y = 60
                const childCount = section.children?.length || 0
                const angleStep = Math.PI / (filteredStructure.length + 1)
                const angle = angleStep * (index + 1)
                const radius = 180
                const sectionX = centerX + radius * Math.cos(angle)
                const sectionY = y + radius * Math.sin(angle)

                return (
                  <g key={section.id}>
                    {/* Line from home to section */}
                    <line
                      x1={x}
                      y1={y}
                      x2={sectionX}
                      y2={sectionY}
                      stroke="currentColor"
                      className="text-gray-300 dark:text-gray-700"
                      strokeWidth="2"
                      strokeDasharray={hoveredItem === section.id ? "5,5" : ""}
                    />

                    {/* Lines from section to children */}
                    {section.children &&
                      section.children.map((child, childIndex) => {
                        const childAngleStep = Math.PI / (childCount + 1)
                        const childAngle = angle - Math.PI / 4 + childAngleStep * (childIndex + 1)
                        const childRadius = 100
                        const childX = sectionX + childRadius * Math.cos(childAngle)
                        const childY = sectionY + childRadius * Math.sin(childAngle)

                        return (
                          <line
                            key={child.id}
                            x1={sectionX}
                            y1={sectionY}
                            x2={childX}
                            y2={childY}
                            stroke="currentColor"
                            className="text-gray-300 dark:text-gray-700"
                            strokeWidth="1.5"
                            strokeDasharray={hoveredItem === child.id ? "5,5" : ""}
                          />
                        )
                      })}
                  </g>
                )
              })}
            </svg>

            {/* Home node at center */}
            {filteredStructure.some((section) => section.id === "home") && (
              <motion.div
                className="absolute z-10 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black rounded-full shadow-lg cursor-pointer"
                style={{
                  width: nodeRadius * 1.5,
                  height: nodeRadius * 1.5,
                  left: centerX - nodeRadius * 0.75,
                  top: 60 - nodeRadius * 0.75,
                }}
                whileHover={{ scale: 1.1 }}
                onMouseEnter={() => setHoveredItem("home")}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link href="/" className="flex items-center justify-center w-full h-full">
                  <Home className="w-6 h-6" />
                </Link>
              </motion.div>
            )}

            {/* Section nodes */}
            {filteredStructure.map((section, index) => {
              if (section.id === "home") return null // Skip home, already rendered

              const angleStep = Math.PI / filteredStructure.length
              const angle = angleStep * (index + (filteredStructure[0].id === "home" ? 0 : 1))
              const radius = 180
              const x = centerX + radius * Math.cos(angle)
              const y = 60 + radius * Math.sin(angle)
              const childCount = section.children?.length || 0

              return (
                <div key={section.id}>
                  <motion.div
                    className={`absolute z-10 flex items-center justify-center rounded-full shadow-md cursor-pointer
                      ${
                        hoveredItem === section.id
                          ? "bg-black text-white dark:bg-white dark:text-black"
                          : "bg-white text-black dark:bg-gray-800 dark:text-white"
                      }`}
                    style={{
                      width: nodeRadius,
                      height: nodeRadius,
                      left: x - nodeRadius / 2,
                      top: y - nodeRadius / 2,
                    }}
                    whileHover={{ scale: 1.1 }}
                    onMouseEnter={() => setHoveredItem(section.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Link href={section.path} className="flex items-center justify-center w-full h-full">
                      {section.icon}
                    </Link>

                    <motion.div
                      className="absolute whitespace-nowrap bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-md text-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        opacity: hoveredItem === section.id ? 1 : 0,
                        y: hoveredItem === section.id ? 0 : 10,
                      }}
                      style={{
                        top: nodeRadius + 5,
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                    >
                      {section.title}
                    </motion.div>
                  </motion.div>

                  {/* Child nodes */}
                  {section.children &&
                    section.children.map((child, childIndex) => {
                      const childAngleStep = Math.PI / (childCount + 1)
                      const childAngle = angle - Math.PI / 4 + childAngleStep * (childIndex + 1)
                      const childRadius = 100
                      const childX = x + childRadius * Math.cos(childAngle)
                      const childY = y + childRadius * Math.sin(childAngle)

                      return (
                        <motion.div
                          key={child.id}
                          className={`absolute z-10 flex items-center justify-center rounded-full shadow-sm cursor-pointer
                          ${
                            hoveredItem === child.id
                              ? "bg-black text-white dark:bg-white dark:text-black"
                              : "bg-white text-black dark:bg-gray-800 dark:text-white"
                          }`}
                          style={{
                            width: nodeRadius * 0.7,
                            height: nodeRadius * 0.7,
                            left: childX - nodeRadius * 0.35,
                            top: childY - nodeRadius * 0.35,
                          }}
                          whileHover={{ scale: 1.1 }}
                          onMouseEnter={() => setHoveredItem(child.id)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          <Link href={child.path} className="flex items-center justify-center w-full h-full">
                            <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                          </Link>

                          <motion.div
                            className="absolute whitespace-nowrap bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-md text-xs"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                              opacity: hoveredItem === child.id ? 1 : 0,
                              y: hoveredItem === child.id ? 0 : 10,
                            }}
                            style={{
                              top: nodeRadius * 0.7 + 5,
                              left: "50%",
                              transform: "translateX(-50%)",
                            }}
                          >
                            {child.title}
                          </motion.div>
                        </motion.div>
                      )
                    })}
                </div>
              )
            })}
          </>
        )}
      </motion.div>
    )
  }

  // Map View Component
  const MapView = () => {
    // Filter the site structure based on search results
    const filteredStructure = siteStructure
      .map((section) => {
        // Check if this section or any of its children are in search results
        const sectionInResults = searchResults.some((item) => item.id === section.id)
        const childrenInResults = section.children?.filter((child) =>
          searchResults.some((item) => item.id === child.id),
        )

        // If neither section nor children are in results, don't include
        if (!sectionInResults && (!childrenInResults || childrenInResults.length === 0)) {
          return null
        }

        // Return section with filtered children
        return {
          ...section,
          children: childrenInResults || [],
        }
      })
      .filter(Boolean) // Remove null items

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative bg-gray-100 dark:bg-gray-900 rounded-lg p-6 overflow-hidden"
        style={{ height: "500px" }}
      >
        {filteredStructure.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">No results found for "{searchQuery}"</p>
              <button onClick={clearSearch} className="mt-2 text-black dark:text-white underline">
                Clear search
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Background grid */}
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-12">
              {Array.from({ length: 12 }).map((_, rowIndex) =>
                Array.from({ length: 12 }).map((_, colIndex) => (
                  <div key={`${rowIndex}-${colIndex}`} className="border border-gray-200 dark:border-gray-800" />
                )),
              )}
            </div>

            {/* Main sections */}
            <div className="relative z-10 h-full">
              {/* Home section - center */}
              {filteredStructure.some((section) => section.id === "home") && (
                <motion.div
                  className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black dark:bg-white text-white dark:text-black rounded-lg shadow-lg p-4 w-24 h-24 flex flex-col items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  onMouseEnter={() => setHoveredItem("home")}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link href="/" className="flex flex-col items-center">
                    <Home className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Home</span>
                  </Link>
                </motion.div>
              )}

              {/* Position sections around home */}
              {filteredStructure
                .filter((section) => section.id !== "home")
                .map((section, index) => {
                  // Calculate position based on index
                  const totalSections =
                    filteredStructure.length - (filteredStructure.some((s) => s.id === "home") ? 1 : 0)
                  const angle = (index / Math.max(1, totalSections)) * 2 * Math.PI
                  const radius = 180
                  const x = Math.cos(angle) * radius + 50
                  const y = Math.sin(angle) * radius + 50

                  return (
                    <motion.div
                      key={section.id}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md p-3 w-20 h-20 flex flex-col items-center justify-center cursor-pointer
                      ${
                        hoveredItem === section.id
                          ? "bg-black text-white dark:bg-white dark:text-black"
                          : "bg-white text-black dark:bg-gray-800 dark:text-white"
                      }`}
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                      }}
                      whileHover={{ scale: 1.1 }}
                      onMouseEnter={() => setHoveredItem(section.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      onClick={() => section.children && toggleSection(section.id)}
                    >
                      <Link href={section.path} className="flex flex-col items-center">
                        {section.icon}
                        <span className="text-xs font-medium mt-1">{section.title}</span>
                      </Link>

                      {/* Show children when section is expanded */}
                      <AnimatePresence>
                        {section.children && section.children.length > 0 && isSectionExpanded(section.id) && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute z-20 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 min-w-[150px]"
                            style={{
                              top: "100%",
                              left: "50%",
                              transform: "translateX(-50%)",
                            }}
                          >
                            <ul className="space-y-2">
                              {section.children.map((child) => (
                                <li key={child.id}>
                                  <Link
                                    href={child.path}
                                    className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white text-sm flex items-center"
                                  >
                                    <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full mr-2"></div>
                                    {highlightSearchTerms(child.title)}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}

              {/* Draw connecting lines */}
              <svg className="absolute inset-0 z-0 w-full h-full pointer-events-none">
                {filteredStructure
                  .filter((section) => section.id !== "home")
                  .map((section, index) => {
                    const totalSections =
                      filteredStructure.length - (filteredStructure.some((s) => s.id === "home") ? 1 : 0)
                    const angle = (index / Math.max(1, totalSections)) * 2 * Math.PI
                    const radius = 180
                    const x = Math.cos(angle) * radius + 50 + containerWidth / 2
                    const y = Math.sin(angle) * radius + 50 + 250

                    return (
                      <line
                        key={section.id}
                        x1={containerWidth / 2}
                        y1={250}
                        x2={x}
                        y2={y}
                        stroke="currentColor"
                        className={`${
                          hoveredItem === section.id ? "text-black dark:text-white" : "text-gray-300 dark:text-gray-700"
                        }`}
                        strokeWidth={hoveredItem === section.id ? "2" : "1"}
                        strokeDasharray={hoveredItem === section.id ? "5,5" : ""}
                      />
                    )
                  })}
              </svg>
            </div>
          </>
        )}
      </motion.div>
    )
  }

  return (
    <section className="py-12 px-4 md:px-8 lg:px-16 bg-gray-50 dark:bg-gray-900" ref={containerRef}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Site Navigation</h2>
          <p className="text-gray-600 dark:text-gray-400">Explore our website through different interactive views</p>
        </div>

        <SearchComponent />
        <ViewSelector />

        <AnimatePresence mode="wait">
          {view === "grid" && <GridView />}
          {view === "tree" && <TreeView />}
          {view === "map" && <MapView />}
        </AnimatePresence>
      </div>
    </section>
  )
}
