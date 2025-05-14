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

  const navItems: NavItem[] = [
    { id: "hero", label: "Hero" },
    { id: "fundraising", label: "Fundraising" },
    { id: "library", label: "Digital Library" },
    { id: "revolution", label: "Revolution" },
    { id: "about", label: "About" },
    { id: "media", label: "Media" },
    { id: "domains", label: "Domains" },
  ]

  useEffect(() => {
    const sections = navItems.map((item) => document.getElementById(item.id)).filter(Boolean)

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (!section) continue

        const sectionTop = section.offsetTop

        if (scrollPosition >= sectionTop) {
          if (activeSection !== section.id) {
            setActiveSection(section.id)
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
    const section = document.getElementById(id)
    if (section) {
      window.scrollTo({
        top: section.offsetTop,
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
                className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 whitespace-nowrap bg-white dark:bg-gray-800 text-xs px-2 py-1 rounded shadow-md"
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
