"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { X, Search, Bell } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import BBLogo from "@/components/bb-logo"

const logos = [
  { name: "Organization 1", path: "/logos/org1.png" },
  { name: "Company 1", path: "/logos/company1.png" },
  { name: "College 1", path: "/logos/college1.png" },
  { name: "Social Org", path: "/logos/social.png" },
  { name: "Organization 2", path: "/logos/org2.png" },
  { name: "Company 2", path: "/logos/company2.png" },
]

// Sample data for search functionality
const searchableItems = [
  { title: "About BB", url: "/about" },
  { title: "Our Mission", url: "/about/mission" },
  { title: "Our Team", url: "/about/team" },
  { title: "Revolution", url: "/revolution" },
  { title: "Manifesto", url: "/revolution/manifesto" },
  { title: "Features", url: "/features" },
  { title: "Truth Library", url: "/features/library" },
  { title: "Partners", url: "/partners" },
  { title: "Contact", url: "/contact" },
  { title: "Join the Revolution", url: "/join" },
]

interface SideMenuProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  openWithSearch?: boolean
  onNotificationBellClick?: () => void
  isSubscribed?: boolean
}

export default function SideMenu({
  isOpen,
  setIsOpen,
  openWithSearch = false,
  onNotificationBellClick = () => {},
  isSubscribed = false,
}: SideMenuProps) {
  const [scrollY, setScrollY] = useState(0)
  const [menuPosition, setMenuPosition] = useState({ top: 0, startY: 0, isDragging: false })
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const searchInputRef = useRef<HTMLInputElement>(null)
  const initialRenderRef = useRef(true)

  // Check localStorage for saved menu state on initial render
  useEffect(() => {
    if (initialRenderRef.current && typeof window !== "undefined") {
      try {
        const savedMenuState = localStorage.getItem("menuIsOpen")
        if (savedMenuState === "true" && !isOpen) {
          setIsOpen(true)
        }
        initialRenderRef.current = false
      } catch (error) {
        console.error("Error reading menu state from localStorage:", error)
      }
    }
  }, [isOpen, setIsOpen])

  // Save menu state to localStorage whenever it changes
  useEffect(() => {
    if (!initialRenderRef.current && typeof window !== "undefined") {
      try {
        // Use the global function if available, otherwise save directly
        if (window.saveMenuState) {
          window.saveMenuState(isOpen)
        } else {
          localStorage.setItem("menuIsOpen", isOpen ? "true" : "false")
        }
      } catch (error) {
        console.error("Error saving menu state:", error)
      }
    }
  }, [isOpen])

  // Focus search input when openWithSearch is true
  useEffect(() => {
    if (isOpen && openWithSearch && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 300) // Delay to allow animation to complete
    }
  }, [isOpen, openWithSearch])

  // Handle search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([])
      return
    }

    const filteredResults = searchableItems.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setSearchResults(filteredResults)
  }, [searchQuery])

  const handleDragStart = (e) => {
    try {
      // Safely access clientY from either touch or mouse event
      const clientY = e?.touches?.[0]?.clientY || e?.clientY || 0

      setMenuPosition({
        ...menuPosition,
        startY: clientY,
        isDragging: true,
      })
    } catch (error) {
      console.error("Error in handleDragStart:", error)
      // Reset dragging state on error
      setMenuPosition({
        ...menuPosition,
        isDragging: false,
      })
    }
  }

  const handleDragMove = (e) => {
    try {
      if (!menuPosition.isDragging) return

      // Safely access clientY from either touch or mouse event
      const clientY = e?.touches?.[0]?.clientY || e?.clientY || 0

      if (isNaN(clientY)) {
        console.warn("Invalid clientY value in handleDragMove")
        return
      }

      const deltaY = clientY - menuPosition.startY

      // Calculate new top position, constrained to viewport
      const newTop = Math.max(0, Math.min(window.innerHeight - 300, menuPosition.top + deltaY))

      // Update menu position
      setMenuPosition({
        ...menuPosition,
        top: newTop,
        startY: clientY,
      })

      // Apply the new position
      const sideMenu = e?.currentTarget?.parentElement
      if (sideMenu) {
        sideMenu.style.top = `${newTop}px`
        sideMenu.style.height = `${window.innerHeight - newTop}px`
      }
    } catch (error) {
      console.error("Error in handleDragMove:", error)
    }
  }

  const handleDragEnd = () => {
    setMenuPosition({
      ...menuPosition,
      isDragging: false,
    })
  }

  // Add event listener for mouse move and mouse up (for desktop dragging)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (menuPosition.isDragging) {
        handleDragMove(e)
      }
    }

    const handleMouseUp = () => {
      if (menuPosition.isDragging) {
        handleDragEnd()
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [menuPosition.isDragging])

  // Track scroll position for sticky behavior
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }

    // Initial position
    setScrollY(window.scrollY)

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <>
      {/* Hamburger Button - Fixed positioning with improved stickiness */}
      <button
        className="fixed left-0 z-50 bg-black dark:bg-white text-white dark:text-black p-3 rounded-r-lg group hover:bg-gray-900 dark:hover:bg-gray-100"
        style={{
          top: scrollY > 100 ? "5rem" : "10rem",
          transition: "top 0.3s ease",
          transform: "translateZ(0)", // Hardware acceleration
          willChange: "top", // Performance optimization
        }}
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <div className="w-3 h-5 flex flex-col justify-between transition-all duration-300 ease-in-out">
          <span className="w-full h-0.5 bg-white dark:bg-black rounded-full block transition-all duration-300 ease-in-out group-hover:w-5/6 group-hover:translate-y-0.5"></span>
          <span className="w-5/6 h-0.5 bg-white dark:bg-black rounded-full block transition-all duration-300 ease-in-out group-hover:w-full"></span>
          <span className="w-full h-0.5 bg-white dark:bg-black rounded-full block transition-all duration-300 ease-in-out group-hover:w-5/6 group-hover:-translate-y-0.5"></span>
        </div>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black dark:bg-white bg-opacity-50 dark:bg-opacity-20 z-[150] transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Side Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl z-[200] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        } flex flex-col`}
      >
        {/* Drag Handle for Mobile / Close Button for All Viewports */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-24 bg-gray-200 dark:bg-gray-700 rounded-l-md flex items-center justify-center cursor-pointer touch-manipulation hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
          onMouseDown={handleDragStart}
          onClick={() => setIsOpen(false)}
        >
          <div className="w-1 h-10 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <X size={16} className="text-gray-600 dark:text-gray-400" />
          </div>
        </div>

        <div className="flex-none p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <Link href="/" className="font-bold text-2xl">
              <BBLogo size="md" />
            </Link>
            <div className="flex items-center space-x-2">
              {/* Notification Bell */}
              <button
                onClick={onNotificationBellClick}
                className="text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white p-1"
                aria-label="Notifications"
              >
                <div className="relative">
                  <Bell size={20} />
                  {isSubscribed && <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />}
                </div>
              </button>

              {/* Theme Toggle */}
              <ThemeToggle variant="icon" />

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white ml-1"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-none p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-gray-800 text-black dark:text-white"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-2 bg-white dark:bg-gray-800 rounded-md shadow-md max-h-60 overflow-y-auto">
              {searchResults.map((result, index) => (
                <Link
                  key={index}
                  href={result.url}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm dark:text-white"
                  onClick={() => {
                    setSearchQuery("")
                    setIsOpen(false)
                  }}
                >
                  {result.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar p-6">
          <nav className="mb-8">
            <ul className="space-y-4">
              <li>
                <Link
                  href="/about"
                  className="block font-medium hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
                >
                  About BB
                </Link>
              </li>
              <li>
                <Link
                  href="/revolution"
                  className="block font-medium hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
                >
                  Revolution
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="block font-medium hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/partners"
                  className="block font-medium hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
                >
                  Partners
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="block font-medium hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="font-bold mb-4 dark:text-white">Our Partners</h3>
            <div className="grid grid-cols-2 gap-4">
              {logos.map((logo, index) => (
                <div
                  key={index}
                  className="p-2 bg-gray-50 dark:bg-gray-800 rounded transition-all duration-200 hover:shadow-lg"
                >
                  <div className="h-12 flex items-center justify-center">
                    <Image
                      src={`/abstract-geometric-shapes.png?height=48&width=48&query=${logo.name}`}
                      alt={logo.name}
                      width={48}
                      height={48}
                      className="max-h-full"
                      unoptimized
                    />
                  </div>
                  <p className="text-xs text-center mt-1 text-gray-600 dark:text-gray-300">{logo.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Add more content to demonstrate scrolling */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <h3 className="font-bold mb-4 dark:text-white">Recent Updates</h3>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                  <h4 className="font-medium text-sm dark:text-white">Update {index + 1}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Minimalist Footer */}
        <div className="flex-none py-2 border-t border-gray-200 dark:border-gray-700 text-[10px] text-center text-gray-400 dark:text-gray-500">
          © 2025 Based Enterprise
        </div>
      </div>
    </>
  )
}
