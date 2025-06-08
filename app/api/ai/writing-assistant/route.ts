import { type NextRequest, NextResponse } from "next/server"
import { EnhancedAI } from "@/lib/ai-enhanced-features"

export async function POST(request: NextRequest) {
  try {
    const { content, context } = await request.json()

    const suggestions = await EnhancedAI.getWritingAssistance(content, context)

    return NextResponse.json({ success: true, suggestions })
  } catch (error) {
    console.error("Writing assistant error:", error)
    return NextResponse.json({ error: "Failed to get writing assistance" }, { status: 500 })
  }
}
