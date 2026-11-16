import { NextResponse } from "next/server"
import { isReviewEnvironment } from "@/lib/social-v1/core.mjs"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const headers = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow",
  "X-BigBased-Data": "fictional-review",
}

// No verified production session adapter exists. Client identity, headers,
// cookies or query parameters must NEVER be converted to a trusted actor.
// The tenant-scoped in-memory policy is exercised only in offline tests.
export async function GET() {
  if (!isReviewEnvironment()) return new Response(null, { status: 404, headers })
  return NextResponse.json(
    { error: "AUTH_INTEGRATION_DISABLED", request_id: "fictional-review" },
    { status: 503, headers },
  )
}
