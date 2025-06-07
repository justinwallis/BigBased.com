import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { domain } = await request.json()

    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Get domain ID
    const { data: domainData } = await supabase.from("domains").select("id").eq("domain", domain).single()

    if (!domainData?.id) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 })
    }

    // Record visit
    await supabase.from("domain_analytics").insert({
      domain_id: domainData.id,
      visit_type: "pageview",
      metadata: { referrer: request.headers.get("referer") || null },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking domain visit:", error)
    return NextResponse.json({ error: "Failed to track visit" }, { status: 500 })
  }
}
