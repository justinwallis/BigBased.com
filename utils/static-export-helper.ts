// Helper to check if we're in a static export build
export const isStaticExport = process.env.NEXT_STATIC_EXPORT === "true"

// Helper to get the base URL with proper fallback
export const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com"
}

// Helper to get asset URLs that work in both static and dynamic builds
export const getAssetUrl = (path: string) => {
  // If path already starts with http, return as is
  if (path.startsWith("http")) return path

  // If we're in development, use relative path
  if (process.env.NODE_ENV === "development") return path

  // Otherwise, use absolute path with base URL
  const baseUrl = getBaseUrl()
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`
}
