import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthLogo } from "@/components/auth/auth-logo"
import { AuthThemeToggle } from "@/components/auth/auth-theme-toggle"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Authentication - Big Based",
  description: "Sign in or create an account with Big Based",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
        <div className="w-full max-w-md relative">
          <AuthThemeToggle />
          <AuthLogo />
          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-800">
            {children}
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
