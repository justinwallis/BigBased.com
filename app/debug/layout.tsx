import type React from "react"
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
          <ul className="flex space-x-4 text-sm">
            <li>
              <a href="/debug" className="text-blue-600 hover:underline">
                Master Debug
              </a>
            </li>
            <li>
              <a href="/debug/favicon" className="text-blue-600 hover:underline">
                Favicon Debug
              </a>
            </li>
            <li>
              <a href="/debug/images" className="text-blue-600 hover:underline">
                Image Debug
              </a>
            </li>
            <li>
              <a href="/debug/performance" className="text-blue-600 hover:underline">
                Performance
              </a>
            </li>
            <li>
              <a href="/" className="text-red-600 hover:underline">
                Back to Site
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  )
}
