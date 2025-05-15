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

  // Function to find elements by ID or class name
  const findElement = (identifier: string): HTMLElement | null => {
    // Try by ID first
    let element = document.getElementById(identifier)

    // If not found by ID, try by class name
    if (!element) {
      const elements = document.getElementsByClassName(identifier)
      if (elements.length > 0) {
        element = elements[0] as HTMLElement
      }
    }

    // If still not found, try some alternative IDs
    if (!element) {
      const alternativeIds: Record<string, string[]> = {
        "website-showcase": ["website_showcase", "websites", "showcase"],
        "x-share-widget": ["share", "x-share", "share-widget", "x-widget"],
        "based-quiz": ["quiz", "how-based", "based_quiz"],
      }

      const alternatives = alternativeIds[identifier]
      if (alternatives) {
        for (const altId of alternatives) {
          element = document.getElementById(altId)
          if (element) break

          const altElements = document.getElementsByClassName(altId)
          if (altElements.length > 0) {
            element = altElements[0] as HTMLElement
            break
          }
        }
      }
    }

    return element
  }

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

        const element = findElement(navItems[i].id)
        if (!element) continue

        const elementTop = element.offsetTop

        if (scrollPosition >= elementTop) {
          if (activeSection !== navItems[i].id) {
            setActiveSection(navItems[i].id)
          }
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Set initial active section

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [navItems, activeSection])

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

    const element = findElement(id)
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="fixed right-5 top-1/2 transform -translate-y-1/2 z-40 flex flex-col items-center space-y-3">
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
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: -5 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 whitespace-nowrap bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-xs px-2 py-1 rounded shadow-md"
                style={{ pointerEvents: "none" }}
              >
                {item.label}
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => scrollToSection(item.id)}
            className="group relative flex items-center justify-center"
            aria-label={`Scroll to ${item.label} section`}
          >
            <span
              className={`block w-2 h-2 rounded-full transition-all duration-300 ${
                activeSection === item.id
                  ? "bg-black dark:bg-white scale-110"
                  : "bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500"
              }`}
            />
            {animatingDot === item.id && (
              <span className="absolute w-3 h-3 rounded-full animate-ping opacity-75 bg-black dark:bg-white" />
            )}
          </button>
        </div>
      ))}
    </div>
  )
}
