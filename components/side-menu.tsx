"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { X, Search, Bell, ChevronRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import BBLogo from "@/components/bb-logo"
import SearchPopup from "@/components/search-popup"
import { usePathname } from "next/navigation"

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

// Helper function to format segment names
function formatSegment(segment: string): string {
  // Replace hyphens with spaces and capitalize each word
  return segment
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Simple Breadcrumb component directly in the SideMenu file
function SimpleBreadcrumb() {
  const pathname = usePathname()

  // Skip rendering breadcrumbs on the homepage
  if (pathname === "/") return null

  // Split the pathname into segments and decode them
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment))

  // If there are no segments, don't render anything
  if (segments.length === 0) return null

  return (
    <div className="mb-4 py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-md text-xs">
      <div className="flex items-center flex-wrap">
        <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
          Home
        </Link>
        {segments.map((segment, index) => {
          // Build the href for this segment
          const href = "/" + segments.slice(0, index + 1).join("/")

          return (
            <div key={segment} className="flex items-center">
              <ChevronRight className="h-3 w-3 mx-1 text-gray-400 dark:text-gray-500 flex-shrink-0" />
              {index === segments.length - 1 ? (
                <span className="font-medium text-gray-800 dark:text-gray-200">{formatSegment(segment)}</span>
              ) : (
                <Link
                  href={href}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {formatSegment(segment)}
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function SideMenu({
  isOpen,
  setIsOpen,
  openWithSearch = false,
  onNotificationBellClick = () => {},
  isSubscribed = false,
}: SideMenuProps) {
  const [scrollY, setScrollY] = useState(0)
  const [menuPosition, setMenuPosition] = useState({ top: 0, startX: 0, isDragging: false })
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const initialRenderRef = useRef(true)
  const scrollableContentRef = useRef<HTMLDivElement>(null)
  const previousBodyOverflowRef = useRef("")
  const previousBodyPositionRef = useRef("")
  const previousBodyTopRef = useRef("")
  const previousBodyLeftRef = useRef("")
  const previousBodyWidthRef = useRef("")

  // Lock/unlock body scroll when sidebar is opened/closed
  useEffect(() => {
    if (typeof window === "undefined") return

    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY

      // Save current body styles
      previousBodyOverflowRef.current = document.body.style.overflow
      previousBodyPositionRef.current = document.body.style.position
      previousBodyTopRef.current = document.body.style.top
      previousBodyLeftRef.current = document.body.style.left
      previousBodyWidthRef.current = document.body.style.width

      // Calculate scrollbar width
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

      // Lock body scroll and maintain position
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = "0"
      document.body.style.width = "100%"

      // Add padding to prevent content shift
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`
      }

      // Store the scroll position for restoration
      document.body.setAttribute("data-scroll-y", scrollY.toString())
    } else {
      // Get the stored scroll position
      const storedScrollY = document.body.getAttribute("data-scroll-y")
      const scrollY = storedScrollY ? Number.parseInt(storedScrollY) : 0

      // Restore body styles
      document.body.style.overflow = previousBodyOverflowRef.current
      document.body.style.position = previousBodyPositionRef.current
      document.body.style.top = previousBodyTopRef.current
      document.body.style.left = previousBodyLeftRef.current
      document.body.style.width = previousBodyWidthRef.current
      document.body.style.paddingRight = ""

      // Remove the stored scroll position
      document.body.removeAttribute("data-scroll-y")

      // Restore scroll position without jumping
      if (scrollY > 0) {
        window.scrollTo({ top: scrollY, behavior: "instant" })
      }
    }
  }, [isOpen])

  // Prevent any scroll restoration flash
  useEffect(() => {
    if (!isOpen) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        document.body.style.transition = ""
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

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

  const handleDragStart = (e) => {
    try {
      // Safely access clientX from either touch or mouse event
      const clientX = e?.touches?.[0]?.clientX || e?.clientX || 0

      setMenuPosition({
        ...menuPosition,
        startX: clientX,
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

      // Safely access clientX from either touch or mouse event
      const clientX = e?.touches?.[0]?.clientX || e?.clientX || 0

      if (isNaN(clientX)) {
        console.warn("Invalid clientX value in handleDragMove")
        return
      }

      const deltaX = clientX - menuPosition.startX

      // If dragged more than 100px to the left, close the menu
      if (deltaX < -100) {
        setIsOpen(false)
        setMenuPosition({
          ...menuPosition,
          isDragging: false,
        })
        return
      }

      // Apply drag effect to the menu (slight movement following finger)
      const sideMenu = e?.currentTarget?.parentElement
      if (sideMenu) {
        // Only allow dragging to the left (negative values)
        const dragOffset = Math.min(0, deltaX)
        sideMenu.style.transform = `translateX(${dragOffset}px)`
      }
    } catch (error) {
      console.error("Error in handleDragMove:", error)
    }
  }

  const handleDragEnd = () => {
    // Reset any drag transformation
    const sideMenu = document.querySelector('[data-side-menu="true"]')
    if (sideMenu) {
      sideMenu.style.transform = ""
    }

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

  // Handle search icon click
  const handleSearchClick = (e) => {
    e.stopPropagation() // Prevent the click from closing the sidebar
    setIsSearchPopupOpen(true)
  }

  // Prevent wheel events from propagating outside the scrollable area
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    const isAtTop = scrollTop === 0
    const isAtBottom = Math.abs(scrollTop + clientHeight - scrollHeight) < 2

    // If we're at the top and trying to scroll up, or at the bottom and trying to scroll down
    if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
      e.preventDefault()
    }
  }

  return (
    <>
      {/* Search Popup */}
      <SearchPopup isOpen={isSearchPopupOpen} onClose={() => setIsSearchPopupOpen(false)} />

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
        data-side-menu="true"
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
          aria-label="Drag to close menu or click to close"
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
            <div className="flex items-center space-x-1">
              {/* Search Icon */}
              <button
                onClick={handleSearchClick}
                className="text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white p-1 relative z-10"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* Notification Bell */}
              <button
                onClick={onNotificationBellClick}
                className="text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white p-1"
                aria-label="Notifications"
              >
                <div className="relative">
                  <Bell size={18} />
                  {isSubscribed && <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />}
                </div>
              </button>

              {/* Theme Toggle */}
              <ThemeToggle variant="icon" />

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white ml-0.5"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={scrollableContentRef}
          className="flex-grow overflow-y-auto custom-scrollbar p-6"
          onWheel={handleWheel}
        >
          {/* Breadcrumb - Only shows when not on homepage */}
          <SimpleBreadcrumb />

          <nav className="mb-8">
            <ul className="space-y-4">
              <li>
                <Link
                  href="/about"
                  className="block font-medium text-black hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
                >
                  About BB
                </Link>
              </li>
              <li>
                <Link
                  href="/revolution"
                  className="block font-medium text-black hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
                >
                  Revolution
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="block font-medium text-black hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/partners"
                  className="block font-medium text-black hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
                >
                  Partners
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="block font-medium text-black hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="font-bold mb-4 text-black dark:text-white">Our Partners</h3>
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
            <h3 className="font-bold mb-4 text-black dark:text-white">Recent Updates</h3>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                  <h4 className="font-medium text-sm text-black dark:text-white">Update {index + 1}</h4>
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
