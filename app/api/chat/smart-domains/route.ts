import { generateSmartDomains } from "@/lib/ai-business-features"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { keywords, count } = await req.json()
    const domains = await generateSmartDomains(keywords, count)
    return NextResponse.json({ success: true, domains })
  } catch (error) {
    console.error("Error generating smart domains:", error)
    return NextResponse.json({ error: "Failed to generate smart domains." }, { status: 500 })
  }
}
