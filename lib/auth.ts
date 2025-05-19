import { getServerSession } from "next-auth"
import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase/server"

// Helper function to get the current session
export async function getSession() {
  try {
    const session = await getServerSession()
    return session
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

// Helper function to get the current user from Supabase
export async function getCurrentUser() {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
      return null
    }

    return data.user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Helper function to check if the user is authenticated
export async function isAuthenticated() {
  try {
    // Try NextAuth first
    const session = await getSession()
    if (session) return true

    // Fall back to Supabase
    const user = await getCurrentUser()
    return !!user
  } catch (error) {
    console.error("Error checking authentication:", error)
    return false
  }
}
