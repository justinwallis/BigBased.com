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
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Ensure static files are properly copied
  output: "export", // Use export for static site generation
  distDir: "out", // Output to the 'out' directory
  trailingSlash: true, // Add trailing slashes to all routes

  // We can't use async headers with output: 'export'
  // So we'll remove the headers configuration
}

module.exports = nextConfig
