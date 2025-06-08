import { type NextRequest, NextResponse } from "next/server"
import { ragSystem } from "@/lib/ai-rag-system"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { content_id, type = "content" } = await request.json()

    // Get content from database
    const supabase = createClient(true) // Use service role

    let query = supabase.from("cms_content").select("*").eq("status", "published")

    if (content_id) {
      query = query.eq("id", content_id)
    }

    const { data: content, error } = await query

    if (error) {
      throw error
    }

    if (!content || content.length === 0) {
      return NextResponse.json({ error: "No content found" }, { status: 404 })
    }

    // Index each piece of content
    const indexed = []
    for (const item of content) {
      try {
        await ragSystem.addDocument({
          id: item.id,
          content: `${item.title}\n\n${item.content?.text || ""}`,
          metadata: {
            type: type as any,
            title: item.title,
            url: `/content/${item.slug}`,
            domain: item.domain || "bigbased.com",
            tenant_id: item.tenant_id,
            created_at: item.created_at,
            tags: item.tags || [],
            author: item.author_id,
            category: item.content_type_id,
          },
        })
        indexed.push(item.id)
      } catch (error) {
        console.error(`Error indexing content ${item.id}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      indexed_count: indexed.length,
      indexed_ids: indexed,
    })
  } catch (error) {
    console.error("Index content API error:", error)
    return NextResponse.json({ error: "Failed to index content" }, { status: 500 })
  }
}
