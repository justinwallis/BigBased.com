"use client"

import { useEffect } from "react"
import loadingManager from "@/utils/loading-manager"

/**
 * Hook to preload multiple images and track their loading status using the loading manager.
 * @param resourceIds An array of unique resource IDs for each image.
 * @param srcs An array of image source URLs corresponding to the resource IDs.
 * @param weight Optional weight to assign to each image loading process.
 */
export function useImagePreloader(resourceIds: string[], srcs: string[], weight = 1): void {
  useEffect(() => {
    if (resourceIds.length !== srcs.length) {
      console.error("Resource IDs and image sources arrays must have the same length.")
      return
    }

    resourceIds.forEach((resourceId, index) => {
      const src = srcs[index]

      if (!src) {
        // If no src, mark as loaded immediately
        loadingManager.registerResource(resourceId, weight)
        loadingManager.resourceLoaded(resourceId)
        return
      }

      // Register the resource
      loadingManager.registerResource(resourceId, weight)
      loadingManager.startLoading(resourceId)

      // Create an image element to track loading
      const img = new Image()

      img.onload = () => {
        try {
          loadingManager.resourceLoaded(resourceId)
        } catch (error) {
          console.error(`Error marking image ${resourceId} as loaded:`, error)
          // Ensure we don't block loading
          loadingManager.resourceError(resourceId)
        }
      }

      img.onerror = () => {
        console.warn(`Failed to load image: ${src}`)
        try {
          loadingManager.resourceError(resourceId)
        } catch (error) {
          console.error(`Error marking image ${resourceId} as error:`, error)
        }
      }

      img.src = src

      // Cleanup function
      return () => {
        img.onload = null
        img.onerror = null
      }
    })
  }, [resourceIds, srcs, weight])
}
