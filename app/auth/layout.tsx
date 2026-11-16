import type { ReactNode } from "react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

interface AuthLayoutProps {
  children: ReactNode
}

// app/layout.tsx already provides the original BB header and ThemeProvider.
// Keep auth screens in the same design system without a second brand header
// or independent theme provider that could disagree with the global setting.
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="bb-2025-page min-h-[calc(100dvh-3.5rem)] flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-md space-y-5">
        <div className="bb-2025-panel p-5 shadow-md sm:p-8">
          {children}
        </div>
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm bb-2025-dim hover:underline">
            Return to Home
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
