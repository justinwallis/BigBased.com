import { type NextRequest, NextResponse } from "next/server"
import { contentIndexer } from "@/lib/rag/indexer"

export async function POST(request: NextRequest) {
  try {
    const { action, contentType, sourceId, tenantId, content } = await request.json()

    if (!tenantId) {
      return NextResponse.json({ error: "tenantId is required" }, { status: 400 })
    }

    switch (action) {
      case "index":
        if (!content) {
          return NextResponse.json({ error: "content is required for indexing" }, { status: 400 })
        }

        await contentIndexer.indexSingleContent({
          sourceId,
          contentType,
          tenantId,
          title: content.title,
          content: content.content,
          url: content.url,
          tags: content.tags || [],
          createdAt: content.createdAt,
          updatedAt: content.updatedAt,
          author: content.author,
        })
        break

      case "delete":
        if (!sourceId) {
          return NextResponse.json({ error: "sourceId is required for deletion" }, { status: 400 })
        }

        await contentIndexer.deleteContent(sourceId, tenantId)
        break

      case "reindex":
        await contentIndexer.indexAllContent(tenantId)
        break

      default:
        return NextResponse.json({ error: "Invalid action. Use: index, delete, or reindex" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in AI indexing:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
