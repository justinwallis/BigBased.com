/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "v0.blob.com",
      "placeholder.svg",
      "www.w3.org",
      "www.africau.edu",
      "www.learningcontainer.com",
      "www.orimi.com",
      "www.clickdimensions.com",
      "file-examples.com",
      "unec.edu.az",
      "smallpdf.com",
    ],
    unoptimized: true, // Always use unoptimized images to avoid issues in production
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Don't use assetPrefix in production as it can cause issues with image loading
  // assetPrefix: process.env.NODE_ENV === "production" ? "/" : "",
  basePath: "",
  output: "standalone",
  // Add this to ensure public directory is included in the build
  publicRuntimeConfig: {
    staticFolder: "/public",
  },
}

module.exports = nextConfig
