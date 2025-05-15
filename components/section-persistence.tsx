"use client"

import { useEffect } from "react"

export default function SectionPersistence() {
  // Save current section on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Debounce the scroll event to avoid excessive localStorage writes
      if (window.scrollY > 0) {
        clearTimeout(window.scrollTimer)
        window.scrollTimer = setTimeout(() => {
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
        }, 200)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Restore scroll position on page load
  useEffect(() => {
    // Wait for page to fully load
    window.addEventListener("load", () => {
      setTimeout(() => {
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
          window.scrollTo({
            top: Number.parseInt(savedPosition),
            behavior: "auto",
          })
        }
      }, 100) // Small delay to ensure DOM is ready
    })

    // Also try immediately for faster response
    setTimeout(() => {
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
    }, 200)
  }, [])

  return null // This component doesn't render anything
}
