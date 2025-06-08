import { QdrantClient } from "@qdrant/js-client-rest"
import { RAG_CONFIG, type ContentChunk } from "./config"

class QdrantManager {
  private client: QdrantClient
  private collectionName = RAG_CONFIG.qdrant.collectionName

  constructor() {
    this.client = new QdrantClient({
      url: RAG_CONFIG.qdrant.url,
      apiKey: RAG_CONFIG.qdrant.apiKey,
    })
  }

  async ensureCollection() {
    try {
      await this.client.getCollection(this.collectionName)
    } catch (error) {
      // Collection doesn't exist, create it
      await this.client.createCollection(this.collectionName, {
        vectors: {
          size: RAG_CONFIG.openai.dimensions,
          distance: "Cosine",
        },
      })

      // Create indexes for efficient filtering
      await this.client.createPayloadIndex(this.collectionName, {
        field_name: "content_type",
        field_schema: "keyword",
      })

      await this.client.createPayloadIndex(this.collectionName, {
        field_name: "tenant_id",
        field_schema: "keyword",
      })

      await this.client.createPayloadIndex(this.collectionName, {
        field_name: "tags",
        field_schema: "keyword",
      })
    }
  }

  async upsertChunks(chunks: ContentChunk[]) {
    await this.ensureCollection()

    const points = chunks.map((chunk, index) => ({
      id: chunk.id,
      vector: chunk.embedding!,
      payload: {
        content: chunk.content,
        ...chunk.metadata,
      },
    }))

    await this.client.upsert(this.collectionName, {
      wait: true,
      points,
    })
  }

  async searchSimilar(
    queryEmbedding: number[],
    tenantId: string,
    filters?: {
      content_type?: string[]
      tags?: string[]
      source_id?: string
    },
    limit = RAG_CONFIG.retrieval.topK,
  ) {
    const must: any[] = [
      {
        key: "tenant_id",
        match: { value: tenantId },
      },
    ]

    if (filters?.content_type) {
      must.push({
        key: "content_type",
        match: { any: filters.content_type },
      })
    }

    if (filters?.tags) {
      must.push({
        key: "tags",
        match: { any: filters.tags },
      })
    }

    if (filters?.source_id) {
      must.push({
        key: "source_id",
        match: { value: filters.source_id },
      })
    }

    const searchResult = await this.client.search(this.collectionName, {
      vector: queryEmbedding,
      filter: { must },
      limit,
      score_threshold: RAG_CONFIG.retrieval.similarityThreshold,
      with_payload: true,
    })

    return searchResult.map((result) => ({
      id: result.id as string,
      content: result.payload?.content as string,
      metadata: {
        content_type: result.payload?.content_type,
        tenant_id: result.payload?.tenant_id,
        source_id: result.payload?.source_id,
        title: result.payload?.title,
        url: result.payload?.url,
        author: result.payload?.author,
        tags: result.payload?.tags,
        created_at: result.payload?.created_at,
        updated_at: result.payload?.updated_at,
        section: result.payload?.section,
      },
      score: result.score,
    }))
  }

  async deleteBySourceId(sourceId: string, tenantId: string) {
    await this.client.delete(this.collectionName, {
      filter: {
        must: [
          { key: "source_id", match: { value: sourceId } },
          { key: "tenant_id", match: { value: tenantId } },
        ],
      },
    })
  }
}

export const qdrantManager = new QdrantManager()
