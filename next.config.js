/** @type {import('next').NextConfig} */
const { withPayload } = require("@payloadcms/next/withPayload")
const path = require("path")

const nextConfig = withPayload(
  {
    reactStrictMode: true,
    swcMinify: true,
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      domains: ["placeholder.com", "via.placeholder.com", "localhost", "bigbased.com"],
      unoptimized: true,
      remotePatterns: [
        {
          protocol: "https",
          hostname: "**",
        },
      ],
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
      ]
    },
  },
  {
    // Payload config path
    configPath: path.resolve(process.cwd(), "payload.config.ts"),
  },
)

module.exports = nextConfig
