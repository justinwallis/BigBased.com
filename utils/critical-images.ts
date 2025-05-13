/**
 * List of critical images that should be preloaded
 * These are images that are visible above the fold
 */
export const criticalImages = [
  "/bb-logo.png",
  "/BgroundTech.png", // Add this line
  "/BB_Logo_Animation.gif",
  "/BB_Logo_Animation_invert.gif",
  "/american-flag.png",
  "/dove-spread-wings.png",
  "/cultural-decay.png",
  "/digital-sovereignty.png",
  "/truth-archives.png",
  "/parallel-economy.png",
  "/constitution-primer-cover.png",
  "/book-cover-digital-sovereignty.png",
  "/book-cover-faith-freedom.png",
  "/free-market-principles-cover.png",
]

/**
 * Utility function to preload critical images
 * This should be called as early as possible in the application lifecycle
 */
export function preloadCriticalImages(): void {
  if (typeof window === "undefined") return

  criticalImages.forEach((src) => {
    const img = new Image()
    img.src = src
  })
}
