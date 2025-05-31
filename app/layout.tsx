import type React from "react"
import type { Metadata } from "next"
import { baseMetadata, viewportConfig } from "./metadata-config"
import ClientRootLayout from "./client-layout"

export const metadata: Metadata = baseMetadata

export const viewport = viewportConfig

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientRootLayout>{children}</ClientRootLayout>
}


import './globals.css'