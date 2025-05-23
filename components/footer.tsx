"use client"
import { toggleSitemapEvent } from "./sitemap-container"
import { useTheme } from "@/components/theme-provider"

export default function Footer() {
  const { theme } = useTheme()

  // Use a more reliable approach with direct inline conditional
  const logoSrc = theme === "dark" ? "/BigBasedIconInvert.png" : "/bb-logo.png"

  const handleSitemapToggle = () => {
    // Dispatch the custom event to toggle the sitemap
    window.dispatchEvent(new Event(toggleSitemapEvent))
  }

  return (
    <footer className="border-t py-8 px-4">
      <div className="container mx-auto">
        <p className="text-center text-gray-600">© 2025 Big Based. All rights reserved.</p>
      </div>
    </footer>
  )
}
