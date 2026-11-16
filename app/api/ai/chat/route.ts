import { type NextRequest, NextResponse } from "next/server"
import { ragSystem } from "@/lib/ai-rag-system"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  // The old streaming adapter is not compatible with the isolated visual
  // restoration. Fail closed until an explicitly approved integration
  // replaces this route; never spend model tokens during visual review.
  if (process.env.BIGBASED_ENABLE_LEGACY_AI !== "reviewed-and-approved") {
    return NextResponse.json(
      { error: "The historical BigBased chat AI endpoint is not enabled." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    )
  }

  try {
    const { message, domain, conversation_history } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Get user context from session
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Generate streaming response
    const stream = await ragSystem.streamResponse(message, {
      domain,
      user_id: user?.id,
      conversation_history,
    })

    // Return streaming response
    return new Response(stream.toAIStream(), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
