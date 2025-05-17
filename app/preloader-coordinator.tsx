"use client"

import { useEffect } from "react"

export default function PreloaderCoordinator() {
  useEffect(() => {
    if (typeof window === "undefined") return

    // Add a flag to indicate the initial preloader is active
    window.initialPreloaderActive = true

    // Function to handle when initial preloader is removed
    const handleInitialPreloaderRemoved = () => {
      window.initialPreloaderActive = false
      console.log("Initial preloader marked as inactive")
    }

    // Check if initial preloader exists
    const initialPreloader = window.initialPreloader
    if (initialPreloader) {
      // Set up observer to detect when initial preloader is removed
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList" && mutation.removedNodes.length > 0) {
            for (let i = 0; i < mutation.removedNodes.length; i++) {
              const node = mutation.removedNodes[i]
              if (node === initialPreloader) {
                handleInitialPreloaderRemoved()
                observer.disconnect()
                break
              }
            }
          }
        })
      })

      observer.observe(document.body, { childList: true })

      // Safety timeout
      const timeout = setTimeout(handleInitialPreloaderRemoved, 10000)

      return () => {
        observer.disconnect()
        clearTimeout(timeout)
      }
    } else {
      // No initial preloader
      handleInitialPreloaderRemoved()
    }
  }, [])

  return null
}
