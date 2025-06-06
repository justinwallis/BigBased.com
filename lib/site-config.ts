// Safe site configuration with defaults
export const siteConfig = {
  isBasedBook: process.env.NEXT_PUBLIC_DOMAIN?.includes("basedbook") || false,
  isBigBased: !process.env.NEXT_PUBLIC_DOMAIN?.includes("basedbook") || true,
  domain: process.env.NEXT_PUBLIC_DOMAIN || "bigbased.com",
  name: process.env.NEXT_PUBLIC_DOMAIN?.includes("basedbook") ? "BasedBook" : "Big Based",
  title: process.env.NEXT_PUBLIC_DOMAIN?.includes("basedbook")
    ? "BasedBook - Conservative Literature Platform"
    : "Big Based - Cultural Revolution Platform",
  description: process.env.NEXT_PUBLIC_DOMAIN?.includes("basedbook")
    ? "Discover and share conservative literature, connect with like-minded authors and readers"
    : "Big Based is a cultural revolution platform dedicated to reclaiming digital sovereignty, preserving truth, and building a parallel economy based on freedom and responsibility.",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com",
}

// Export individual properties with safe defaults
export const isDomainBasedBook = siteConfig.isBasedBook
export const isDomainBigBased = siteConfig.isBigBased
export const siteName = siteConfig.name
export const siteTitle = siteConfig.title
export const siteDescription = siteConfig.description
