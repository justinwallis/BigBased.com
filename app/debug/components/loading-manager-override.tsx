"use client"

import { useEffect } from "react"

export default function LoadingManagerOverride() {
  useEffect(() => {
    console.log("LoadingManagerOverride component mounted")

    // Function to override the loading manager
    const overrideLoadingManager = () => {
      console.log("Attempting to override loading manager")

      try {
        // Try to access the loading manager instance
        if (window.loadingManager) {
          console.log("Found loadingManager in window object")

          // Force the loading manager to complete
          if (typeof window.loadingManager.resourceLoaded === "function") {
            console.log("Forcing all resources to be marked as loaded")

            // Get all resources
            const resources = window.loadingManager.getResourcesStatus ? window.loadingManager.getResourcesStatus() : {}

            console.log("Resources:", resources)

            // Mark all resources as loaded
            Object.keys(resources).forEach((resourceId) => {
              console.log(`Marking resource ${resourceId} as loaded`)
              window.loadingManager.resourceLoaded(resourceId)
            })

            // Reset the loading manager
            if (typeof window.loadingManager.reset === "function") {
              console.log("Resetting loading manager")
              window.loadingManager.reset()
            }
          }
        } else {
          console.log("loadingManager not found in window object")

          // Try to find the loading manager in the global scope
          const globalScope = window as any

          // Look for loading manager in common variable names
          const possibleNames = [
            "loadingManager",
            "LoadingManager",
            "_loadingManager",
            "loadingManagerInstance",
            "__loadingManager",
          ]

          for (const name of possibleNames) {
            if (globalScope[name]) {
              console.log(`Found loading manager as ${name}`)

              // Force it to complete
              if (typeof globalScope[name].resourceLoaded === "function") {
                console.log(`Using ${name} to mark resources as loaded`)

                // Get resources if possible
                const resources = globalScope[name].getResourcesStatus ? globalScope[name].getResourcesStatus() : {}

                console.log("Resources:", resources)

                // Mark all resources as loaded
                Object.keys(resources).forEach((resourceId) => {
                  console.log(`Marking resource ${resourceId} as loaded`)
                  globalScope[name].resourceLoaded(resourceId)
                })

                // Reset if possible
                if (typeof globalScope[name].reset === "function") {
                  console.log(`Resetting ${name}`)
                  globalScope[name].reset()
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Error overriding loading manager:", error)
      }
    }

    // Function to forcibly remove preloader elements
    const removePreloaderElements = () => {
      console.log("Forcibly removing preloader elements")

      // Target specific preloader elements based on the structure in the codebase
      const selectors = [
        // General preloader selectors
        '[id*="preloader"]',
        '[class*="preloader"]',
        "#initial-preloader",
        ".preloader",

        // Specific selectors based on the codebase
        ".fixed.inset-0.z-\\[9999\\]", // The main preloader container
        ".fixed.inset-0.flex.items-center.justify-center", // Another common pattern
        ".fixed.inset-0", // More general but might catch preloaders

        // Elements with high z-index
        '[style*="z-index: 9999"]',
        '[style*="z-index:9999"]',
        '[style*="zIndex: 9999"]',

        // Elements with position fixed or absolute
        'div[style*="position: fixed"]',
        'div[style*="position:fixed"]',
        'div[style*="position: absolute"]',
        'div[style*="position:absolute"]',
      ]

      // Combine all selectors
      const allSelectors = selectors.join(", ")
      const elements = document.querySelectorAll(allSelectors)

      console.log(`Found ${elements.length} potential preloader elements`)

      elements.forEach((el) => {
        if (el && el.parentNode) {
          console.log("Removing element:", el)
          el.parentNode.removeChild(el)
        }
      })

      // Also try to find and remove any motion-div elements that might be part of the preloader
      const motionDivs = document.querySelectorAll('div[style*="transform"]')
      motionDivs.forEach((el) => {
        // Check if this might be a preloader element (has high z-index or is fixed/absolute positioned)
        const style = window.getComputedStyle(el)
        const zIndex = Number.parseInt(style.zIndex) || 0
        const position = style.position

        if (zIndex > 100 || position === "fixed" || position === "absolute") {
          console.log("Removing potential preloader motion-div:", el)
          if (el.parentNode) {
            el.parentNode.removeChild(el)
          }
        }
      })
    }

    // Function to clear all intervals and timeouts
    const clearAllTimers = () => {
      console.log("Clearing all intervals and timeouts")

      // Clear intervals
      for (let i = 1; i < 10000; i++) {
        clearInterval(i)
      }

      // Try to clear timeouts (this is not guaranteed to work in all browsers)
      for (let i = 1; i < 10000; i++) {
        clearTimeout(i)
      }
    }

    // Function to force the body to be visible
    const forceBodyVisible = () => {
      console.log("Forcing body to be visible")

      document.body.style.display = "block"
      document.body.style.visibility = "visible"
      document.body.style.opacity = "1"

      // Also try to make html visible
      document.documentElement.style.display = "block"
      document.documentElement.style.visibility = "visible"
      document.documentElement.style.opacity = "1"

      // Remove any overflow hidden
      document.body.style.overflow = "auto"
      document.documentElement.style.overflow = "auto"
    }

    // Set up a MutationObserver to continuously remove preloader elements
    const setupMutationObserver = () => {
      console.log("Setting up MutationObserver")

      const observer = new MutationObserver((mutations) => {
        let shouldRemove = false

        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length > 0) {
            // Check if any added nodes might be preloader related
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1) {
                // Element node
                const el = node as Element

                // Check if this might be a preloader element
                if (
                  el.id?.includes("preloader") ||
                  (el.className && typeof el.className === "string" && el.className.includes("preloader")) ||
                  (el instanceof HTMLElement && el.style.zIndex && Number.parseInt(el.style.zIndex) > 100) ||
                  (el instanceof HTMLElement && (el.style.position === "fixed" || el.style.position === "absolute"))
                ) {
                  shouldRemove = true
                }
              }
            })
          }
        })

        if (shouldRemove) {
          console.log("MutationObserver detected potential preloader elements")
          removePreloaderElements()
        }
      })

      // Start observing
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "class"],
      })

      return observer
    }

    // Run all our functions
    overrideLoadingManager()
    removePreloaderElements()
    clearAllTimers()
    forceBodyVisible()

    // Set up the mutation observer
    const observer = setupMutationObserver()

    // Run our functions again after short delays
    const timeouts = [
      setTimeout(() => {
        overrideLoadingManager()
        removePreloaderElements()
      }, 100),
      setTimeout(() => {
        overrideLoadingManager()
        removePreloaderElements()
      }, 500),
      setTimeout(() => {
        overrideLoadingManager()
        removePreloaderElements()
      }, 1000),
      setTimeout(() => {
        overrideLoadingManager()
        removePreloaderElements()
      }, 2000),
      setTimeout(() => {
        overrideLoadingManager()
        removePreloaderElements()
      }, 5000),
    ]

    // Cleanup
    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
      observer.disconnect()
    }
  }, [])

  return null // This component doesn't render anything
}
