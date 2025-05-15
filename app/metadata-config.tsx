import type { Metadata, Viewport } from "next/types"

// Common viewport configuration
export const viewportConfig: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
}

// Base metadata configuration
export const baseMetadata: Metadata = {
  title: "Big Based",
  description: "Empowering freedom-minded individuals",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon0.svg", type: "image/svg+xml" },
      { url: "/icon1.png", type: "image/png" },
    ],
    apple: { url: "/apple-icon.png", type: "image/png" },
    other: [{ rel: "manifest", url: "/manifest.json" }],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Big Based",
  },
}
