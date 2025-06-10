import { type NextRequest, NextResponse } from "next/server"
import { ragSystem } from "@/lib/ai-rag-system"
import { createClient } from "@/lib/supabase/server"
import type { CoreMessage } from "ai" // Import CoreMessage type

export async function POST(request: NextRequest) {
  try {
    // The useChat hook sends 'messages' (array of {role, content}) and 'input' (current user message)
    const { messages, input } = await request.json()

    if (!input) {
      return NextResponse.json({ error: "Input message is required" }, { status: 400 })
    }

    // Extract the latest user message
    const latestUserMessage = input

    // Format previous messages for ragSystem if needed, or pass directly
    // Assuming ragSystem.streamResponse expects an array of { role, content } for history
    const conversationHistory: CoreMessage[] = messages.filter(
      (msg: CoreMessage) => msg.role !== "user" || msg.content !== input,
    )

    // Get user context from session
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Generate streaming response
    const stream = await ragSystem.streamResponse(latestUserMessage, {
      domain: "bigbased.com", // Pass your domain
      user_id: user?.id,
      conversation_history: conversationHistory,
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
