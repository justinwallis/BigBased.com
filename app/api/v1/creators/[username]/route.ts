import { NextResponse } from "next/server"
import { getPublicCreator, isReviewEnvironment } from "@/lib/social-v1/core.mjs"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const headers = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow",
  "X-BigBased-Data": "fictional-review",
}

// Preview-only opt-in public profile read. NEVER points at a live profile table.
export async function GET(
  _request: Request,
  context: { params: Promise<{ username: string }> },
) {
  if (!isReviewEnvironment()) {
    return new Response(null, { status: 404, headers })
  }
  const { username } = await context.params
  const creator = getPublicCreator(username)
  if (!creator) {
    return NextResponse.json(
      { error: "NOT_FOUND", request_id: "fictional-review" },
      { status: 404, headers },
    )
  }
  return NextResponse.json(creator, { status: 200, headers })
}
