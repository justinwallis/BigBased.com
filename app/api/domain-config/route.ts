import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { parseDomain, getDefaultDomainConfig } from "@/lib/domain-utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    let domain = searchParams.get("domain")

    if (!domain) {
      // Try to get domain from headers
      domain = request.headers.get("host") || ""
    }

    domain = parseDomain(domain)

    const supabase = createClient()

    // Get domain configuration
    const { data: domainData, error } = await supabase.from("domains").select("*").eq("domain", domain).single()

    if (error || !domainData) {
      // Return default configuration
      return NextResponse.json(getDefaultDomainConfig(domain))
    }

    return NextResponse.json(domainData)
  } catch (error) {
    console.error("Error fetching domain config:", error)
    return NextResponse.json(getDefaultDomainConfig(parseDomain(request.headers.get("host") || "")))
  }
}

export async function PUT(request: Request) {
  try {
    const { domain, updates } = await request.json()

    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Update domain configuration
    const { data, error } = await supabase.from("domains").update(updates).eq("domain", domain).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error updating domain config:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
