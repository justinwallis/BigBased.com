import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isBot } from "@/utils/bot-detection"

// Simple in-memory rate limiting (in production, use Redis)
const visitCounts = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 10 // Max visits per minute per IP
const RATE_WINDOW = 60 * 1000 // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const key = ip
  const current = visitCounts.get(key)

  if (!current || now > current.resetTime) {
    visitCounts.set(key, { count: 1, resetTime: now + RATE_WINDOW })
    return false
  }

  if (current.count >= RATE_LIMIT) {
    return true
  }

  current.count++
  return false
}

export async function POST(request: Request) {
  try {
    const { domain, userAgent, referrer, ip } = await request.json()

    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 })
    }

    // Additional bot detection
    if (userAgent && isBot(userAgent)) {
      return NextResponse.json({ error: "Bot traffic not tracked" }, { status: 200 })
    }

    // Rate limiting
    if (ip && isRateLimited(ip)) {
      return NextResponse.json({ error: "Rate limited" }, { status: 429 })
    }

    // Skip tracking for development/localhost
    if (domain.includes("localhost") || domain.includes("127.0.0.1")) {
      return NextResponse.json({ success: true, skipped: "localhost" })
    }

    const supabase = createClient()

    // Get domain ID
    const { data: domainData } = await supabase.from("domains").select("id").eq("domain", domain).single()

    if (!domainData?.id) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 })
    }

    // Record visit with additional metadata
    const { error } = await supabase.from("domain_analytics").insert({
      domain_id: domainData.id,
      visit_type: "pageview",
      metadata: {
        referrer: referrer || null,
        user_agent: userAgent || null,
        ip_hash: ip ? btoa(ip).slice(0, 16) : null, // Store hashed IP for privacy
        timestamp: new Date().toISOString(),
      },
    })

    if (error) {
      console.error("Analytics insert error:", error)
      return NextResponse.json({ error: "Failed to record visit" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking domain visit:", error)
    return NextResponse.json({ error: "Failed to track visit" }, { status: 500 })
  }
}
