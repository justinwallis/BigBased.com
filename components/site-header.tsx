import Link from "next/link"

export default function SiteHeader() {
  return (
    <header className="bg-white shadow dark:bg-gray-800">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-800 dark:text-white">
            My Website
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link
                  href="/"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
