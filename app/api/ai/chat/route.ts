import { type NextRequest, NextResponse } from "next/server"
import { ragSystem } from "@/lib/ai-rag-system"
import { createClient } from "@/lib/supabase/server"
import type { CoreMessage } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { messages, input } = await request.json()

    console.log("--- API Request Received ---")
    console.log("Raw messages from useChat:", messages)
    console.log("Raw input from useChat:", input)

    if (!input) {
      console.error("Error: Input message is missing.")
      return NextResponse.json({ error: "Input message is required" }, { status: 400 })
    }

    // The 'messages' array from useChat already contains the full history, including the current user's message.
    // The 'input' variable is just the current value of the input field.
    // We need to extract the actual conversation history (excluding the current user's message)
    // and the current user's message to pass to ragSystem.
    const latestUserMessage = input // This is the current message being sent
    const conversationHistory: CoreMessage[] = messages.slice(0, -1) // All messages except the very last one (which is the current user input)

    console.log("Processed latestUserMessage for RAG:", latestUserMessage)
    console.log("Processed conversationHistory for RAG:", conversationHistory)

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

    console.log("--- API Response Sent ---")
    return new Response(stream.toAIStream(), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    // Log the full error object for more details
    if (error instanceof Error) {
      console.error("Error name:", error.name)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
