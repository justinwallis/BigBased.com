"use client"

import type React from "react"
import { ErrorBoundary } from "@/components/error-boundary"

interface PreloaderErrorBoundaryProps {
  children: React.ReactNode
}

export function PreloaderErrorBoundary({ children }: PreloaderErrorBoundaryProps) {
  return <ErrorBoundary fallback={<div>Failed to load preloader.</div>}>{children}</ErrorBoundary>
}
