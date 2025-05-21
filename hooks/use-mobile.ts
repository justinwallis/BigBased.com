"use client"

import { useState, useEffect } from "react"

/**
 * Hook to determine if the screen size matches a given media query
 * @param query The media query to check (e.g., "(max-width: 768px)")
 * @returns True if the media query matches, false otherwise
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Ensure we're running in a browser environment
    if (typeof window !== "undefined") {
      const mediaQueryList = window.matchMedia(query)

      // Function to update the matches state
      const handleChange = () => {
        setMatches(mediaQueryList.matches)
      }

      // Set initial value
      handleChange()

      // Add listener for changes
      mediaQueryList.addEventListener("change", handleChange)

      // Clean up listener
      return () => {
        mediaQueryList.removeEventListener("change", handleChange)
      }
    }
  }, [query])

  return matches
}

/**
 * Hook to determine if the screen size is mobile or tablet
 * @returns Object with isMobile and isTablet properties
 */
export function useMobile() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(max-width: 1023px)")

  return { isMobile, isTablet }
}
