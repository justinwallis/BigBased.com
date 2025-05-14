"use client"

/**
 * Utility function to get the correct image URL based on the environment
 * This helps ensure images work in both development and production
 */
export function getImageUrl(path: string): string {
  // If path is already a full URL, return it as is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }

  // If path is a placeholder SVG, return it as is
  if (path.includes("placeholder.svg")) {
    return path
  }

  // Ensure path starts with a slash
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  // In production, we need to use the base path if defined
  if (process.env.NEXT_PUBLIC_BASE_PATH) {
    return `${process.env.NEXT_PUBLIC_BASE_PATH}${normalizedPath}`
  }

  // Return the normalized path
  return normalizedPath
}

/**
 * Utility function to get a fallback image URL
 * This is used when the main image fails to load
 */
export function getFallbackImageUrl(width = 400, height = 300): string {
  return `/placeholder.svg?height=${height}&width=${width}&text=Image+Not+Found`
}

/**
 * Utility function to check if an image exists
 * This is used to determine if we should use a fallback image
 */
export async function checkImageExists(url: string): Promise<boolean> {
  try {
    // For local development, we can use fetch
    if (process.env.NODE_ENV === "development") {
      const response = await fetch(url, { method: "HEAD" })
      return response.ok
    }

    // For production, we'll use Image() since fetch might have CORS issues
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = url
    })
  } catch (error) {
    console.error("Error checking image existence:", error)
    return false
  }
}
