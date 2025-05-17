"use client"

import type React from "react"
import { PreloaderErrorBoundary } from "./preloader-error-boundary"
import ClientPreloaderWrapper from "./client-preloader-wrapper"
import { usePathname } from "next/navigation"

interface ClientPreloaderContainerProps {
  children: React.ReactNode
  quotesToShow?: number
}

export default function ClientPreloaderContainer({ children, quotesToShow }: ClientPreloaderContainerProps) {
  const pathname = usePathname()
  const isDebugRoute = pathname?.startsWith("/debug")

  // Skip preloader for debug routes
  if (isDebugRoute) {
    return <>{children}</>
  }

  return (
    <PreloaderErrorBoundary>
      <ClientPreloaderWrapper quotesToShow={quotesToShow}>{children}</ClientPreloaderWrapper>
    </PreloaderErrorBoundary>
  )
}
