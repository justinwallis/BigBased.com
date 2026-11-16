import type { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"

interface AuthLayoutProps {
  children: ReactNode
}

// app/layout.tsx already provides the original BB header and ThemeProvider.
// Preserve the auth page centered branding, while inheriting the single
// global theme provider to avoid conflicting theme state.
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="bb-2025-page min-h-[calc(100dvh-3.5rem)] flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-md space-y-5">
        {/* Auth preserves the intentional centered brand from the original
            iPhone recording, in addition to the shared global site header. */}
        <div data-bb-auth-brand className="flex flex-col items-center justify-center">
          <Link href="/" aria-label="BigBased home" className="mb-4">
            <div className="relative h-16 w-16">
              <Image src="/bb-logo.png" alt="Big Based Logo" fill className="object-contain dark:hidden" priority />
              <Image src="/BigBasedIconInvert.png" alt="" aria-hidden="true" fill className="hidden object-contain dark:block" priority />
            </div>
          </Link>
          <h1 className="text-center text-2xl font-bold">BIG BASED</h1>
        </div>

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
