import type React from "react"
import "./globals.css"
import type { Viewport } from "next/types"
import { Inter } from "next/font/google"
import { viewportConfig } from "./metadata-config"
import { getOrganizationData, getWebsiteData } from "@/lib/structured-data"

const inter = Inter({ subsets: ["latin"] })

// Get the base URL for absolute URLs
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com"

export const metadata = {
  title: "Big Based Website",
  description: "A website for Big Based",
    generator: 'v0.dev'
}

export const viewport: Viewport = viewportConfig

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Prepare structured data for the entire site
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [getOrganizationData(), getWebsiteData()],
  }

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
