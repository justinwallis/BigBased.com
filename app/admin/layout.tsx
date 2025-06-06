import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  try {
    // Get the current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      console.log("❌ No session found, redirecting to sign-in")
      redirect("/auth/sign-in?redirect=/admin")
    }

    // Get the user's profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, username, role")
      .eq("id", session.user.id)
      .single()

    if (profileError || !profile) {
      console.log("❌ Profile not found:", profileError)
      redirect("/auth/sign-in?redirect=/admin")
    }

    // Check if user has admin role
    if (profile.role !== "admin") {
      console.log("❌ User is not admin:", profile.role)
      redirect("/?error=unauthorized")
    }

    console.log("✅ Admin access granted for:", profile.username)

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Welcome, {profile.username}</span>
                <a href="/" className="text-sm text-blue-600 hover:text-blue-500">
                  Back to Site
                </a>
              </div>
            </div>
          </div>
        </div>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    )
  } catch (error) {
    console.error("❌ Admin layout error:", error)
    redirect("/auth/sign-in?redirect=/admin")
  }
}
