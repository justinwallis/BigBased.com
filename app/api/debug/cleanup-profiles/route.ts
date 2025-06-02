import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    // Check for admin authorization
    const url = new URL(request.url)
    const adminKey = url.searchParams.get("admin_key")

    if (adminKey !== "bigbased_admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createServerSupabaseClient()

    // Get email from query params
    const email = url.searchParams.get("email")

    if (email) {
      // Find profiles with username matching the email prefix
      const username = email.split("@")[0]
      const { data, error } = await supabase.from("profiles").select("*").eq("username", username)

      if (error) {
        return NextResponse.json({ success: false, error: error.message })
      }

      // Delete the profiles if found
      if (data && data.length > 0) {
        const { error: deleteError } = await supabase.from("profiles").delete().eq("username", username)

        if (deleteError) {
          return NextResponse.json({ success: false, error: deleteError.message })
        }

        return NextResponse.json({
          success: true,
          message: `Deleted ${data.length} profiles with username ${username}`,
          deletedProfiles: data,
        })
      }

      return NextResponse.json({ success: true, message: "No profiles found to delete" })
    }

    return NextResponse.json({ success: false, error: "Email parameter required" })
  } catch (error) {
    console.error("Error in cleanup-profiles:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
