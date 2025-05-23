import type React from "react"
import "./globals.css"
import type { Metadata, Viewport } from "next/types"
import { Inter } from "next/font/google"
import ClientPreloaderContainer from "@/components/client-preloader-container"
import { ErrorBoundary } from "@/components/error-boundary"
import { ThemeProvider } from "@/components/theme-provider"
import OneSignalProvider from "@/components/one-signal-provider"
import AuthWrapper from "@/components/auth/auth-wrapper"
import SectionPersistenceWrapper from "@/components/section-persistence-wrapper"
import { viewportConfig } from "./metadata-config"
import { getOrganizationData, getWebsiteData } from "@/lib/structured-data"
import StructuredData from "@/components/structured-data"
import { CookieConsent } from "@/components/cookie-consent"
import { NextAuthProvider } from "@/contexts/next-auth-provider"
import { AuthProvider } from "@/contexts/auth-context"
import AnnouncementBar from "@/components/announcement-bar"
import { MatrixNavigationProvider } from "@/components/matrix-navigation-provider"
import { PageFadeWrapper } from "@/components/page-fade-wrapper"

const inter = Inter({ subsets: ["latin"] })

// Get the base URL for absolute URLs
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com"

export const metadata: Metadata = {
  title: "Big Based",
  description: "Big Based Website",
    generator: 'v0.dev'
}

export const viewport: Viewport = viewportConfig

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Prepare structured data for the entire site
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [getOrganizationData(), getWebsiteData()],
  }

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
        <link rel="preconnect" href="https://cdn.onesignal.com" />

        {/* Prevent flash of white in dark mode */}
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
                  document.documentElement.style.backgroundColor = '#111827'; // dark:bg-gray-900
                  document.body.style.backgroundColor = '#111827'; // dark:bg-gray-900
                  document.body.classList.add('dark-mode');
                  document.body.classList.remove('light-mode');
                  document.documentElement.style.color = '#ffffff';
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.style.backgroundColor = '#ffffff';
                  document.body.style.backgroundColor = '#ffffff';
                  document.body.classList.add('light-mode');
                  document.body.classList.remove('dark-mode');
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
      <body className={`${inter.className} no-js`}>
        <script dangerouslySetInnerHTML={{ __html: `document.body.classList.remove('no-js');` }} />
        <AnnouncementBar />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ErrorBoundary>
            <OneSignalProvider>
              <ClientPreloaderContainer quotesToShow={5}>
                <NextAuthProvider>
                  <AuthProvider>
                    <AuthWrapper>
                      <MatrixNavigationProvider>
                        <PageFadeWrapper>
                          <SectionPersistenceWrapper />
                          {children}
                        </PageFadeWrapper>
                      </MatrixNavigationProvider>
                    </AuthWrapper>
                  </AuthProvider>
                </NextAuthProvider>
              </ClientPreloaderContainer>
            </OneSignalProvider>
          </ErrorBoundary>
        </ThemeProvider>
        <StructuredData data={structuredData} />
        <CookieConsent />
      </body>
    </html>
  )
}
