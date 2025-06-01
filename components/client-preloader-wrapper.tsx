"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Preloader } from "./preloader"
import loadingManager from "@/utils/loading-manager"

interface ClientPreloaderWrapperProps {
  children: React.ReactNode
  quotesToShow?: number
}

export function ClientPreloaderWrapper({ children, quotesToShow }: ClientPreloaderWrapperProps) {
  const [mounted, setMounted] = useState(false)
  const [preloaderDone, setPreloaderDone] = useState(false)

  useEffect(() => {
    try {
      // Register critical resources that need to be loaded
      loadingManager.registerResource("critical-css", 1)
      loadingManager.registerResource("critical-js", 1)
      loadingManager.registerResource("fonts", 1)

      // Mark critical resources as loading
      loadingManager.startLoading("critical-css")
      loadingManager.startLoading("critical-js")
      loadingManager.startLoading("fonts")

      // Mark critical CSS as loaded when styles are applied
      if (document.styleSheets.length > 0) {
        loadingManager.resourceLoaded("critical-css")
      } else {
        // Wait for styles to load
        const styleObserver = new MutationObserver((mutations) => {
          if (document.styleSheets.length > 0) {
            loadingManager.resourceLoaded("critical-css")
            styleObserver.disconnect()
          }
        })

        styleObserver.observe(document.head, { childList: true, subtree: true })
      }

      // Mark critical JS as loaded
      loadingManager.resourceLoaded("critical-js")

      // Mark fonts as loaded when they're ready
      if (document.fonts && typeof document.fonts.ready === "function") {
        document.fonts.ready
          .then(() => {
            loadingManager.resourceLoaded("fonts")
          })
          .catch((error) => {
            // Log the error
            console.warn("Font loading error:", error)
            // If there's an error, still mark as loaded after a timeout
            setTimeout(() => loadingManager.resourceLoaded("fonts"), 2000)
          })
      } else {
        // Fallback for browsers that don't support document.fonts
        setTimeout(() => loadingManager.resourceLoaded("fonts"), 1000)
      }

      // Ensure we always set mounted to true
      setMounted(true)
    } catch (error) {
      console.error("Error in ClientPreloaderWrapper initialization:", error)

      // Ensure critical resources are marked as loaded even if there's an error
      try {
        loadingManager.resourceLoaded("critical-css")
        loadingManager.resourceLoaded("critical-js")
        loadingManager.resourceLoaded("fonts")
      } catch (innerError) {
        console.error("Error marking resources as loaded:", innerError)
      }

      // Ensure we still set mounted to true to show the preloader
      setMounted(true)
    }
  }, [])

  // Listen for preloader completion
  const handlePreloaderComplete = () => {
    setPreloaderDone(true)
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      <Preloader quotesToShow={quotesToShow} onComplete={handlePreloaderComplete} />
      {children}
    </>
  )
}

// Named export
export { ClientPreloaderWrapper as default }
