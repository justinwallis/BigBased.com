import type { Metadata, Viewport } from "next/types"
import Link from "next/link"

// Get the base URL for absolute URLs
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com"

export const metadata: Metadata = {
  title: "Big Based - Answer to Madness",
  description:
    "Big Based isn't just a platform, it's a cultural revolution. At its core lies a living library of truth, faith, and insight, 10,000+ meticulously researched pages designed to educate, inspire, and transform.",
  keywords: ["big based", "cultural revolution", "truth", "faith", "education", "transformation"],
  authors: [{ name: "Big Based Team" }],
  creator: "Big Based",
  publisher: "Big Based",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Big Based - Answer to Madness",
    description:
      "Big Based isn't just a platform, it's a cultural revolution. At its core lies a living library of truth, faith, and insight, 10,000+ meticulously researched pages designed to educate, inspire, and transform.",
    url: baseUrl,
    siteName: "Big Based",
    images: [
      {
        url: `${baseUrl}/BigBasedPreview.png`,
        width: 1200,
        height: 630,
        alt: "Big Based - Answer to Madness",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Big Based - Answer to Madness",
    description:
      "Big Based isn't just a platform, it's a cultural revolution. At its core lies a living library of truth, faith, and insight, 10,000+ meticulously researched pages designed to educate, inspire, and transform.",
    images: [`${baseUrl}/BigBasedPreview.png`],
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

export default function Home() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Big Based",
            description:
              "Big Based isn't just a platform, it's a cultural revolution. At its core lies a living library of truth, faith, and insight, 10,000+ meticulously researched pages designed to educate, inspire, and transform.",
            url: baseUrl,
            potentialAction: {
              "@type": "SearchAction",
              target: `${baseUrl}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />

      {/* Hero Section */}
      <main style={{ minHeight: "100vh", backgroundColor: "#000", color: "#fff" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "80px 20px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: "bold",
              marginBottom: "2rem",
              lineHeight: "1.2",
            }}
          >
            Big Based
            <br />
            <span style={{ color: "#888" }}>Answer to Madness</span>
          </h1>

          <p
            style={{
              fontSize: "1.25rem",
              marginBottom: "3rem",
              maxWidth: "800px",
              margin: "0 auto 3rem auto",
              lineHeight: "1.6",
              color: "#ccc",
            }}
          >
            Big Based isn't just a platform, it's a cultural revolution. At its core lies a living library of truth,
            faith, and insight, 10,000+ meticulously researched pages designed to educate, inspire, and transform.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/revolution"
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
              The Revolution
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

        {/* Features Section */}
        <div
          style={{
            backgroundColor: "#111",
            padding: "80px 20px",
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "3rem",
              }}
            >
              Platform Features
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "2rem",
              }}
            >
              <div
                style={{
                  padding: "2rem",
                  backgroundColor: "#222",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#fff" }}>Digital Library</h3>
                <p style={{ color: "#ccc", lineHeight: "1.6" }}>
                  Access thousands of meticulously researched pages covering truth, faith, and cultural insights.
                </p>
              </div>

              <div
                style={{
                  padding: "2rem",
                  backgroundColor: "#222",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#fff" }}>Content Management</h3>
                <p style={{ color: "#ccc", lineHeight: "1.6" }}>
                  Powerful CMS for creating and managing blog posts, pages, and media content.
                </p>
              </div>

              <div
                style={{
                  padding: "2rem",
                  backgroundColor: "#222",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#fff" }}>Community Platform</h3>
                <p style={{ color: "#ccc", lineHeight: "1.6" }}>
                  Connect with like-minded individuals in the cultural and digital renaissance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div
          style={{
            backgroundColor: "#000",
            padding: "80px 20px",
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                marginBottom: "3rem",
              }}
            >
              Explore the Platform
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1.5rem",
              }}
            >
              <Link
                href="/blog"
                style={{
                  display: "block",
                  padding: "2rem",
                  backgroundColor: "#111",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "8px",
                  transition: "all 0.2s",
                  border: "1px solid #333",
                }}
              >
                <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Blog</h3>
                <p style={{ color: "#ccc", fontSize: "0.9rem" }}>Read our latest insights and articles</p>
              </Link>

              <Link
                href="/faq"
                style={{
                  display: "block",
                  padding: "2rem",
                  backgroundColor: "#111",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "8px",
                  transition: "all 0.2s",
                  border: "1px solid #333",
                }}
              >
                <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>FAQ</h3>
                <p style={{ color: "#ccc", fontSize: "0.9rem" }}>Find answers to common questions</p>
              </Link>

              <Link
                href="/about"
                style={{
                  display: "block",
                  padding: "2rem",
                  backgroundColor: "#111",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "8px",
                  transition: "all 0.2s",
                  border: "1px solid #333",
                }}
              >
                <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>About</h3>
                <p style={{ color: "#ccc", fontSize: "0.9rem" }}>Learn more about our mission</p>
              </Link>

              <Link
                href="/contact"
                style={{
                  display: "block",
                  padding: "2rem",
                  backgroundColor: "#111",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "8px",
                  transition: "all 0.2s",
                  border: "1px solid #333",
                }}
              >
                <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Contact</h3>
                <p style={{ color: "#ccc", fontSize: "0.9rem" }}>Get in touch with our team</p>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
