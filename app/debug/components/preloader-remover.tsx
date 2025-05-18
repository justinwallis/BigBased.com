"use client"

import { useEffect } from "react"

export default function PreloaderRemover() {
  useEffect(() => {
    console.log("PreloaderRemover component mounted")

    // Function to remove preloader elements
    const removePreloaders = () => {
      console.log("Client component: Attempting to remove preloaders")

      // Remove any element with 'preloader' in its ID or class
      const preloaders = document.querySelectorAll('[id*="preloader"], [class*="preloader"]')
      console.log(`Client component: Found ${preloaders.length} preloader elements`)

      preloaders.forEach((el) => {
        if (el && el.parentNode) {
          console.log("Client component: Removing preloader element:", el)
          el.parentNode.removeChild(el)
        }
      })

      // Remove any inline preloader
      const initialPreloader = document.getElementById("initial-preloader")
      if (initialPreloader && initialPreloader.parentNode) {
        console.log("Client component: Removing initial preloader")
        initialPreloader.parentNode.removeChild(initialPreloader)
      }

      // Clear any preloader-related intervals
      for (let i = 1; i < 10000; i++) {
        clearInterval(i)
      }

      // Remove any fixed or absolute positioned elements that might be preloaders
      const possiblePreloaders = document.querySelectorAll(
        'div[style*="position: fixed"], div[style*="position:fixed"], div[style*="position: absolute"], div[style*="position:absolute"]',
      )
      possiblePreloaders.forEach((el) => {
        if (
          el instanceof HTMLElement &&
          el.parentNode &&
          (Number.parseInt(el.style.zIndex) > 100 || el.style.zIndex === "")
        ) {
          console.log("Client component: Removing possible preloader element:", el)
          el.style.display = "none"
        }
      })

      // Force body to be visible
      document.body.style.display = "block"
      document.body.style.visibility = "visible"
      document.body.style.opacity = "1"
    }

    // Run immediately
    removePreloaders()

    // Run again after a short delay
    const timeouts = [
      setTimeout(removePreloaders, 100),
      setTimeout(removePreloaders, 500),
      setTimeout(removePreloaders, 1000),
      setTimeout(removePreloaders, 2000),
    ]

    // Cleanup
    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
    }
  }, [])

  return null // This component doesn't render anything
}
