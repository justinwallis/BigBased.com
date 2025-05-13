"use client"

import type React from "react"
import { PreloaderErrorBoundary } from "./preloader-error-boundary"
import ClientPreloaderWrapper from "./client-preloader-wrapper"

interface ClientPreloaderContainerProps {
  children: React.ReactNode
  quotesToShow?: number
}

export default function ClientPreloaderContainer({ children, quotesToShow }: ClientPreloaderContainerProps) {
  return (
    <PreloaderErrorBoundary>
      <ClientPreloaderWrapper quotesToShow={quotesToShow}>{children}</ClientPreloaderWrapper>
    </PreloaderErrorBoundary>
  )
}
