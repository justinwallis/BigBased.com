import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = createClient()

    // Get query parameters
    const url = new URL(request.url)
    const domain = url.searchParams.get("domain")

    if (domain) {
      // Get specific domain
      const { data, error } = await supabase.from("domains").select("*").eq("domain", domain).single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json(data)
    } else {
      // Get all domains
      const { data, error } = await supabase.from("domains").select("*").order("created_at", { ascending: false })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json(data)
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
