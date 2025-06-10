import { searchAI } from "@/lib/ai-rag-system"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { query, options } = await req.json()
    const results = await searchAI(query, options)
    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error("Error searching AI:", error)
    return NextResponse.json({ error: "Failed to perform AI search." }, { status: 500 })
  }
}
