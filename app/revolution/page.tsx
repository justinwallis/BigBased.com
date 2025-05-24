import type { Metadata, Viewport } from "next/types"
import { viewportConfig, generateMetadata } from "../metadata-config"
import { getWebPageData, getBreadcrumbData, getArticleData } from "@/lib/structured-data"
import StructuredData from "@/components/structured-data"
import DigitalCross from "@/components/digital-cross"

export const metadata: Metadata = generateMetadata(
  "Revolution",
  "The convergence of Political, Religious, and Technological transformation shaping our future. A bold initiative to reclaim control, decentralize power, and align technology with faith and freedom.",
)

export const viewport: Viewport = viewportConfig

export default function RevolutionPage() {
  // Structured data for the revolution page
  const pageStructuredData = getWebPageData(
    "The Revolution - Big Based",
    "The convergence of Political, Religious, and Technological transformation shaping our future. A bold initiative to reclaim control, decentralize power, and align technology with faith and freedom.",
    "/revolution",
    "https://bigbased.com/og-image.png",
  )

  // Article structured data
  const articleStructuredData = getArticleData(
    "The Revolution - Convergence of Political, Religious, and Technological Transformation",
    "Big Based represents the convergence of Political, Religious, and Technological transformation shaping our future. It's a bold initiative to reclaim control, decentralize power, and align technology with faith and freedom.",
    "/revolution",
    "https://bigbased.com/og-image.png",
    "2023-01-01", // Publication date
    new Date().toISOString(), // Last modified date
    "Big Based Team", // Author
  )

  // Breadcrumb data
  const breadcrumbData = getBreadcrumbData([
    { name: "Home", path: "/" },
    { name: "Revolution", path: "/revolution" },
  ])

  // Combine structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [pageStructuredData, articleStructuredData, breadcrumbData],
  }

  return (
    <>
      <div
        className="min-h-screen w-full text-white flex flex-col items-center justify-center px-4 py-32 revolution-page relative"
        style={{
          backgroundColor: "#000000",
          backgroundImage: `
            linear-gradient(rgba(30, 30, 30, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30, 30, 30, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          minHeight: "100vh",
          paddingBottom: "0",
        }}
      >
        {/* Background image with 10% opacity */}
        <div
          className="absolute inset-0 w-full h-full z-0"
          style={{
            backgroundImage: `url('/BckgTech.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.1,
          }}
        />

        {/* Digital Cross - positioned above landscape but below text */}
        <div className="absolute inset-0 z-10">
          <DigitalCross />
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto text-center z-20 relative flex-1 flex flex-col justify-center">
          <p className="text-lg mb-4">The Revolution</p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-12 leading-tight">
            Convergence of
            <br />
            Political, Religious, and
            <br />
            Technological
            <br />
            Transformation Shaping
            <br />
            our Future.
          </h1>

          <div className="border border-white/30 p-6 max-w-3xl mx-auto text-sm md:text-base">
            <p>
              Big Based represents the convergence of Political, Religious, and Technological transformation shaping our
              future. It's a bold initiative to reclaim control, decentralize power, and align technology with faith and
              freedom as the world reaches a tipping point. Big Based offers the tools and vision to lead this cultural
              and digital renaissance.
            </p>
          </div>
        </div>

        {/* LANDSCAPE TEST - HIGHEST Z-INDEX TO FORCE VISIBILITY */}
        <div
          className="fixed inset-0 w-full h-full pointer-events-none"
          style={{
            zIndex: 9999,
            background: "rgba(255, 0, 0, 0.3)", // RED BACKGROUND - should be impossible to miss
          }}
        >
          {/* Giant test element */}
          <div
            className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-yellow-500 opacity-80 flex items-center justify-center text-black text-4xl font-bold"
            style={{ zIndex: 10000 }}
          >
            LANDSCAPE TEST
          </div>

          {/* Hills at bottom */}
          <div className="absolute bottom-0 left-0 w-full h-64 bg-green-500 opacity-70" />

          {/* Clouds at top */}
          <div className="absolute top-20 left-20 w-32 h-16 bg-white opacity-80 rounded-full" />
          <div className="absolute top-16 left-60 w-24 h-12 bg-white opacity-80 rounded-full" />
        </div>
      </div>
      <StructuredData data={structuredData} />
    </>
  )
}
