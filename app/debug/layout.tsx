import { Inter } from 'next/font/google'
import Link from "next/link"
import "../globals.css"
import RemovePreloader from "./remove-preloader"

// Use the Inter font
const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Big Based - Debug Tools",
  description: "Debugging tools for Big Based website",
}

export default function DebugLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Component to ensure no preloader is active */}
        <RemovePreloader />
        
        <div className="min-h-screen bg-gray-50">
          <header className="bg-black text-white p-4 shadow-md">
            <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
              <div className="flex items-center mb-4 sm:mb-0">
                <span className="text-2xl font-bold mr-2">BB</span>
                <h1 className="text-xl">Debug Tools</h1>
              </div>
              <nav className="flex flex-wrap gap-4">
                <Link href="/debug" className="text-white hover:text-gray-300">
                  Debug Home
                </Link>
                <Link href="/debug/favicon" className="text-white hover:text-gray-300">
                  Favicon
                </Link>
                <Link href="/debug/preloader" className="text-white hover:text-gray-300">
                  Preloader
                </Link>
                <Link href="/" className="text-white hover:text-gray-300 bg-red-600 px-3 py-1 rounded">
                  Exit Debug
                </Link>
              </nav>
            </div>
          </header>

          <main className="container mx-auto p-4 md:p-6">{children}</main>

          <footer className="bg-gray-200 p-4 text-center text-sm text-gray-600">
            <p>Big Based Debug Tools - For Development Use Only</p>
          </footer>
        </div>
      </body>
    </html>
  )
}
