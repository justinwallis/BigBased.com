/**
 * Script to check and fix image paths before build
 */

import { checkComponentImages, createPlaceholderImages, getAllPublicImages } from "../utils/fix-image-paths"
import path from "path"
import glob from "glob"

async function main() {
  console.log("Checking image paths...")

  // Get all component files
  const componentFiles = glob.sync("components/**/*.{tsx,jsx}", { cwd: process.cwd() })
  const pageFiles = glob.sync("app/**/*.{tsx,jsx}", { cwd: process.cwd() })
  const allFiles = [...componentFiles, ...pageFiles]

  // Check each file for missing images
  let allMissingImages: string[] = []

  allFiles.forEach((file) => {
    const filePath = path.join(process.cwd(), file)
    const missingImages = checkComponentImages(filePath)

    if (missingImages.length > 0) {
      console.log(`Found ${missingImages.length} missing images in ${file}:`)
      missingImages.forEach((img) => console.log(`  - ${img}`))
      allMissingImages = [...allMissingImages, ...missingImages]
    }
  })

  // Create placeholders for missing images
  if (allMissingImages.length > 0) {
    console.log(`Creating ${allMissingImages.length} placeholder images...`)
    createPlaceholderImages(allMissingImages)
  } else {
    console.log("All image paths are valid!")
  }

  // List all available images
  const publicImages = getAllPublicImages()
  console.log(`Found ${publicImages.length} images in public directory.`)
}

main().catch((error) => {
  console.error("Error checking images:", error)
  process.exit(1)
})
