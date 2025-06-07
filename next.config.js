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
    domains: ["localhost", "vercel.app"],
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/cms-admin",
        destination: "/api/payload/admin",
      },
      {
        source: "/cms-admin/:path*",
        destination: "/api/payload/admin/:path*",
      },
    ]
  },
}

module.exports = nextConfig
