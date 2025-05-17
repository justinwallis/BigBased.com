import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"
import { ArrowLeft, Home } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Debug Tools | Big Based",
  description: "Debugging tools for Big Based website",
}

export default function DebugLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
              <Home size={16} className="mr-1" />
              Home
            </Link>
            <Link href="/debug" className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
              Debug Home
            </Link>
          </div>
          <Link href="/" className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
            <ArrowLeft size={16} className="mr-1" />
            Back to Site
          </Link>
        </div>
      </header>
      <main className="container mx-auto py-6 px-4">{children}</main>
      <footer className="border-t border-gray-200 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          Debug Tools - For Development Use Only
        </div>
      </footer>
    </div>
  )
}
