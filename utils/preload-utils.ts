/**
 * Preloads an array of images
 * @param imagePaths Array of image paths to preload
 * @returns Promise that resolves when all images are loaded
 */
export function preloadImages(imagePaths: string[]): Promise<void[]> {
  const imagePromises = imagePaths.map((src) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve()
      img.onerror = () => {
        console.warn(`Failed to preload image: ${src}`)
        resolve() // Resolve anyway to not block other images
      }
      img.src = src
    })
  })

  return Promise.all(imagePromises)
}

/**
 * Preloads a single image
 * @param imagePath Path to the image to preload
 * @returns Promise that resolves when the image is loaded
 */
export function preloadImage(imagePath: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => {
      console.warn(`Failed to preload image: ${imagePath}`)
      resolve() // Resolve anyway to not block
    }
    img.src = imagePath
  })
}

/**
 * Preloads the next image in a carousel or slideshow
 * @param currentIndex Current index in the carousel
 * @param images Array of image paths
 * @param preloadCount Number of images to preload ahead (default: 2)
 */
export function preloadNextImages(currentIndex: number, images: string[], preloadCount = 2): void {
  if (!images || !images.length) return

  for (let i = 1; i <= preloadCount; i++) {
    const nextIndex = (currentIndex + i) % images.length
    if (nextIndex >= 0 && nextIndex < images.length) {
      preloadImage(images[nextIndex])
    }
  }
}
