// This is a Node.js script to manually copy favicon files to the output directory
// Run this after the build with: node public/copy-favicons.js

const fs = require("fs")
const path = require("path")

// Define source and destination directories
const sourceDir = path.join(__dirname) // public directory
const destDir = path.join(__dirname, "..", "out") // out directory

// List of files to copy
const filesToCopy = [
  "favicon.ico",
  "icon0.svg",
  "icon1.png",
  "apple-icon.png",
  "manifest.json",
  "web-app-manifest-192x192.png",
  "web-app-manifest-512x512.png",
]

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true })
}

// Copy each file
filesToCopy.forEach((file) => {
  const sourcePath = path.join(sourceDir, file)
  const destPath = path.join(destDir, file)

  try {
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath)
      console.log(`✅ Copied ${file} to ${destPath}`)
    } else {
      console.error(`❌ Source file not found: ${sourcePath}`)
    }
  } catch (error) {
    console.error(`❌ Error copying ${file}: ${error.message}`)
  }
})

console.log("Favicon copying complete!")
