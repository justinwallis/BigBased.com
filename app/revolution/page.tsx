import type { Metadata, Viewport } from "next/types"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Revolution - Big Based",
  description:
    "The convergence of Political, Religious, and Technological transformation shaping our future. A bold initiative to reclaim control, decentralize power, and align technology with faith and freedom.",
  keywords: [
    "revolution",
    "political transformation",
    "religious transformation",
    "technological transformation",
    "big based",
  ],
  authors: [{ name: "Big Based Team" }],
  creator: "Big Based",
  publisher: "Big Based",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/revolution",
  },
  openGraph: {
    title: "Revolution - Big Based",
    description:
      "The convergence of Political, Religious, and Technological transformation shaping our future. A bold initiative to reclaim control, decentralize power, and align technology with faith and freedom.",
    url: "/revolution",
    siteName: "Big Based",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Revolution - Big Based",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Revolution - Big Based",
    description:
      "The convergence of Political, Religious, and Technological transformation shaping our future. A bold initiative to reclaim control, decentralize power, and align technology with faith and freedom.",
    images: ["/og-image.png"],
    creator: "@bigbased",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
}

export default function RevolutionPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "The Revolution - Convergence of Political, Religious, and Technological Transformation",
            description:
              "Big Based represents the convergence of Political, Religious, and Technological transformation shaping our future. It's a bold initiative to reclaim control, decentralize power, and align technology with faith and freedom.",
            author: {
              "@type": "Organization",
              name: "Big Based Team",
            },
            publisher: {
              "@type": "Organization",
              name: "Big Based",
            },
            datePublished: "2023-01-01",
            dateModified: new Date().toISOString(),
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": "/revolution",
            },
            image: "/og-image.png",
          }),
        }}
      />

      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "64px 16px",
          backgroundColor: "#000000",
          backgroundImage: `
            linear-gradient(rgba(30, 30, 30, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30, 30, 30, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          position: "relative",
        }}
      >
        {/* Background image with 10% opacity */}
        <div
          style={{
            position: "absolute",
            inset: "0",
            width: "100%",
            height: "100%",
            zIndex: 0,
            backgroundImage: `url('/BckgTech.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.1,
          }}
        />

        <div style={{ maxWidth: "1024px", margin: "0 auto", textAlign: "center", zIndex: 10, position: "relative" }}>
          <p style={{ fontSize: "1.125rem", marginBottom: "1rem" }}>The Revolution</p>

          <h1
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: "bold",
              marginBottom: "3rem",
              lineHeight: "1.1",
            }}
          >
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

          <div
            style={{
              border: "1px solid rgba(255, 255, 255, 0.3)",
              padding: "1.5rem",
              maxWidth: "768px",
              margin: "0 auto 3rem auto",
              fontSize: "clamp(0.875rem, 2vw, 1rem)",
              lineHeight: "1.6",
            }}
          >
            <p>
              Big Based represents the convergence of Political, Religious, and Technological transformation shaping our
              future. It's a bold initiative to reclaim control, decentralize power, and align technology with faith and
              freedom as the world reaches a tipping point. Big Based offers the tools and vision to lead this cultural
              and digital renaissance.
            </p>
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/"
              style={{
                display: "inline-block",
                padding: "12px 24px",
                backgroundColor: "#fff",
                color: "#000",
                textDecoration: "none",
                borderRadius: "6px",
                fontWeight: "600",
                transition: "all 0.2s",
              }}
            >
              Back to Home
            </Link>
            <Link
              href="/admin"
              style={{
                display: "inline-block",
                padding: "12px 24px",
                border: "2px solid #fff",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "6px",
                fontWeight: "600",
                transition: "all 0.2s",
              }}
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
