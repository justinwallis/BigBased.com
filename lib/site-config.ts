// Dynamic configuration based on domain
const getCurrentDomain = () => {
  if (typeof window !== "undefined") {
    return window.location.hostname
  }
  return process.env.VERCEL_URL || process.env.NEXT_PUBLIC_DOMAIN || "bigbased.com"
}

const isDomain = (domain: string) => {
  const currentDomain = getCurrentDomain()
  return currentDomain.includes(domain)
}

export const siteConfig = {
  // Domain detection
  isBigBased: isDomain("bigbased.com"),
  isBasedBook: isDomain("basedbook.com"),

  // Dynamic branding
  siteName: isDomain("bigbased.com") ? "Big Based" : "BasedBook",
  tagline: isDomain("bigbased.com") ? "Answer to Madness" : "Your Conservative Digital Library",

  logo: isDomain("bigbased.com") ? "/bb-logo.png" : "/basedbook-logo.png",
  favicon: isDomain("bigbased.com") ? "/favicon.ico" : "/basedbook-favicon.ico",

  // Color schemes
  colors: {
    primary: isDomain("bigbased.com") ? "#1f2937" : "#7c3aed",
    secondary: isDomain("bigbased.com") ? "#3b82f6" : "#a855f7",
    accent: isDomain("bigbased.com") ? "#ef4444" : "#ec4899",
  },

  // Feature flags per site
  features: {
    enableBilling: isDomain("bigbased.com"),
    enableBookReader: isDomain("bigbased.com"), // BigBased exclusive
    enableVoting: isDomain("bigbased.com"), // BigBased exclusive
    enablePrayerFeed: isDomain("bigbased.com"), // BigBased exclusive
    enableRevolution: isDomain("bigbased.com"), // BigBased exclusive

    enableLibraryBrowse: isDomain("basedbook.com"), // BasedBook exclusive
    enableAuthorProfiles: isDomain("basedbook.com"), // BasedBook exclusive
    enableCollections: isDomain("basedbook.com"), // BasedBook exclusive

    // Shared features
    enableProfiles: true, // Both sites
    enableAuth: true, // Both sites
    enableSettings: true, // Both sites
  },

  // Navigation per site (only for site-specific pages)
  navigation: isDomain("bigbased.com")
    ? [
        { name: "About", href: "/about" },
        { name: "Features", href: "/features" },
        { name: "Revolution", href: "/revolution" },
        { name: "Transform", href: "/transform" },
        { name: "Books", href: "/books" }, // BigBased exclusive
        { name: "Voting", href: "/voting" }, // BigBased exclusive
        { name: "Partners", href: "/partners" },
        { name: "Contact", href: "/contact" },
      ]
    : [
        { name: "Library", href: "/library" }, // BasedBook exclusive
        { name: "Authors", href: "/authors" }, // BasedBook exclusive
        { name: "Collections", href: "/collections" }, // BasedBook exclusive
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
      ],

  // SEO per site
  seo: {
    title: isDomain("bigbased.com") ? "Big Based - Answer to Madness" : "BasedBook - Conservative Digital Library",
    description: isDomain("bigbased.com")
      ? "Big Based isn't just a platform, it's a cultural revolution. At its core lies a living library of truth, faith, and insight, 10,000+ meticulously researched pages designed to educate, inspire, and transform."
      : "BasedBook is your premier destination for conservative literature, educational resources, and community-driven content. Discover thousands of books, connect with authors, and join meaningful discussions.",
    ogImage: isDomain("bigbased.com") ? "/BigBasedPreview.png" : "/BasedBookPreview.png",
  },

  // Page access control
  pageAccess: {
    // BigBased exclusive pages
    "/books": "bigbased",
    "/voting": "bigbased",
    "/revolution": "bigbased",
    "/transform": "bigbased",
    "/features": "bigbased",
    "/partners": "bigbased",

    // BasedBook exclusive pages
    "/library": "basedbook",
    "/authors": "basedbook",
    "/collections": "basedbook",

    // Shared pages (accessible from both domains)
    "/profile": "shared",
    "/auth": "shared",
    "/contact": "shared",
    "/about": "shared",
    // All username pages are shared
    "/[username]": "shared",
  },
}

export default siteConfig
