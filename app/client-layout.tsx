"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toast"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { DomainProvider } from "@/contexts/domain-context"
import ClientLayout from "./client-layout"
import { usePathname } from "next/navigation"
// import "./ai/ai-styles.css" // Removed old AI CSS import

const inter = Inter({ subsets: ["latin"] })

export default function ClientRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <DomainProvider>
              {pathname === "/chat" ? children : <ClientLayout>{children}</ClientLayout>}
              <Toaster />
            </DomainProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
