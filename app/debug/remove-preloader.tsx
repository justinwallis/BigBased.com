"use client"

import { useEffect } from "react"

export default function RemovePreloader() {
  useEffect(() => {
    // Function to remove preloader
    const removePreloader = () => {
      // Remove the initial preloader if it exists
      const initialPreloader = document.getElementById("initial-preloader")
      if (initialPreloader) {
        initialPreloader.remove()
      }

      // Find and remove any other preloader elements
      const preloaders = document.querySelectorAll('[id*="preloader"], [class*="preloader"]')
      preloaders.forEach((el) => {
        el.remove()
      })

      // Clear any loading-related intervals
      for (let i = 0; i < 1000; i++) {
        window.clearInterval(i)
        window.clearTimeout(i)
      }

      // Reset body styles that might have been set by preloader
      document.body.style.overflow = "auto"
      document.body.style.position = "static"
    }

    // Run immediately
    removePreloader()

    // Also run after a short delay to catch any dynamically added preloaders
    const timeout = setTimeout(removePreloader, 100)

    // And run one more time after everything has loaded
    window.addEventListener("load", removePreloader)

    return () => {
      clearTimeout(timeout)
      window.removeEventListener("load", removePreloader)
    }
  }, [])

  return null
}
