"use client"

import { useEffect } from "react"

export default function SectionPersistence() {
  // Save scroll position and current section
  useEffect(() => {
    if (typeof window === "undefined") return

    let scrollTimer: NodeJS.Timeout | null = null

    const handleScroll = () => {
      if (scrollTimer) clearTimeout(scrollTimer)

      scrollTimer = setTimeout(() => {
        try {
          const scrollY = window.scrollY
          localStorage.setItem("scrollPosition", scrollY.toString())

          // Define sections with their IDs
          const sections = [
            "hero",
            "fundraising",
            "library",
            "about",
            "media",
            "website-showcase",
            "x-share-widget",
            "domains",
            "based-quiz",
          ]

          // Find current section
          let currentSection = "hero"
          const viewportOffset = window.innerHeight / 3

          for (const sectionId of sections) {
            const element = document.getElementById(sectionId)
            if (element && scrollY + viewportOffset >= element.offsetTop) {
              currentSection = sectionId
            }
          }

          localStorage.setItem("currentSection", currentSection)
          console.log("💾 Saved section:", currentSection, "at scroll:", scrollY)
        } catch (error) {
          console.error("Error saving scroll state:", error)
        }
      }, 150)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (scrollTimer) clearTimeout(scrollTimer)
    }
  }, [])

  // Restore scroll position on mount
  useEffect(() => {
    if (typeof window === "undefined") return

    const restoreScroll = () => {
      try {
        const savedSection = localStorage.getItem("currentSection")
        const savedPosition = localStorage.getItem("scrollPosition")

        console.log("🔄 Attempting restore - Section:", savedSection, "Position:", savedPosition)

        if (savedSection && savedSection !== "hero") {
          const element = document.getElementById(savedSection)
          if (element) {
            const targetY = element.offsetTop - 80
            console.log("✅ Scrolling to section:", savedSection, "position:", targetY)

            window.scrollTo({
              top: targetY,
              behavior: "auto",
            })
            return
          } else {
            console.log("❌ Section not found:", savedSection)
          }
        }

        // Fallback to exact position
        if (savedPosition) {
          const pos = Number.parseInt(savedPosition, 10)
          if (!isNaN(pos) && pos > 50) {
            console.log("📍 Using exact position:", pos)
            window.scrollTo({ top: pos, behavior: "auto" })
          }
        }
      } catch (error) {
        console.error("❌ Restore error:", error)
      }
    }

    // Try multiple times with increasing delays
    const attempts = [100, 300, 600, 1000]

    attempts.forEach((delay, index) => {
      setTimeout(() => {
        console.log(`🚀 Restore attempt ${index + 1}/${attempts.length}`)
        restoreScroll()
      }, delay)
    })
  }, [])

  // Save menu state helper
  useEffect(() => {
    if (typeof window === "undefined") return

    window.saveMenuState = (isOpen: boolean) => {
      try {
        localStorage.setItem("menuIsOpen", isOpen ? "true" : "false")
      } catch (error) {
        console.error("Error saving menu state:", error)
      }
    }

    return () => {
      delete window.saveMenuState
    }
  }, [])

  return null
}

// Global type declaration
declare global {
  interface Window {
    saveMenuState?: (isOpen: boolean) => void
  }
}
