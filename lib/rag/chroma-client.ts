import { ChromaApi } from "chromadb"
import { RAG_CONFIG, type ContentChunk } from "./config"

class ChromaManager {
  private client: ChromaApi
  private collectionName = RAG_CONFIG.chroma.collectionName
  private collection: any = null

  constructor() {
    this.client = new ChromaApi({
      path: RAG_CONFIG.chroma.url,
    })
  }

  async ensureCollection() {
    if (this.collection) return this.collection

    try {
      this.collection = await this.client.getCollection({
        name: this.collectionName,
      })
    } catch (error) {
      // Collection doesn't exist, create it
      this.collection = await this.client.createCollection({
        name: this.collectionName,
        metadata: { description: "BigBased content embeddings" },
      })
    }

    return this.collection
  }

  async upsertChunks(chunks: ContentChunk[]) {
    const collection = await this.ensureCollection()

    const ids = chunks.map((chunk) => chunk.id)
    const documents = chunks.map((chunk) => chunk.content)
    const embeddings = chunks.map((chunk) => chunk.embedding!)
    const metadatas = chunks.map((chunk) => chunk.metadata)

    await collection.upsert({
      ids,
      documents,
      embeddings,
      metadatas,
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
    const collection = await this.ensureCollection()

    // Build where clause for filtering
    const where: any = { tenant_id: tenantId }

    if (filters?.content_type) {
      where.content_type = { $in: filters.content_type }
    }

    if (filters?.source_id) {
      where.source_id = filters.source_id
    }

    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: limit,
      where,
    })

    return results.ids[0].map((id: string, index: number) => ({
      id,
      content: results.documents[0][index],
      metadata: results.metadatas[0][index],
      score: 1 - results.distances[0][index], // Convert distance to similarity
    }))
  }

  async deleteBySourceId(sourceId: string, tenantId: string) {
    const collection = await this.ensureCollection()

    await collection.delete({
      where: {
        source_id: sourceId,
        tenant_id: tenantId,
      },
    })
  }
}

export const chromaManager = new ChromaManager()
