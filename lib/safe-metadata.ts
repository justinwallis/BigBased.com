import type { Metadata } from "next"

// Global metadata error prevention
export function createSafeMetadata(metadata: Partial<Metadata> = {}): Metadata {
  const defaultMetadata: Metadata = {
    title: "Big Based - Cultural Revolution Platform",
    description:
      "Big Based is a cultural revolution platform dedicated to reclaiming digital sovereignty, preserving truth, and building a parallel economy based on freedom and responsibility.",
  }

  // Safely merge metadata with defaults
  return {
    ...defaultMetadata,
    ...metadata,
    // Ensure title is always defined
    title: metadata.title || defaultMetadata.title,
    description: metadata.description || defaultMetadata.description,
  }
}

// Safe metadata generation function
export function generateSafeMetadata(title?: string, description?: string, imagePath?: string): Metadata {
  const safeTitle = title || "Big Based"
  const safeDescription = description || "Cultural Revolution Platform"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com"
  const imageUrl = imagePath ? `${baseUrl}${imagePath}` : `${baseUrl}/BigBasedPreview.png`

  return createSafeMetadata({
    title: safeTitle,
    description: safeDescription,
    openGraph: {
      title: `${safeTitle} | Big Based`,
      description: safeDescription,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: safeTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${safeTitle} | Big Based`,
      description: safeDescription,
      images: [imageUrl],
    },
  })
}
