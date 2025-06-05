"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import SiteHeader from "@/components/site-header"
import { Footer } from "@/components/footer"
import { GlobalAuthModal } from "@/components/auth/global-auth-modal"
import { OneSignalProvider } from "@/components/one-signal-provider"
import { MatrixNavigationProvider } from "@/components/matrix-navigation-provider"
import { PageTransition } from "@/components/page-transition"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Don't show header/footer on auth pages
  const isAuthPage = pathname?.startsWith("/auth/")
  const isDebugPage = pathname?.startsWith("/debug/")

  return (
    <OneSignalProvider>
      <MatrixNavigationProvider>
        <div className="relative flex min-h-screen flex-col bg-background">
          {!isAuthPage && !isDebugPage && <SiteHeader />}
          <PageTransition>
            <main className="flex-1">{children}</main>
          </PageTransition>
          {!isAuthPage && !isDebugPage && <Footer />}
          <GlobalAuthModal />
        </div>
      </MatrixNavigationProvider>
    </OneSignalProvider>
  )
}
