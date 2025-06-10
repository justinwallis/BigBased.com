import { BigBasedRAGSystem } from "@/lib/ai-rag-system"
import { getSession } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()
    const { session } = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const ragSystem = new BigBasedRAGSystem()
    const stream = await ragSystem.streamResponse(message, {
      user_id: session.user.id,
      // Add other context like domain, tenant_id if available from session or request
    })

    return new Response(stream.toReadableStream())
  } catch (error) {
    console.error("Error in /api/chat/chat:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
