"use client"

import { useEffect, useState } from "react"

// Add the missing useMediaQuery export
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    media.addEventListener("change", listener)

    return () => media.removeEventListener("change", listener)
  }, [matches, query])

  return matches
}

// Add the missing useMobile export
export function useMobile(): boolean {
  return useMediaQuery("(max-width: 768px)")
}

// Keep the existing default export if it exists
export default function useMobileDefault(): boolean {
  return useMobile()
}
