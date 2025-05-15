import type { Metadata, Viewport } from "next/types"

// Base URL for the website
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com"

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
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Big Based",
    title: "Big Based - Cultural Revolution Platform",
    description:
      "Big Based is a cultural revolution platform dedicated to reclaiming digital sovereignty, preserving truth, and building a parallel economy based on freedom and responsibility.",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
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
    images: [`${baseUrl}/og-image.png`],
  },
  other: {
    "msapplication-TileColor": "#000000",
    "msapplication-config": "/browserconfig.xml",
    "dc.title": "Big Based",
    "dc.description":
      "A cultural revolution platform dedicated to reclaiming digital sovereignty, preserving truth, and building a parallel economy.",
    "dc.relation": baseUrl,
    "dc.source": baseUrl,
    "dc.language": "en_US",
    // Discord metadata
    "discord:title": "Big Based - Answer to Madness",
    "discord:description":
      "Big Based isn't just a platform, it's a cultural revolution with 6000+ pages of truth, faith, and insight.",
    "discord:image": `${baseUrl}/og-image.png`,
    // LinkedIn metadata
    "linkedin:title": "Big Based - Cultural Revolution Platform",
    "linkedin:description":
      "Join the cultural revolution to reclaim digital sovereignty and build a parallel economy based on freedom.",
    "linkedin:image": `${baseUrl}/og-image.png`,
    // Slack metadata
    "slack-app-id": "A12345678",
    "slack:title": "Big Based - Answer to Madness",
    "slack:description": "A cultural revolution platform with 6000+ pages of meticulously researched content.",
    "slack:image": `${baseUrl}/og-image.png`,
  },
}

// Viewport configuration
export const viewportConfig: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
  colorScheme: "light dark",
}

// Helper function to generate metadata for specific pages
export function generateMetadata(title: string, description: string): Metadata {
  return {
    ...baseMetadata,
    title,
    description,
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${title} | Big Based`,
      description,
    },
    twitter: {
      ...baseMetadata.twitter,
      title: `${title} | Big Based`,
      description,
    },
    alternates: {
      canonical: `/${title.toLowerCase().replace(/\s+/g, "-")}`,
    },
  }
}
