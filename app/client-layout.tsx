"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Preloader } from "@/components/preloader"
import { PageFadeWrapper } from "@/components/page-fade-wrapper"
import { GlobalNavigationInterceptor } from "@/components/global-navigation-interceptor"
import { MatrixTransitionManager } from "@/components/matrix-transition-manager"
import { MatrixNavigationProvider } from "@/components/matrix-navigation-provider"
import { PageTransition } from "@/components/page-transition"
import { ClientPreloaderWrapper } from "@/components/client-preloader-wrapper"
import { SideMenu } from "@/components/side-menu"
import { CookieConsent } from "@/components/cookie-consent"
import { OneSignalProvider } from "@/components/one-signal-provider"
import { StripeProvider } from "@/components/stripe-provider"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isLoaded, setIsLoaded] = useState(false)
  const [showPreloader, setShowPreloader] = useState(true)

  useEffect(() => {
    // Simulate loading time for preloader
    const timer = setTimeout(() => {
      setIsLoaded(true)
      // Hide preloader after fade out animation
      setTimeout(() => {
        setShowPreloader(false)
      }, 500)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <MatrixNavigationProvider>
      <MatrixTransitionManager>
        <GlobalNavigationInterceptor>
          <PageTransition>
            <ClientPreloaderWrapper>
              {showPreloader && <Preloader isLoaded={isLoaded} />}
              <PageFadeWrapper pathname={pathname}>
                <SiteHeader />
                <main className="min-h-screen">{children}</main>
                <Footer />
                <CookieConsent />
              </PageFadeWrapper>
              <SideMenu />
              <OneSignalProvider />
              <StripeProvider />
            </ClientPreloaderWrapper>
          </PageTransition>
        </GlobalNavigationInterceptor>
      </MatrixTransitionManager>
    </MatrixNavigationProvider>
  )
}
