import { type NextRequest, NextResponse } from "next/server"
import { ragSystem } from "@/lib/ai-rag-system"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
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
