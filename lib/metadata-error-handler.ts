import type { Metadata } from "next"

// Global metadata error handler
export function safeMetadata(metadata: Partial<Metadata> = {}): Metadata {
  try {
    const defaultMeta: Metadata = {
      title: "Big Based - Cultural Revolution Platform",
      description:
        "Big Based is a cultural revolution platform dedicated to reclaiming digital sovereignty, preserving truth, and building a parallel economy based on freedom and responsibility.",
    }

    // Safely merge with error handling
    return {
      ...defaultMeta,
      ...metadata,
      title: metadata.title || defaultMeta.title,
      description: metadata.description || defaultMeta.description,
    }
  } catch (error) {
    console.error("Metadata generation error:", error)
    // Return minimal safe metadata
    return {
      title: "Big Based",
      description: "Cultural Revolution Platform",
    }
  }
}

// Safe metadata generation with error handling
export function generateSafePageMetadata(title?: string, description?: string, imagePath?: string): Metadata {
  try {
    const safeTitle = title || "Big Based"
    const safeDescription = description || "Cultural Revolution Platform"
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com"
    const imageUrl = imagePath ? `${baseUrl}${imagePath}` : `${baseUrl}/BigBasedPreview.png`

    return safeMetadata({
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
  } catch (error) {
    console.error("Page metadata generation error:", error)
    return safeMetadata()
  }
}
