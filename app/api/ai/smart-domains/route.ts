import { type NextRequest, NextResponse } from "next/server"
import { EnhancedAI } from "@/lib/ai-enhanced-features"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile and search history
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    const { data: searches } = await supabase
      .from("domain_searches")
      .select("query")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)

    const searchHistory = searches?.map((s) => s.query) || []

    const recommendations = await EnhancedAI.recommendDomains(profile, searchHistory)

    return NextResponse.json({ success: true, recommendations })
  } catch (error) {
    console.error("Smart domains error:", error)
    return NextResponse.json({ error: "Failed to get domain recommendations" }, { status: 500 })
  }
}
