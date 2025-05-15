import type { Metadata, Viewport } from "next/types"

// Common viewport configuration
export const viewportConfig: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
  colorScheme: "light dark",
}

// Ensure we have absolute URLs for all OpenGraph images
const getAbsoluteUrl = (path: string): string => {
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

// Helper function to generate metadata for specific pages
export function generateMetadata(title: string, description: string, imagePath?: string): Metadata {
  const imageUrl = imagePath ? getAbsoluteUrl(imagePath) : getAbsoluteUrl("/BigBasedPreview.png")

  return {
    ...baseMetadata,
    title,
    description,
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${title} | Big Based`,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} | Big Based`,
        },
      ],
    },
    twitter: {
      ...baseMetadata.twitter,
      title: `${title} | Big Based`,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `/${title.toLowerCase().replace(/\s+/g, "-")}`,
    },
    other: {
      ...baseMetadata.other,
      "discord:title": `${title} | Big Based`,
      "discord:description": description,
      "discord:image": imageUrl,
      "linkedin:title": `${title} | Big Based`,
      "linkedin:description": description,
      "linkedin:image": imageUrl,
      "slack:title": `${title} | Big Based`,
      "slack:description": description,
      "slack:image": imageUrl,
    },
  }
}
