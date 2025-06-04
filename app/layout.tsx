import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toast"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import ClientLayout from "./client-layout"
import { CombinedHeaderProvider } from "@/contexts/combined-header-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Big Based",
  description: "Connect with friends and join our community",
  generator: "v0.dev",
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
          <CombinedHeaderProvider>
            <AuthProvider>
              <ClientLayout>{children}</ClientLayout>
              <Toaster />
            </AuthProvider>
          </CombinedHeaderProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
