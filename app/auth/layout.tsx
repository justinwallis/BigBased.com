import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import BBLogo from "@/components/bb-logo"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "Authentication - Big Based",
  description: "Sign in or create an account with Big Based",
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mt-4 mb-8">
            <Link href="/" className="mb-2">
              <BBLogo size="lg" className="mx-auto" />
            </Link>
            <h1 className="text-xl font-bold text-center text-gray-900 dark:text-white">BIG BASED</h1>
          </div>

          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            {children}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
