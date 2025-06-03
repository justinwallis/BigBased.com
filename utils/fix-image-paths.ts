import fs from "fs"
import path from "path"

export function checkComponentImages(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8")
    const imageRegex = /src=["']([^"']+)["']/g
    const missingImages = []

    let match
    while ((match = imageRegex.exec(content)) !== null) {
      const imagePath = match[1]
      if (imagePath.startsWith("/") && !imagePath.startsWith("//")) {
        const fullPath = path.join(process.cwd(), "public", imagePath.substring(1))
        if (!fs.existsSync(fullPath)) {
          missingImages.push(imagePath)
        }
      }
    }

    return missingImages
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    return []
  }
}

export function createPlaceholderImages(imagePaths) {
  imagePaths.forEach((imagePath) => {
    const fullPath = path.join(process.cwd(), "public", imagePath.substring(1))
    const dir = path.dirname(fullPath)

    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // Create a simple placeholder file
    const placeholderContent = `<!-- Placeholder for ${imagePath} -->`
    fs.writeFileSync(fullPath, placeholderContent)
    console.log(`Created placeholder: ${imagePath}`)
  })
}

export function getAllPublicImages() {
  const publicDir = path.join(process.cwd(), "public")
  const images = []

  function scanDirectory(dir) {
    const items = fs.readdirSync(dir)
    items.forEach((item) => {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        scanDirectory(fullPath)
      } else if (/\.(png|jpg|jpeg|gif|svg|webp)$/i.test(item)) {
        const relativePath = path.relative(publicDir, fullPath)
        images.push("/" + relativePath.replace(/\\/g, "/"))
      }
    })
  }

  if (fs.existsSync(publicDir)) {
    scanDirectory(publicDir)
  }

  return images
}
