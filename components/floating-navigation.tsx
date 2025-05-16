"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface NavItem {
  id: string
  label: string
}

export default function FloatingNavigation() {
  const [activeSection, setActiveSection] = useState("")
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [animatingDot, setAnimatingDot] = useState<string | null>(null)
  const prevActiveSectionRef = useRef(activeSection)

  // Define section IDs and their corresponding labels
  const navItems: NavItem[] = [
    { id: "top", label: "Welcome!" },
    { id: "fundraising", label: "Fundraising" },
    { id: "library", label: "Digital Library" },
    { id: "about", label: "About Big Based" },
    { id: "media", label: "Index & Voting" },
    { id: "website-showcase", label: "Website Showcase" },
    { id: "x-share-widget", label: "Share on X!" },
    { id: "domains", label: "Based Domains & Profile" },
    { id: "based-quiz", label: "How Based Are You?" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3

      // Special case for top of page
      if (scrollPosition < 300) {
        setActiveSection("top")
        return
      }

      // Check each section
      for (let i = navItems.length - 1; i >= 0; i--) {
        if (navItems[i].id === "top") continue

        const element = document.getElementById(navItems[i].id)
        if (!element) continue

        const elementTop = element.offsetTop

        if (scrollPosition >= elementTop) {
          if (activeSection !== navItems[i].id) {
            setActiveSection(navItems[i].id)
          }
          break
        }
      }

      // If we've scrolled up and no section was matched, check if we're near the top
      if (window.scrollY < 300) {
        setActiveSection("top")
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    // Set initial active section - ensure it's called after a small delay to work properly
    setTimeout(() => {
      handleScroll()
    }, 100)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [navItems, activeSection])

  // Set top section as active on initial load
  useEffect(() => {
    if (window.scrollY < 300) {
      setActiveSection("top")
    }
  }, [])

  // Trigger animation only when active section changes
  useEffect(() => {
    if (activeSection && activeSection !== prevActiveSectionRef.current) {
      setAnimatingDot(activeSection)

      // Stop animation after it plays once
      const timer = setTimeout(() => {
        setAnimatingDot(null)
      }, 1000) // Animation duration

      prevActiveSectionRef.current = activeSection

      return () => clearTimeout(timer)
    }
  }, [activeSection])

  const scrollToSection = (id: string) => {
    // Special case for top of page
    if (id === "top") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
      return
    }

    const element = document.getElementById(id)
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center space-y-3">
      {navItems.map((item) => (
        <div
          key={item.id}
          className="relative"
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <AnimatePresence>
            {hoveredItem === item.id && (
              <motion.div
                initial={{ opacity: 0, x: -10, scale: 0.9 }}
                animate={{ opacity: 1, x: -5, scale: 1 }}
                exit={{ opacity: 0, x: -10, scale: 0.9 }}
                className="absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md overflow-hidden"
                style={{ pointerEvents: "none" }}
              >
                <div className="relative px-3 py-1.5 text-xs font-medium">
                  {/* Gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 opacity-90"></div>

                  {/* Glass effect overlay */}
                  <div className="absolute inset-0 bg-white dark:bg-gray-900 opacity-20"></div>

                  {/* Border glow */}
                  <div className="absolute inset-0 rounded-md border border-white dark:border-gray-700 opacity-30"></div>

                  {/* Text with shadow */}
                  <span className="relative z-10 text-white drop-shadow-sm">{item.label}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => scrollToSection(item.id)}
            className="group relative flex items-center justify-center w-5 h-5"
            aria-label={`Scroll to ${item.label} section`}
          >
            <span
              className={`block w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                activeSection === item.id
                  ? "bg-black dark:bg-white scale-110"
                  : "bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500"
              }`}
            />
            {animatingDot === item.id && (
              <span className="absolute w-5 h-5 rounded-full animate-ping opacity-75 bg-black dark:bg-white" />
            )}
          </button>
        </div>
      ))}
    </div>
  )
}
