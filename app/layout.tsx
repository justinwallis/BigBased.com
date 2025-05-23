import type React from "react"
import "./globals.css"
import type { Metadata, Viewport } from "next/types"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

// Get the base URL for absolute URLs
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com"

export const metadata: Metadata = {
  title: "Big Based",
  description: "Big Based is a cultural revolution platform with a living library of truth, faith, and insight.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon0.svg", type: "image/svg+xml" },
      { url: "/icon1.png", type: "image/png" },
    ],
    apple: {
      url: "/apple-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
  },
  manifest: "/manifest.json",
  themeColor: "#ffffff",
  appleWebApp: {
    title: "Big Based",
    statusBarStyle: "default",
  },
  metadataBase: new URL(baseUrl),
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
    site: "@bigbased",
    images: [`${baseUrl}/BigBasedPreview.png`],
  },
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Explicit OpenGraph tags to ensure they're detected */}
        <meta property="og:title" content="Big Based - Answer to Madness" />
        <meta
          property="og:description"
          content="Big Based isn't just a platform, it's a cultural revolution. At its core lies a living library of truth, faith, and insight, 10,000+ meticulously researched pages designed to educate, inspire, and transform."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={baseUrl} />
        <meta property="og:image" content={`${baseUrl}/BigBasedPreview.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Big Based" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@bigbased" />
        <meta name="twitter:title" content="Big Based - Answer to Madness" />
        <meta
          name="twitter:description"
          content="Big Based isn't just a platform, it's a cultural revolution. At its core lies a living library of truth, faith, and insight, 10,000+ meticulously researched pages designed to educate, inspire, and transform."
        />
        <meta name="twitter:image" content={`${baseUrl}/BigBasedPreview.png`} />

        {/* Explicit favicon links for maximum compatibility */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.png" color="#000000" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />

        {/* Resource preloading */}
        <link rel="preload" href="/bb-logo.png" as="image" />
        <link rel="preload" href="/american-flag.png" as="image" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Basic theme handling */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Check if dark mode is enabled
                function isDarkMode() {
                  // Check for saved theme preference
                  const savedTheme = localStorage.getItem('theme');
                  if (savedTheme === 'dark') return true;
                  if (savedTheme === 'light') return false;
                  
                  // Check for system preference
                  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    return true;
                  }
                  
                  return false;
                }
                
                // Apply dark mode class immediately if needed
                if (isDarkMode()) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.backgroundColor = '#111827';
                  document.body.style.backgroundColor = '#111827';
                  document.documentElement.style.color = '#ffffff';
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.style.backgroundColor = '#ffffff';
                  document.body.style.backgroundColor = '#ffffff';
                  document.documentElement.style.color = '#000000';
                }
                
                // Prevent any flashes during hydration
                document.documentElement.style.visibility = 'visible';
              })();
            `,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
          html { visibility: hidden; }
          .no-js { visibility: visible; }
        `,
          }}
        />
      </head>
      <body className={`${inter.className} no-js`} style={{ margin: 0, padding: 0, minHeight: "100vh" }}>
        <script dangerouslySetInnerHTML={{ __html: `document.body.classList.remove('no-js');` }} />

        {/* Simple announcement bar */}
        <div
          style={{
            backgroundColor: "#1f2937",
            color: "white",
            textAlign: "center",
            padding: "8px 16px",
            fontSize: "14px",
          }}
        >
          🚀 Welcome to Big Based - Your Cultural Revolution Platform
        </div>

        {/* Main content */}
        <main style={{ minHeight: "calc(100vh - 40px)" }}>{children}</main>

        {/* Simple footer */}
        <footer
          style={{
            backgroundColor: "#f3f4f6",
            padding: "20px",
            textAlign: "center",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <p style={{ margin: 0, color: "#6b7280" }}>
            © 2024 Big Based. All rights reserved. |
            <a href="/admin" style={{ color: "#3b82f6", textDecoration: "none", marginLeft: "8px" }}>
              Admin Panel
            </a>
          </p>
        </footer>

        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Big Based",
              url: baseUrl,
              logo: `${baseUrl}/bb-logo.png`,
              description:
                "Big Based is a cultural revolution platform with a living library of truth, faith, and insight.",
              sameAs: ["https://twitter.com/bigbased"],
            }),
          }}
        />
      </body>
    </html>
  )
}
