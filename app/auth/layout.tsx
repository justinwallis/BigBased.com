import type { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="w-full max-w-md space-y-6 mt-4">
          <div className="flex flex-col items-center justify-center">
            <Link href="/" className="mb-4">
              <div className="relative w-16 h-16">
                <Image src="/bb-logo.png" alt="Big Based Logo" fill className="object-contain dark:hidden" priority />
                <Image
                  src="/BigBasedIconInvert.png"
                  alt="Big Based Logo"
                  fill
                  className="object-contain hidden dark:block"
                  priority
                />
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">BIG BASED</h1>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 border border-gray-200 dark:border-gray-700">
            {children}
          </div>

          <div className="flex items-center justify-between mt-4">
            <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:underline">
              Return to Home
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
