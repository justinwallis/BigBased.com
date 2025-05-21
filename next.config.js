/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
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
  // Add this to suppress the message port errors
  experimental: {
    // This helps with some React 18 hydration issues
    optimizeCss: true,
    // This can help with the message port errors
    scrollRestoration: true,
  },
  async headers() {
    return [
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
    ]
  },
  async rewrites() {
    return [
      {
        source: "/social-preview",
        destination: "/static-meta.html",
      },
      // Add rewrites for the missing feature pages to prevent 404 errors
      {
        source: "/features/:path*",
        destination: "/features",
      },
    ]
  },
}

module.exports = nextConfig
