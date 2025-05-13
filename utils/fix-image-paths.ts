/**
 * Utility to check and fix image paths in the application
 */

import fs from "fs"
import path from "path"

/**
 * Checks if a file exists in the public directory
 * @param filePath Path to check
 * @returns True if the file exists, false otherwise
 */
export function fileExistsInPublic(filePath: string): boolean {
  try {
    // Remove leading slash if present
    const normalizedPath = filePath.startsWith("/") ? filePath.substring(1) : filePath
    const fullPath = path.join(process.cwd(), "public", normalizedPath)
    return fs.existsSync(fullPath)
  } catch (error) {
    console.error(`Error checking if file exists: ${filePath}`, error)
    return false
  }
}

/**
 * Gets a list of all image files in the public directory
 * @returns Array of image file paths
 */
export function getAllPublicImages(): string[] {
  try {
    const publicDir = path.join(process.cwd(), "public")
    const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"]

    function walkDir(dir: string, fileList: string[] = []): string[] {
      const files = fs.readdirSync(dir)

      files.forEach((file) => {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)

        if (stat.isDirectory()) {
          fileList = walkDir(filePath, fileList)
        } else {
          const ext = path.extname(file).toLowerCase()
          if (imageExtensions.includes(ext)) {
            // Convert to relative path from public directory
            const relativePath = "/" + path.relative(publicDir, filePath).replace(/\\/g, "/")
            fileList.push(relativePath)
          }
        }
      })

      return fileList
    }

    return walkDir(publicDir)
  } catch (error) {
    console.error("Error getting all public images:", error)
    return []
  }
}

/**
 * Checks if all images referenced in a component exist
 * @param componentPath Path to the component file
 * @returns Array of missing image paths
 */
export function checkComponentImages(componentPath: string): string[] {
  try {
    const content = fs.readFileSync(componentPath, "utf8")
    const imageRegex = /src=["'](\/[^"']+\.(png|jpg|jpeg|gif|svg|webp))["']/g
    const missingImages: string[] = []

    let match
    while ((match = imageRegex.exec(content)) !== null) {
      const imagePath = match[1]
      if (!fileExistsInPublic(imagePath) && !imagePath.includes("placeholder.svg")) {
        missingImages.push(imagePath)
      }
    }

    return missingImages
  } catch (error) {
    console.error(`Error checking component images: ${componentPath}`, error)
    return []
  }
}

/**
 * Creates placeholder images for missing images
 * @param missingImages Array of missing image paths
 */
export function createPlaceholderImages(missingImages: string[]): void {
  try {
    missingImages.forEach((imagePath) => {
      // Remove leading slash if present
      const normalizedPath = imagePath.startsWith("/") ? imagePath.substring(1) : imagePath
      const fullPath = path.join(process.cwd(), "public", normalizedPath)

      // Create directory if it doesn't exist
      const dir = path.dirname(fullPath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }

      // Create a simple SVG placeholder
      const svgContent = `
        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f0f0f0"/>
          <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#888" text-anchor="middle">
            ${path.basename(imagePath)}
          </text>
        </svg>
      `

      fs.writeFileSync(fullPath, svgContent)
      console.log(`Created placeholder for: ${imagePath}`)
    })
  } catch (error) {
    console.error("Error creating placeholder images:", error)
  }
}
