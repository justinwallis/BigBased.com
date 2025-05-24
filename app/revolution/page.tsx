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

        {/* INLINE DIGITAL LANDSCAPE - This should definitely show up */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
          style={{
            zIndex: 5,
            background: "linear-gradient(to bottom, rgba(0,100,0,0.1) 0%, rgba(0,50,0,0.2) 100%)",
          }}
        >
          {/* Clouds */}
          <div className="absolute top-10 left-0 w-full">
            <div className="absolute top-8 left-[10%] w-20 h-10 bg-white/30 rounded-full animate-pulse" />
            <div
              className="absolute top-12 left-[25%] w-16 h-8 bg-white/25 rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            />
            <div
              className="absolute top-6 left-[45%] w-24 h-12 bg-white/35 rounded-full animate-pulse"
              style={{ animationDelay: "2s" }}
            />
            <div
              className="absolute top-14 left-[65%] w-18 h-9 bg-white/28 rounded-full animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
            <div
              className="absolute top-10 left-[80%] w-22 h-11 bg-white/32 rounded-full animate-pulse"
              style={{ animationDelay: "1.5s" }}
            />
          </div>

          {/* Hills - Using simple shapes that should definitely render */}
          <div className="absolute bottom-0 left-0 w-full">
            {/* Back hill */}
            <div
              className="absolute bottom-0 w-full h-64 bg-green-800/40"
              style={{
                clipPath: "polygon(0 60%, 20% 40%, 40% 50%, 60% 30%, 80% 45%, 100% 35%, 100% 100%, 0 100%)",
              }}
            />

            {/* Middle hill */}
            <div
              className="absolute bottom-0 w-full h-48 bg-green-700/50"
              style={{
                clipPath: "polygon(0 70%, 25% 50%, 50% 60%, 75% 40%, 100% 55%, 100% 100%, 0 100%)",
              }}
            />

            {/* Front hill */}
            <div
              className="absolute bottom-0 w-full h-32 bg-green-600/60"
              style={{
                clipPath: "polygon(0 80%, 30% 60%, 60% 70%, 90% 50%, 100% 65%, 100% 100%, 0 100%)",
              }}
            />
          </div>

          {/* Grass - Simple vertical lines */}
          <div className="absolute bottom-0 left-0 w-full h-20">
            {Array.from({ length: 30 }, (_, i) => (
              <div
                key={i}
                className="absolute bottom-0 bg-green-400/70 animate-pulse"
                style={{
                  left: `${i * 3.33}%`,
                  width: "2px",
                  height: `${12 + (i % 3) * 8}px`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "3s",
                }}
              />
            ))}
          </div>

          {/* Test element - bright red dot to confirm the layer is working */}
          <div
            className="absolute top-1/2 left-1/2 w-4 h-4 bg-red-500 rounded-full animate-ping"
            style={{ transform: "translate(-50%, -50%)" }}
          />
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

        {/* Digital Cross - positioned above landscape but below text */}
        <div className="absolute inset-0 z-10">
          <DigitalCross />
        </div>
      </div>
      <StructuredData data={structuredData} />
    </>
  )
}
