"use client"

import { useEffect } from "react"
import loadingManager from "@/utils/loading-manager"

/**
 * Hook to register and track a resource with the loading manager
 */
export function useResourceLoading(resourceId: string, weight = 1, autoComplete = false) {
  useEffect(() => {
    try {
      // Register the resource
      loadingManager.registerResource(resourceId, weight)

      // Mark as loading
      loadingManager.startLoading(resourceId)

      // If autoComplete is true, mark as loaded immediately
      if (autoComplete) {
        loadingManager.resourceLoaded(resourceId)
      }

      // Cleanup function
      return () => {
        // If the component unmounts before loading completes, mark as error
        // This prevents hanging on resources that never complete
        if (!autoComplete) {
          loadingManager.resourceError(resourceId)
        }
      }
    } catch (error) {
      console.error(`Error in useResourceLoading for ${resourceId}:`, error)
      // Ensure we don't block loading
      loadingManager.resourceError(resourceId)
    }
  }, [resourceId, weight, autoComplete])

  // Return functions to mark the resource as loaded or error
  return {
    markLoaded: () => {
      try {
        loadingManager.resourceLoaded(resourceId)
      } catch (error) {
        console.error(`Error marking ${resourceId} as loaded:`, error)
      }
    },
    markError: () => {
      try {
        loadingManager.resourceError(resourceId)
      } catch (error) {
        console.error(`Error marking ${resourceId} as error:`, error)
      }
    },
  }
}

/**
 * Hook to track image loading
 */
export function useImageLoading(resourceId: string, src: string | undefined, weight = 1) {
  useEffect(() => {
    try {
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
    } catch (error) {
      console.error(`Error in useImageLoading for ${resourceId}:`, error)
      // Ensure we don't block loading
      try {
        loadingManager.resourceError(resourceId)
      } catch (innerError) {
        console.error(`Error marking ${resourceId} as error:`, innerError)
      }
    }
  }, [resourceId, src, weight])
}

/**
 * Hook to track data fetching
 */
export function useDataLoading<T>(resourceId: string, fetchFn: () => Promise<T>, weight = 1) {
  useEffect(() => {
    try {
      // Register the resource
      loadingManager.registerResource(resourceId, weight)
      loadingManager.startLoading(resourceId)

      // Start fetching
      fetchFn()
        .then(() => {
          loadingManager.resourceLoaded(resourceId)
        })
        .catch((error) => {
          console.error(`Error loading resource ${resourceId}:`, error)
          loadingManager.resourceError(resourceId)
        })
    } catch (error) {
      console.error(`Error in useDataLoading for ${resourceId}:`, error)
      // Ensure we don't block loading
      loadingManager.resourceError(resourceId)
    }
  }, [resourceId, fetchFn, weight])
}
