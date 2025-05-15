"use client"

import { useEffect } from "react"

// Define the scrollTimer type on the Window interface
declare global {
  interface Window {
    scrollTimer: ReturnType<typeof setTimeout> | null
  }
}

export default function SectionPersistence() {
  // Save current section on scroll
  useEffect(() => {
    // Initialize scrollTimer if it doesn't exist
    if (typeof window !== "undefined" && window.scrollTimer === undefined) {
      window.scrollTimer = null
    }

    const handleScroll = () => {
      // Debounce the scroll event to avoid excessive localStorage writes
      if (typeof window !== "undefined" && window.scrollY > 0) {
        if (window.scrollTimer) clearTimeout(window.scrollTimer)

        window.scrollTimer = setTimeout(() => {
          try {
            localStorage.setItem("scrollPosition", window.scrollY.toString())

            // Also save which section is currently active
            const navItems = [
              { id: "hero", threshold: 0 },
              { id: "fundraising", threshold: 0 },
              { id: "library", threshold: 0 },
              { id: "about", threshold: 0 },
              { id: "media", threshold: 0 },
              { id: "website-showcase", threshold: 0 },
              { id: "x-share-widget", threshold: 0 },
              { id: "domains", threshold: 0 },
              { id: "based-quiz", threshold: 0 },
            ]

            // Find all sections and their positions
            navItems.forEach((item) => {
              const element = document.getElementById(item.id)
              if (element) {
                item.threshold = element.offsetTop
              }
            })

            // Sort by position (top to bottom)
            navItems.sort((a, b) => a.threshold - b.threshold)

            // Find current section
            const scrollPosition = window.scrollY + window.innerHeight / 3
            let currentSection = navItems[0].id

            for (let i = navItems.length - 1; i >= 0; i--) {
              if (scrollPosition >= navItems[i].threshold) {
                currentSection = navItems[i].id
                break
              }
            }

            localStorage.setItem("currentSection", currentSection)
          } catch (error) {
            console.error("Error saving scroll position:", error)
          }
        }, 200)
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll, { passive: true })
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", handleScroll)
        if (window.scrollTimer) clearTimeout(window.scrollTimer)
      }
    }
  }, [])

  // Restore scroll position on page load
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleLoad = () => {
      setTimeout(() => {
        try {
          const savedSection = localStorage.getItem("currentSection")
          const savedPosition = localStorage.getItem("scrollPosition")

          if (savedSection) {
            // First try to scroll to the saved section
            const element = document.getElementById(savedSection)
            if (element) {
              window.scrollTo({
                top: element.offsetTop,
                behavior: "auto", // Use auto to avoid animation on initial load
              })
              return
            }
          }

          // Fall back to exact scroll position if section not found
          if (savedPosition) {
            const position = Number.parseInt(savedPosition, 10)
            if (!isNaN(position)) {
              window.scrollTo({
                top: position,
                behavior: "auto",
              })
            }
          }
        } catch (error) {
          console.error("Error restoring scroll position:", error)
        }
      }, 100) // Small delay to ensure DOM is ready
    }

    // Also try immediately for faster response
    setTimeout(() => {
      try {
        const savedSection = localStorage.getItem("currentSection")
        if (savedSection && savedSection !== "hero") {
          const element = document.getElementById(savedSection)
          if (element) {
            window.scrollTo({
              top: element.offsetTop,
              behavior: "auto",
            })
          }
        }
      } catch (error) {
        console.error("Error in immediate scroll restoration:", error)
      }
    }, 200)

    window.addEventListener("load", handleLoad)
    return () => window.removeEventListener("load", handleLoad)
  }, [])

  // Create a global event to save menu state
  useEffect(() => {
    if (typeof window === "undefined") return

    // Create a custom event for saving menu state
    const saveMenuState = (isOpen) => {
      try {
        localStorage.setItem("menuIsOpen", isOpen ? "true" : "false")
      } catch (error) {
        console.error("Error saving menu state:", error)
      }
    }

    // Expose the function globally so other components can use it
    window.saveMenuState = saveMenuState

    // Clean up
    return () => {
      delete window.saveMenuState
    }
  }, [])

  return null // This component doesn't render anything
}

// Add the saveMenuState function to the Window interface
declare global {
  interface Window {
    saveMenuState?: (isOpen: boolean) => void
  }
}
