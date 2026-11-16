import { NextResponse } from "next/server"
import { isReviewEnvironment } from "@/lib/social-v1/core.mjs"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const headers = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow",
  "X-BigBased-Data": "fictional-review",
}

// All server writes remain disabled until identity + RLS + idempotent
// persistence are separately approved and verified. This endpoint does
// not read a payload, authenticate a test user, or create a draft.
export async function POST() {
  if (!isReviewEnvironment()) return new Response(null, { status: 404, headers })
  return NextResponse.json(
    { error: "PERSISTENCE_DISABLED", request_id: "fictional-review" },
    { status: 503, headers },
  )
}
