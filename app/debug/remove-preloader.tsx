"use client"

import { useEffect } from "react"

/**
 * Component to remove the initial preloader from the DOM
 * This is used in the debug layout to ensure no preloader is active
 */
export default function RemovePreloader() {
  useEffect(() => {
    const removePreloader = () => {
      const preloader = document.getElementById("initial-preloader")
      if (preloader && preloader.parentNode) {
        preloader.style.opacity = "0"
        preloader.style.transition = "opacity 0.5s ease-out"
        setTimeout(() => {
          if (preloader.parentNode) {
            preloader.parentNode.removeChild(preloader)
          }
        }, 500)
      }
    }

    // Call the function after the component mounts
    removePreloader()

    // Clean up function (though it's unlikely to be needed)
    return () => {
      // Attempt to remove the preloader again on unmount (just in case)
      removePreloader()
    }
  }, [])

  return null // This component doesn't render anything
}
