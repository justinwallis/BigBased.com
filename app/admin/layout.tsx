import type React from "react"
import { BarChart, FileText, Settings, ShoppingBag, User, Users } from "lucide-react"
import Link from "next/link"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 py-4 px-3">
        <div className="font-bold text-lg mb-4">Admin Dashboard</div>
        <nav>
          <Link href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100">
            <BarChart className="h-4 w-4" />
            Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100">
            <ShoppingBag className="h-4 w-4" />
            Products
          </Link>
          <Link href="/admin/users" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100">
            <Users className="h-4 w-4" />
            Users
          </Link>
          <Link href="/admin/profile" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100">
            <User className="h-4 w-4" />
            Profile
          </Link>
          <Link href="/admin/cms" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100">
            <FileText className="h-4 w-4" />
            Content Management
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">{children}</div>
    </div>
  )
}
