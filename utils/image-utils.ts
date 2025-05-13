/**
 * Utility functions for image loading and management
 */

/**
 * Checks if an image exists at the given URL
 * @param url The URL to check
 * @returns A promise that resolves to true if the image exists, false otherwise
 */
export async function checkImageExists(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.crossOrigin = "anonymous" // Add this to avoid CORS issues
    img.src = url
  })
}

/**
 * Preloads an image
 * @param url The URL of the image to preload
 * @returns A promise that resolves when the image is loaded
 */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = (err) => reject(err)
    img.crossOrigin = "anonymous" // Add this to avoid CORS issues
    img.src = url
  })
}

/**
 * Ensures image paths are properly formatted for both development and production
 * @param path The image path
 * @returns A properly formatted image path
 */
export function getImagePath(path: string): string {
  return normalizeImageUrl(path)
}

/**
 * Gets a placeholder image URL
 * @param width The width of the placeholder image
 * @param height The height of the placeholder image
 * @param text The text to display on the placeholder image
 * @returns A placeholder image URL
 */
export function getPlaceholderImage(width: number, height: number, text: string): string {
  return `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(text)}`
}

/**
 * Normalizes an image URL
 * @param url The URL to normalize
 * @returns A normalized URL
 */
export function normalizeImageUrl(url: string): string {
  if (!url) return ""

  // If it's already a full URL, return it as is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }

  // If it's a placeholder SVG, return it as is
  if (url.startsWith("/placeholder.svg")) {
    return url
  }

  // Ensure the URL starts with a slash
  return url.startsWith("/") ? url : `/${url}`
}
