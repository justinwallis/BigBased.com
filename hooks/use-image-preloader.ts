"use client"

import { useEffect } from "react"

export function useImagePreloader(imageKeys: string[], imagePaths: string[], weight = 1) {
  useEffect(() => {
    // Preload images
    imagePaths.forEach((path, index) => {
      if (path && path !== "/placeholder.svg") {
        const img = new Image()
        img.src = path
      }
    })
  }, [imagePaths])

  return {
    isLoading: false,
    progress: 100,
  }
}
