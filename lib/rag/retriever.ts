import { chromaManager } from "./chroma-client"
import { generateEmbedding } from "./huggingface-embeddings"
import type { ContentType } from "./config"

export interface RetrievalFilters {
  content_types?: ContentType[]
  tags?: string[]
  source_id?: string
  author?: string
}

export interface RetrievalResult {
  id: string
  content: string
  metadata: {
    content_type: ContentType
    tenant_id: string
    source_id: string
    title: string
    url: string
    author?: string
    tags?: string[]
    created_at: string
    updated_at: string
    section?: string
    drive_file_id?: string
  }
  score: number
}

export class ContentRetriever {
  async retrieveRelevantContent(
    query: string,
    tenantId: string,
    filters?: RetrievalFilters,
    limit = 5,
  ): Promise<RetrievalResult[]> {
    try {
      // Generate embedding for the query
      const queryEmbedding = await generateEmbedding(query)

      // Search in vector database
      const results = await chromaManager.searchSimilar(
        queryEmbedding,
        tenantId,
        {
          content_type: filters?.content_types,
          tags: filters?.tags,
          source_id: filters?.source_id,
        },
        limit,
      )

      return results
    } catch (error) {
      console.error("Error retrieving content:", error)
      return []
    }
  }

  async retrieveContextForPage(pageUrl: string, tenantId: string, query?: string): Promise<RetrievalResult[]> {
    // If we have a specific query, use semantic search
    if (query) {
      return this.retrieveRelevantContent(query, tenantId, undefined, 3)
    }

    // Otherwise, find content related to this page
    const queryEmbedding = await generateEmbedding(`Related content for ${pageUrl}`)

    const results = await chromaManager.searchSimilar(queryEmbedding, tenantId, undefined, 5)

    // Filter out the current page if it exists
    return results.filter((result) => result.metadata.url !== pageUrl)
  }
}

export const contentRetriever = new ContentRetriever()
