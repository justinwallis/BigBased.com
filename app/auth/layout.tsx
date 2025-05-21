import type React from "react"
import Image from "next/image"
import Link from "next/link"
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="mb-8">
            <Image
              src="/bb-logo.png"
              alt="Big Based Logo"
              width={80}
              height={80}
              priority
              className="transition-transform hover:scale-105"
            />
          </Link>
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">BIG BASED</h1>
        </div>
        <div className="w-full bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-800">
          {children}
        </div>
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
