import type React from "react"
import Link from "next/link"

export default function DebugLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold">Big Based Debug Tools</h1>
        <nav className="mt-2">
          <ul className="flex flex-wrap gap-4 text-sm">
            <li>
              <Link href="/debug" className="text-blue-600 hover:underline">
                Master Debug
              </Link>
            </li>
            <li>
              <Link href="/debug/favicon" className="text-blue-600 hover:underline">
                Favicon Debug
              </Link>
            </li>
            <li>
              <Link href="/" className="text-red-600 hover:underline">
                Back to Site
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  )
}
