"use client"

import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const useMatrixNavigation = () => {
  const router = useRouter()
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      const currentPath = router.pathname
      const targetPath = url.split("?")[0]

      const isAuthPage = (path: string) => path.startsWith("/auth/")
      const isSwitchingAuthPages =
        (currentPath === "/auth/sign-in" && targetPath === "/auth/sign-up") ||
        (currentPath === "/auth/sign-up" && targetPath === "/auth/sign-in") ||
        (currentPath === "/auth/login" && targetPath === "/auth/register") ||
        (currentPath === "/auth/register" && targetPath === "/auth/login")

      if (isSwitchingAuthPages) {
        return // Skip transition when switching between sign-in and sign-up
      }

      setTransitioning(true)
    }

    const handleRouteChangeComplete = () => {
      setTransitioning(false)
    }

    const handleRouteChangeError = () => {
      setTransitioning(false)
    }

    router.events.on("routeChangeStart", handleRouteChangeStart)
    router.events.on("routeChangeComplete", handleRouteChangeComplete)
    router.events.on("routeChangeError", handleRouteChangeError)

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart)
      router.events.off("routeChangeComplete", handleRouteChangeComplete)
      router.events.off("routeChangeError", handleRouteChangeError)
    }
  }, [router])

  return transitioning
}

export default useMatrixNavigation
