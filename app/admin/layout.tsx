import type React from "react"
import Link from "next/link"
import { FileEdit } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="h-full px-3 py-4 overflow-y-auto bg-white">
          <ul className="space-y-2">
            <li>
              <Link href="/admin" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <span className="mr-2">
                  {/* Add your dashboard icon here */}
                  Dashboard
                </span>
              </Link>
            </li>
            <li>
              {/* Add this link to your navigation menu */}
              <Link
                href="/cms-admin"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <span className="mr-2">
                  <FileEdit className="h-5 w-5" />
                </span>
                CMS Admin
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <span className="mr-2">
                  {/* Add your settings icon here */}
                  Settings
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">{children}</div>
    </div>
  )
}
