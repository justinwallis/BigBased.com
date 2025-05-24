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
              { id: "fundraising-and-prayer-section", threshold: 0 },
              { id: "digital-library-section", threshold: 0 },
              { id: "about-section", threshold: 0 },
              { id: "media-voting-platform", threshold: 0 },
              { id: "website-showcase", threshold: 0 },
              { id: "x-share-widget", threshold: 0 },
              { id: "domain-collection", threshold: 0 },
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

  // Restore scroll position on page load - Enhanced version
  useEffect(() => {
    if (typeof window === "undefined") return

    const restoreScrollPosition = () => {
      try {
        const savedSection = localStorage.getItem("currentSection")
        const savedPosition = localStorage.getItem("scrollPosition")

        console.log("Attempting to restore - Section:", savedSection, "Position:", savedPosition)

        // First, let's check what sections actually exist on the page
        const availableSections = [
          "hero",
          "fundraising-and-prayer-section",
          "digital-library-section",
          "about-section",
          "media-voting-platform",
          "website-showcase",
          "x-share-widget",
          "domain-collection",
          "based-quiz",
        ].filter((id) => document.getElementById(id))

        console.log("Available sections on page:", availableSections)

        if (savedSection && savedSection !== "hero" && savedSection !== "top") {
          const element = document.getElementById(savedSection)
          if (element) {
            console.log("Found element for section:", savedSection, "at position:", element.offsetTop)

            // Force scroll to the element
            window.scrollTo({
              top: element.offsetTop - 100, // Offset for header
              behavior: "auto",
            })

            // Double-check the scroll happened
            setTimeout(() => {
              console.log("Current scroll position after restore:", window.scrollY)
              console.log("Target was:", element.offsetTop - 100)
            }, 100)

            return true
          } else {
            console.log("Element not found for section:", savedSection)
          }
        }

        // Fall back to exact scroll position
        if (savedPosition) {
          const position = Number.parseInt(savedPosition, 10)
          if (!isNaN(position) && position > 100) {
            // Only restore if meaningful scroll
            console.log("Restoring to exact position:", position)
            window.scrollTo({
              top: position,
              behavior: "auto",
            })
            return true
          }
        }

        return false
      } catch (error) {
        console.error("Error restoring scroll position:", error)
        return false
      }
    }

    // Wait for everything to be loaded, then restore
    const performRestore = () => {
      console.log("Document ready state:", document.readyState)

      // Wait a bit more to ensure all components are mounted
      setTimeout(() => {
        console.log("Attempting scroll restoration...")
        const success = restoreScrollPosition()

        if (!success) {
          // Try again after more time
          setTimeout(() => {
            console.log("Retry scroll restoration...")
            restoreScrollPosition()
          }, 500)
        }
      }, 200)
    }

    // Multiple triggers to ensure it works
    if (document.readyState === "complete") {
      performRestore()
    } else {
      window.addEventListener("load", performRestore)
      document.addEventListener("DOMContentLoaded", performRestore)
    }

    // Also try after a longer delay as final fallback
    setTimeout(() => {
      const savedSection = localStorage.getItem("currentSection")
      if (savedSection && window.scrollY < 100) {
        console.log("Final fallback restore attempt for:", savedSection)
        restoreScrollPosition()
      }
    }, 1000)

    return () => {
      window.removeEventListener("load", performRestore)
      document.removeEventListener("DOMContentLoaded", performRestore)
    }
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
