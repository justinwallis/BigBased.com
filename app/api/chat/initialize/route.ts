import { initializeAI } from "@/lib/ai-rag-system"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    await initializeAI()
    return NextResponse.json({ success: true, message: "AI system initialized." })
  } catch (error) {
    console.error("Error initializing AI system:", error)
    return NextResponse.json({ error: "Failed to initialize AI system." }, { status: 500 })
  }
}
