"use client"

/**
 * Utility function to get the correct image URL based on the environment
 * This helps ensure images work in both development and production
 */
export function getImageUrl(path: string): string {
  // Ensure path starts with a slash
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  // In production, we need to use the full URL
  if (process.env.NODE_ENV === "production") {
    // Use relative URLs in production to avoid CORS issues
    return normalizedPath
  }

  // In development, we can use relative URLs
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
    const response = await fetch(url, { method: "HEAD" })
    return response.ok
  } catch (error) {
    console.error("Error checking image existence:", error)
    return false
  }
}
