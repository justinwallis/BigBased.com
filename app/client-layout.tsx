"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import Footer from "@/components/footer"
import Preloader from "@/components/preloader"
import { MatrixTransitionManager } from "@/components/matrix-transition-manager"
import { PageTransitionProvider } from "@/contexts/page-transition-context"
import { NavigationProvider } from "@/contexts/navigation-context"
import { GlobalAuthModal } from "@/components/auth/global-auth-modal"
import { OneSignalProvider } from "@/components/one-signal-provider"
import { NotificationPopup } from "@/components/notification-popup"
import { CookieConsent } from "@/components/cookie-consent"
import { GlobalNavigationInterceptor } from "@/components/global-navigation-interceptor"
import { PageFadeWrapper } from "@/components/page-fade-wrapper"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <Preloader />
  }

  return (
    <NavigationProvider>
      <PageTransitionProvider>
        <OneSignalProvider>
          <GlobalNavigationInterceptor />
          <MatrixTransitionManager />

          {/* Add SiteHeader to every page */}
          <SiteHeader />

          <PageFadeWrapper>
            <main className="min-h-screen">{children}</main>
            <Footer />
          </PageFadeWrapper>

          <GlobalAuthModal />
          <NotificationPopup />
          <CookieConsent />
        </OneSignalProvider>
      </PageTransitionProvider>
    </NavigationProvider>
  )
}
