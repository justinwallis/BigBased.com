import { type NextRequest, NextResponse } from "next/server"
import { ragSystem } from "@/lib/ai-rag-system"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  let content_id: string | undefined
  let type: "content" | "documentation" | "community" | "profile" = "content"

  try {
    // Attempt to parse JSON, but handle cases where body might be empty or not JSON
    const requestText = await request.text()
    if (requestText) {
      const requestBody = JSON.parse(requestText)
      content_id = requestBody.content_id
      type = requestBody.type || "content"
    }
  } catch (parseError) {
    console.warn("Could not parse request body as JSON, proceeding with default values:", parseError)
    // If parsing fails, content_id remains undefined and type defaults to "content"
  }

  try {
    // Get content from database
    const supabase = createClient(true) // Use service role

    let query = supabase.from("content_items").select("*").eq("status", "published")

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
            type: type as any, // Use the type from request or default
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
