import type React from "react"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Database, FileText, Home, ImageIcon, LayoutDashboard, LogOut, Tag } from "lucide-react"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/sign-in?redirect=/admin")
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-md hidden md:block">
        <div className="p-6">
          <Link href="/admin" className="text-xl font-bold text-gray-900 dark:text-white">
            Big Based CMS
          </Link>
        </div>
        <nav className="mt-6">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Content
          </div>
          <Link
            href="/admin"
            className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Dashboard
          </Link>
          <Link
            href="/admin/pages"
            className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FileText className="h-5 w-5 mr-3" />
            Pages
          </Link>
          <Link
            href="/admin/posts"
            className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FileText className="h-5 w-5 mr-3" />
            Blog Posts
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Tag className="h-5 w-5 mr-3" />
            Categories
          </Link>
          <Link
            href="/admin/media"
            className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ImageIcon className="h-5 w-5 mr-3" />
            Media
          </Link>

          <div className="px-4 py-2 mt-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            System
          </div>
          <Link
            href="/admin/init-db"
            className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Database className="h-5 w-5 mr-3" />
            Database
          </Link>
          <Link
            href="/"
            className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Home className="h-5 w-5 mr-3" />
            View Site
          </Link>
          <form action="/auth/signout" method="post" className="mt-6 px-6">
            <Button variant="outline" className="w-full justify-start" type="submit">
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </form>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main>{children}</main>
      </div>
    </div>
  )
}
