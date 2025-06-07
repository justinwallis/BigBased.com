import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  try {
    // Use getUser() instead of getSession() for better security
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.log("❌ No authenticated user found, redirecting to sign-in")
      redirect("/auth/sign-in?redirect=/admin")
    }

    // Get the user's profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, username, role")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      console.log("❌ Profile not found:", profileError)
      redirect("/auth/sign-in?redirect=/admin")
    }

    // Check if user has admin role
    if (profile.role !== "admin" && user.email !== process.env.ADMIN_EMAIL) {
      console.log("❌ User is not admin:", profile.role)
      redirect("/?error=unauthorized")
    }

    console.log("✅ Admin access granted for:", profile.username)

    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">Welcome, {profile.username}</span>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Back to Site
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
    )
  } catch (error) {
    console.error("❌ Admin layout error:", error)
    redirect("/auth/sign-in?redirect=/admin")
  }
}
