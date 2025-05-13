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
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  assetPrefix: process.env.NODE_ENV === "production" ? "/" : "",
  basePath: "",
  output: "standalone",
}

module.exports = nextConfig
