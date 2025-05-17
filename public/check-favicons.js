// Simple script to verify favicon files exist
;(() => {
  console.log("Checking favicon files...")

  const faviconFiles = [
    "/favicon.ico",
    "/icon0.svg",
    "/icon1.png",
    "/apple-icon.png",
    "/manifest.json",
    "/web-app-manifest-192x192.png",
    "/web-app-manifest-512x512.png",
  ]

  faviconFiles.forEach((file) => {
    const img = new Image()
    img.onload = () => console.log(`✅ ${file} loaded successfully`)
    img.onerror = () => console.log(`❌ ${file} failed to load`)

    // For non-image files, use fetch instead
    if (file.endsWith(".json")) {
      fetch(file)
        .then((response) => {
          if (response.ok) {
            console.log(`✅ ${file} loaded successfully`)
          } else {
            console.log(`❌ ${file} failed to load (status: ${response.status})`)
          }
        })
        .catch((error) => console.log(`❌ ${file} failed to load: ${error}`))
    } else {
      img.src = file
    }
  })
})()
