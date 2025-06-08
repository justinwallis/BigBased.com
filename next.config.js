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
    domains: ["placeholder.com", "via.placeholder.com"],
    unoptimized: true,
  },
  async headers() {
    return [
      // Security headers for all pages
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      // Cache static assets aggressively
      {
        source: "/(.*)\\.(png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable", // 1 year
          },
        ],
      },
      // Cache CSS and JS files
      {
        source: "/(.*)\\.(css|js)$",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable", // 1 year
          },
        ],
      },
      // Cache PDFs and media files
      {
        source: "/(.*)\\.(pdf|mp4|webm|mp3|wav)$",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000", // 30 days
          },
        ],
      },
      // Cache API responses that are safe to cache
      {
        source: "/api/debug/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: "/social-preview",
        destination: "/static-meta.html",
      },
    ]
  },
}

module.exports = nextConfig
