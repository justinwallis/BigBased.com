import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { CMSErrorTracker } from "@/lib/sentry"

// Rate limiting (simple in-memory store - use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(apiKey: string, limit = 100, windowMs = 60000): boolean {
  const now = Date.now()
  const key = `rate_limit_${apiKey}`
  const current = rateLimitStore.get(key)

  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (current.count >= limit) {
    return false
  }

  current.count++
  return true
}

async function validateApiKey(apiKey: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("cms_api_keys")
    .select("*")
    .eq("key_hash", apiKey)
    .eq("is_active", true)
    .single()

  if (error || !data) {
    return null
  }

  // Check expiration
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return null
  }

  return data
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    const { searchParams } = new URL(request.url)
    const apiKey = request.headers.get("x-api-key")

    if (!apiKey) {
      return NextResponse.json({ error: "API key required" }, { status: 401 })
    }

    // Validate API key
    const keyData = await validateApiKey(apiKey)
    if (!keyData) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    // Check rate limit
    if (!checkRateLimit(apiKey)) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
    }

    const supabase = createClient()

    // Parse query parameters
    const contentType = searchParams.get("type")
    const status = searchParams.get("status") || "published"
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "50"), 100)
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const search = searchParams.get("search")
    const fields = searchParams.get("fields")?.split(",")

    // Build query
    let query = supabase
      .from("content_items")
      .select(
        fields
          ? fields.join(",")
          : `
        id,
        title,
        slug,
        content,
        status,
        published_at,
        seo_title,
        seo_description,
        seo_keywords,
        featured_image_url,
        created_at,
        updated_at,
        content_types(name, slug)
      `,
      )
      .eq("status", status)
      .order("updated_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (contentType) {
      query = query.eq("content_types.slug", contentType)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,content->>'body'.ilike.%${search}%`)
    }

    const { data, error, count } = await query

    if (error) {
      CMSErrorTracker.trackAPIUsage("/api/cms/v1/content", "GET", 500, Date.now() - startTime)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Update API key usage
    await supabase
      .from("cms_api_keys")
      .update({
        last_used_at: new Date().toISOString(),
        usage_count: keyData.usage_count + 1,
      })
      .eq("id", keyData.id)

    const duration = Date.now() - startTime
    CMSErrorTracker.trackAPIUsage("/api/cms/v1/content", "GET", 200, duration)

    return NextResponse.json({
      data,
      meta: {
        total: count,
        limit,
        offset,
        has_more: count ? offset + limit < count : false,
      },
    })
  } catch (error: any) {
    const duration = Date.now() - startTime
    CMSErrorTracker.trackAPIUsage("/api/cms/v1/content", "GET", 500, duration)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const apiKey = request.headers.get("x-api-key")

    if (!apiKey) {
      return NextResponse.json({ error: "API key required" }, { status: 401 })
    }

    const keyData = await validateApiKey(apiKey)
    if (!keyData) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    // Check permissions
    if (!keyData.permissions.content?.includes("create")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    if (!checkRateLimit(apiKey, 50)) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
    }

    const body = await request.json()
    const { content_type_id, title, slug, content, status = "draft", seo_title, seo_description, seo_keywords } = body

    if (!content_type_id || !title) {
      return NextResponse.json({ error: "content_type_id and title are required" }, { status: 400 })
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from("content_items")
      .insert({
        content_type_id,
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        content,
        status,
        seo_title,
        seo_description,
        seo_keywords: Array.isArray(seo_keywords) ? seo_keywords : [],
        published_at: status === "published" ? new Date().toISOString() : null,
        created_by: keyData.created_by,
        updated_by: keyData.created_by,
      })
      .select()
      .single()

    if (error) {
      CMSErrorTracker.trackAPIUsage("/api/cms/v1/content", "POST", 400, Date.now() - startTime)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Update API key usage
    await supabase
      .from("cms_api_keys")
      .update({
        last_used_at: new Date().toISOString(),
        usage_count: keyData.usage_count + 1,
      })
      .eq("id", keyData.id)

    const duration = Date.now() - startTime
    CMSErrorTracker.trackAPIUsage("/api/cms/v1/content", "POST", 201, duration)

    return NextResponse.json({ data }, { status: 201 })
  } catch (error: any) {
    const duration = Date.now() - startTime
    CMSErrorTracker.trackAPIUsage("/api/cms/v1/content", "POST", 500, duration)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
