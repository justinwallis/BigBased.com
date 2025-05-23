/**
 * Preloads a set of images to improve user experience
 * @param imagePaths Array of image paths to preload
 * @returns Promise that resolves when all images are loaded or fails
 */
export async function preloadImages(imagePaths: string[]): Promise<void> {
  try {
    // Create an array of promises for each image load
    const imagePromises = imagePaths.map((path) => {
      return new Promise<void>((resolve, reject) => {
        // Skip if path is undefined or empty
        if (!path) {
          resolve()
          return
        }

        const img = new Image()

        img.onload = () => {
          resolve()
        }

        img.onerror = () => {
          console.warn(`Failed to preload image: ${path}`)
          // Resolve anyway to not block the Promise.all
          resolve()
        }

        // Set the source to start loading
        img.src = path
      })
    })

    // Wait for all images to load
    await Promise.all(imagePromises)
  } catch (error) {
    console.error("Error preloading images:", error)
    // Don't throw, just log the error to not block the application
  }
}

/**
 * Preloads the next N images in a sequence
 * @param currentIndex Current index in the image array
 * @param imagePaths Array of all image paths
 * @param count Number of next images to preload
 */
export const preloadNextImages = (currentIndex: number, imagePaths: string[], count: number) => {
  try {
    const nextImages = imagePaths.slice(currentIndex + 1, currentIndex + 1 + count)
    nextImages.forEach((imagePath) => {
      const img = new Image()
      img.src = imagePath
    })
  } catch (error) {
    console.error("Error preloading images:", error)
  }
}

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}
