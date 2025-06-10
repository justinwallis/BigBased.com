import { generateContent } from "@/lib/ai-content-features"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { prompt, length, tone } = await req.json()
    const content = await generateContent(prompt, length, tone)
    return NextResponse.json({ success: true, content })
  } catch (error) {
    console.error("Error generating content with writing assistant:", error)
    return NextResponse.json({ error: "Failed to generate content." }, { status: 500 })
  }
}
