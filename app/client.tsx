"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toast"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { SiteHeader } from "@/components/site-header"
import { SignupPopup } from "@/components/signup-popup"
import { useAuth } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

// Client component to conditionally render SignupPopup
function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  return (
    <>
      {children}
      {!user && <SignupPopup />}
    </>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <SiteHeader />
            <main>{children}</main>
            <Toaster />
            <SignupPopup />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
