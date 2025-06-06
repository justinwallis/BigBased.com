import type { Metadata } from "next"

/**
 * Generates safe page metadata with fallbacks to prevent build errors
 * @param title Page title
 * @param description Page description
 * @returns Metadata object with safe defaults
 */
export function generateSafePageMetadata(title: string, description: string): Metadata {
  return {
    title: title || "Big Based",
    description: description || "Big Based - Digital Sovereignty Platform",
  }
}

/**
 * Global metadata error handler to prevent build failures
 * @param metadata Original metadata object
 * @returns Safe metadata object with fallbacks
 */
export function withSafeMetadata(metadata: Partial<Metadata> | undefined): Metadata {
  return {
    title: metadata?.title || "Big Based",
    description: metadata?.description || "Big Based - Digital Sovereignty Platform",
    ...metadata,
  }
}
