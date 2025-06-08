import { type NextRequest, NextResponse } from "next/server"
import { ragSystem } from "@/lib/ai-rag-system"

export async function POST(request: NextRequest) {
  try {
    const { query, domain, type, limit = 10 } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // Search for relevant documents
    const results = await ragSystem.searchDocuments(query, {
      domain,
      type,
      limit,
      score_threshold: 0.6,
    })

    return NextResponse.json({
      success: true,
      results: results.map(({ document, score }) => ({
        id: document.id,
        title: document.metadata.title,
        content: document.content.substring(0, 500) + "...",
        url: document.metadata.url,
        score,
        metadata: document.metadata,
      })),
    })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Failed to search content" }, { status: 500 })
  }
}
