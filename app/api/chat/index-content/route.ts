import { indexDocument } from "@/lib/ai-rag-system"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { document } = await req.json()
    await indexDocument(document)
    return NextResponse.json({ success: true, message: "Document indexed successfully." })
  } catch (error) {
    console.error("Error indexing document:", error)
    return NextResponse.json({ error: "Failed to index document." }, { status: 500 })
  }
}
