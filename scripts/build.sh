#!/bin/bash

# Build script to handle build process with proper environment variables

# Set environment variables for the build
export NEXT_STATIC_EXPORT=false

# Run the build
echo "Building with output: standalone..."
pnpm run build

# Copy favicon files to ensure they're available
echo "Copying favicon files..."
mkdir -p .next/static/media
cp public/favicon.ico .next/static/
cp public/icon0.svg .next/static/
cp public/icon1.png .next/static/
cp public/apple-icon.png .next/static/
cp public/manifest.json .next/static/
cp public/favicon.ico .next/
cp public/icon0.svg .next/
cp public/icon1.png .next/
cp public/apple-icon.png .next/
cp public/manifest.json .next/

echo "Build completed successfully!"
