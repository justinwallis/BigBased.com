#!/bin/bash

# Build script specifically for Vercel deployment

# Set environment variables for the build
export NEXT_PUBLIC_VERCEL_DEPLOYMENT=true

# Run the build
echo "Building for Vercel deployment..."
next build

# Copy favicon files to multiple locations to ensure they're available
echo "Copying favicon files to multiple locations..."
mkdir -p .next/static/media
mkdir -p .next/static/favicons
mkdir -p public/static/favicons

# Copy to .next/static
cp public/favicon.ico .next/static/
cp public/apple-touch-icon.png .next/static/
cp public/favicon-16x16.png .next/static/
cp public/favicon-32x32.png .next/static/
cp public/android-chrome-192x192.png .next/static/
cp public/android-chrome-512x512.png .next/static/
cp public/site.webmanifest .next/static/

# Copy to .next/static/favicons
cp public/favicon.ico .next/static/favicons/
cp public/apple-touch-icon.png .next/static/favicons/
cp public/favicon-16x16.png .next/static/favicons/
cp public/favicon-32x32.png .next/static/favicons/
cp public/android-chrome-192x192.png .next/static/favicons/
cp public/android-chrome-512x512.png .next/static/favicons/
cp public/site.webmanifest .next/static/favicons/

# Copy to .next root
cp public/favicon.ico .next/
cp public/apple-touch-icon.png .next/
cp public/favicon-16x16.png .next/
cp public/favicon-32x32.png .next/
cp public/android-chrome-192x192.png .next/
cp public/android-chrome-512x512.png .next/
cp public/site.webmanifest .next/

# Copy to public/static/favicons
cp public/favicon.ico public/static/favicons/
cp public/apple-touch-icon.png public/static/favicons/
cp public/favicon-16x16.png public/static/favicons/
cp public/favicon-32x32.png public/static/favicons/
cp public/android-chrome-192x192.png public/static/favicons/
cp public/android-chrome-512x512.png public/static/favicons/
cp public/site.webmanifest public/static/favicons/

echo "Build completed successfully!"
