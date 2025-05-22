import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"

export default async function AdminPage() {
  // Get the Supabase server client
  const supabase = createServerClient()

  // Get the session from Supabase
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If the user is not authenticated, redirect to the login page
  if (!session?.user) {
    redirect("/auth/sign-in?redirect=/admin")
  }

  // Redirect to the Payload admin panel
  redirect("/api/payload/admin")
}
