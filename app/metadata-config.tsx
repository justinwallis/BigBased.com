import type { Metadata, Viewport } from "next/types"

// Common viewport configuration
export const viewportConfig: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#ffffff",
  colorScheme: "light dark",
}

// Update the getAbsoluteUrl function to handle undefined paths
const getAbsoluteUrl = (path: string): string => {
  if (!path) return process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com"

  // Use a hardcoded URL if environment variable isn't available
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com"

  // If the path is already an absolute URL, return it as is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }

  // Otherwise, join the base URL with the path
  return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`
}

// Base metadata configuration
export const baseMetadata: Metadata = {
  title: {
    template: "%s | Big Based",
    default: "Big Based - Cultural Revolution Platform",
  },
  description:
    "Big Based is a cultural revolution platform dedicated to reclaiming digital sovereignty, preserving truth, and building a parallel economy based on freedom and responsibility.",
  applicationName: "Big Based",
  authors: [{ name: "Big Based Team" }],
  generator: "Next.js",
  keywords: [
    "cultural revolution",
    "digital sovereignty",
    "truth archives",
    "parallel economy",
    "freedom",
    "faith",
    "Christian values",
    "America first",
  ],
  referrer: "origin",
  creator: "Big Based",
  publisher: "Big Based",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com",
    siteName: "Big Based",
    title: "Big Based - Cultural Revolution Platform",
    description:
      "Big Based is a cultural revolution platform dedicated to reclaiming digital sovereignty, preserving truth, and building a parallel economy based on freedom and responsibility.",
    images: [
      {
        url: getAbsoluteUrl("/BigBasedPreview.png"),
        width: 1200,
        height: 630,
        alt: "Big Based - Answer to Madness",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@bigbased",
    creator: "@bigbased",
    title: "Big Based - Cultural Revolution Platform",
    description:
      "Big Based is a cultural revolution platform dedicated to reclaiming digital sovereignty, preserving truth, and building a parallel economy based on freedom and responsibility.",
    images: [getAbsoluteUrl("/BigBasedPreview.png")],
  },
  other: {
    "msapplication-TileColor": "#000000",
    "msapplication-config": "/browserconfig.xml",
    "dc.title": "Big Based",
    "dc.description":
      "A cultural revolution platform dedicated to reclaiming digital sovereignty, preserving truth, and building a parallel economy.",
    "dc.relation": process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com",
    "dc.source": process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com",
    "dc.language": "en_US",
    // Discord metadata
    "discord:title": "Big Based - Answer to Madness",
    "discord:description":
      "Big Based isn't just a platform, it's a cultural revolution with 10,000+ meticulously researched pages of truth, faith, and insight.",
    "discord:image": getAbsoluteUrl("/BigBasedPreview.png"),
    // LinkedIn metadata
    "linkedin:title": "Big Based - Cultural Revolution Platform",
    "linkedin:description":
      "Join the cultural revolution to reclaim digital sovereignty and build a parallel economy based on freedom.",
    "linkedin:image": getAbsoluteUrl("/BigBasedPreview.png"),
    // Slack metadata
    "slack-app-id": "A12345678",
    "slack:title": "Big Based - Answer to Madness",
    "slack:description": "A cultural revolution platform with 10,000+ pages of meticulously researched content.",
    "slack:image": getAbsoluteUrl("/BigBasedPreview.png"),
  },
}

// Update the generateMetadata function to handle undefined cases
export function generateMetadata(title: string, description: string, imagePath?: string): Metadata {
  const safeTitle = title || "Big Based"
  const safeDescription = description || "Cultural Revolution Platform"
  const imageUrl = imagePath ? getAbsoluteUrl(imagePath) : getAbsoluteUrl("/BigBasedPreview.png")

  return {
    ...baseMetadata,
    title: safeTitle,
    description: safeDescription,
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${safeTitle} | Big Based`,
      description: safeDescription,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${safeTitle} | Big Based`,
        },
      ],
    },
    twitter: {
      ...baseMetadata.twitter,
      title: `${safeTitle} | Big Based`,
      description: safeDescription,
      images: [imageUrl],
    },
    alternates: {
      canonical: `/${safeTitle.toLowerCase().replace(/\s+/g, "-")}`,
    },
    other: {
      ...baseMetadata.other,
      "discord:title": `${safeTitle} | Big Based`,
      "discord:description": safeDescription,
      "discord:image": imageUrl,
      "linkedin:title": `${safeTitle} | Big Based`,
      "linkedin:description": safeDescription,
      "linkedin:image": imageUrl,
      "slack:title": `${safeTitle} | Big Based`,
      "slack:description": safeDescription,
      "slack:image": imageUrl,
    },
  }
}
