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

  // Restore scroll position on page load - Enhanced version
  useEffect(() => {
    if (typeof window === "undefined") return

    const restoreScrollPosition = () => {
      try {
        const savedSection = localStorage.getItem("currentSection")
        const savedPosition = localStorage.getItem("scrollPosition")

        console.log("Restoring scroll - Section:", savedSection, "Position:", savedPosition)

        if (savedSection && savedSection !== "hero") {
          // Wait for DOM to be fully loaded
          const element = document.getElementById(savedSection)
          if (element) {
            console.log("Found element for section:", savedSection)
            // Use smooth scroll to the section
            element.scrollIntoView({
              behavior: "auto",
              block: "start",
            })
            return true
          } else {
            console.log("Element not found for section:", savedSection, "- will retry")
            return false
          }
        }

        // Fall back to exact scroll position if section not found
        if (savedPosition) {
          const position = Number.parseInt(savedPosition, 10)
          if (!isNaN(position) && position > 0) {
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

    // Multiple attempts to restore scroll position
    let attempts = 0
    const maxAttempts = 10

    const attemptRestore = () => {
      attempts++
      console.log(`Scroll restore attempt ${attempts}/${maxAttempts}`)

      const success = restoreScrollPosition()

      if (!success && attempts < maxAttempts) {
        // Try again after a short delay
        setTimeout(attemptRestore, 100 * attempts) // Increasing delay
      } else if (success) {
        console.log("Scroll position restored successfully")
      } else {
        console.log("Failed to restore scroll position after all attempts")
      }
    }

    // Start attempting to restore scroll position
    setTimeout(attemptRestore, 100) // Initial delay to let page load

    // Also listen for the load event
    const handleLoad = () => {
      console.log("Window load event fired")
      setTimeout(attemptRestore, 50)
    }

    // Listen for DOMContentLoaded as well
    const handleDOMContentLoaded = () => {
      console.log("DOMContentLoaded event fired")
      setTimeout(attemptRestore, 50)
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", handleDOMContentLoaded)
    } else {
      // DOM is already loaded
      setTimeout(attemptRestore, 50)
    }

    window.addEventListener("load", handleLoad)

    return () => {
      window.removeEventListener("load", handleLoad)
      document.removeEventListener("DOMContentLoaded", handleDOMContentLoaded)
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
