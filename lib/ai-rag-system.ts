import { openai } from "@ai-sdk/openai"
import { generateText, streamText } from "ai"
import { QdrantClient } from "@qdrant/js-client-rest"
import { createClient } from "@/lib/supabase/server" // Import Supabase server client

// Initialize Qdrant client
const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL!,
  apiKey: process.env.QDRANT_API_KEY!,
})

// Collection names for different content types
const COLLECTIONS = {
  CONTENT: "bigbased_content",
  DOCUMENTATION: "bigbased_docs",
  COMMUNITY: "bigbased_community",
  PROFILES: "bigbased_profiles",
} as const

export interface RAGDocument {
  id: string
  content: string
  metadata: {
    type: "content" | "documentation" | "community" | "profile"
    title: string
    url?: string
    domain?: string
    tenant_id?: string
    created_at: string
    tags?: string[]
    author?: string
    category?: string
  }
  embedding?: number[]
}

export class BigBasedRAGSystem {
  private groqClient: any

  constructor() {
    // Initialize Groq client through Vercel AI SDK
    this.groqClient = openai // We'll configure this for Groq
  }

  /**
   * Initialize Qdrant collections for multi-tenant RAG
   */
  async initializeCollections() {
    for (const [key, collectionName] of Object.entries(COLLECTIONS)) {
      try {
        // Check if collection exists
        const collections = await qdrant.getCollections()
        const exists = collections.collections.some((c) => c.name === collectionName)

        if (!exists) {
          await qdrant.createCollection(collectionName, {
            vectors: {
              size: 1536, // OpenAI text-embedding-3-small dimension
              distance: "Cosine",
            },
            optimizers_config: {
              default_segment_number: 2,
            },
            replication_factor: 1,
          })

          // Create payload indexes for efficient filtering
          await qdrant.createPayloadIndex(collectionName, {
            field_name: "metadata.domain",
            field_schema: "keyword",
          })

          await qdrant.createPayloadIndex(collectionName, {
            field_name: "metadata.type",
            field_schema: "keyword",
          })

          await qdrant.createPayloadIndex(collectionName, {
            field_name: "metadata.tenant_id",
            field_schema: "keyword",
          })

          console.log(`Created collection: ${collectionName}`)
        }
      } catch (error) {
        console.error(`Error initializing collection ${collectionName}:`, error)
      }
    }
  }

  /**
   * Generate embeddings using OpenAI
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "text-embedding-3-small",
          input: text,
          encoding_format: "float",
        }),
      })

      const data = await response.json()
      return data.data[0].embedding
    } catch (error) {
      console.error("Error generating embedding:", error)
      throw error
    }
  }

  /**
   * Add document to RAG system
   */
  async addDocument(document: RAGDocument): Promise<void> {
    try {
      // Generate embedding if not provided
      if (!document.embedding) {
        document.embedding = await this.generateEmbedding(document.content)
      }

      // Determine collection based on document type
      const collection =
        COLLECTIONS[document.metadata.type.toUpperCase() as keyof typeof COLLECTIONS] || COLLECTIONS.CONTENT

      // Upsert document to Qdrant
      await qdrant.upsert(collection, {
        wait: true,
        points: [
          {
            id: document.id,
            vector: document.embedding,
            payload: {
              content: document.content,
              metadata: document.metadata,
            },
          },
        ],
      })

      console.log(`Added document ${document.id} to ${collection}`)
    } catch (error) {
      console.error("Error adding document:", error)
      throw error
    }
  }

  /**
   * Search for relevant documents
   */
  async searchDocuments(
    query: string,
    options: {
      type?: string
      domain?: string
      tenant_id?: string
      limit?: number
      score_threshold?: number
    } = {},
  ): Promise<Array<{ document: RAGDocument; score: number }>> {
    try {
      // Generate query embedding
      const queryEmbedding = await this.generateEmbedding(query)

      // Build filter conditions
      const filter: any = {
        must: [],
      }

      if (options.type) {
        filter.must.push({
          key: "metadata.type",
          match: { value: options.type },
        })
      }

      if (options.domain) {
        filter.must.push({
          key: "metadata.domain",
          match: { value: options.domain },
        })
      }

      if (options.tenant_id) {
        filter.must.push({
          key: "metadata.tenant_id",
          match: { value: options.tenant_id },
        })
      }

      // Search across all relevant collections
      const collections = options.type
        ? [COLLECTIONS[options.type.toUpperCase() as keyof typeof COLLECTIONS] || COLLECTIONS.CONTENT]
        : Object.values(COLLECTIONS)

      const allResults: Array<{ document: RAGDocument; score: number }> = []

      for (const collection of collections) {
        try {
          const searchResult = await qdrant.search(collection, {
            vector: queryEmbedding,
            filter: filter.must.length > 0 ? filter : undefined,
            limit: options.limit || 10,
            score_threshold: options.score_threshold || 0.7,
            with_payload: true,
          })

          const results = searchResult.map((result: any) => ({
            document: {
              id: result.id,
              content: result.payload.content,
              metadata: result.payload.metadata,
            } as RAGDocument,
            score: result.score,
          }))

          allResults.push(...results)
        } catch (error) {
          console.warn(`Error searching collection ${collection}:`, error)
        }
      }

      // Sort by score and return top results
      return allResults.sort((a, b) => b.score - a.score).slice(0, options.limit || 10)
    } catch (error) {
      console.error("Error searching documents:", error)
      throw error
    }
  }

  /**
   * Generate AI response using Groq with RAG context
   */
  async generateResponse(
    query: string,
    context: {
      domain?: string
      tenant_id?: string
      user_id?: string
      conversation_history?: Array<{ role: string; content: string }>
    } = {},
  ): Promise<string> {
    try {
      // Search for relevant documents
      const relevantDocs = await this.searchDocuments(query, {
        domain: context.domain,
        tenant_id: context.tenant_id,
        limit: 5,
        score_threshold: 0.6,
      })

      // Build context from relevant documents
      const ragContext = relevantDocs
        .map(({ document }) => `${document.metadata.title}: ${document.content}`)
        .join("\n\n")

      // Build conversation history
      const messages = [
        {
          role: "system",
          content: `You are an AI assistant for BigBased.com, a platform focused on conservative values, digital sovereignty, and community building. 

Use the following context to answer questions accurately and helpfully:

${ragContext}

Guidelines:
- Be helpful, accurate, and aligned with BigBased's mission
- If you don't know something, say so rather than guessing
- Provide specific, actionable information when possible
- Reference the source material when relevant`,
        },
        ...(context.conversation_history || []),
        {
          role: "user",
          content: query,
        },
      ]

      // Generate response using Groq via Vercel AI SDK
      const { text } = await generateText({
        model: openai("gpt-4o-mini"), // We'll configure this for Groq
        messages: messages as any,
        temperature: 0.7,
        maxTokens: 1000,
      })

      return text
    } catch (error) {
      console.error("Error generating response:", error)
      throw error
    }
  }

  /**
   * Stream AI response for real-time chat
   */
  async streamResponse(
    query: string,
    context: {
      domain?: string
      tenant_id?: string
      user_id?: string
      conversation_history?: Array<{ role: string; content: string }>
    } = {},
  ) {
    try {
      // Search for relevant documents
      const relevantDocs = await this.searchDocuments(query, {
        domain: context.domain,
        tenant_id: context.tenant_id,
        limit: 5,
        score_threshold: 0.6,
      })

      // Build context from relevant documents
      const ragContext = relevantDocs
        .map(({ document }) => `${document.metadata.title}: ${document.content}`)
        .join("\n\n")

      // Build conversation history
      const messages = [
        {
          role: "system",
          content: `You are an AI assistant for BigBased.com, a platform focused on conservative values, digital sovereignty, and community building. 

Use the following context to answer questions accurately and helpfully:

${ragContext}

Guidelines:
- Be helpful, accurate, and aligned with BigBased's mission
- If you don't know something, say so rather than guessing
- Provide specific, actionable information when possible
- Reference the source material when relevant`,
        },
        ...(context.conversation_history || []),
        {
          role: "user",
          content: query,
        },
      ]

      // Stream response using Groq via Vercel AI SDK
      return streamText({
        model: openai("gpt-4o-mini"), // We'll configure this for Groq
        messages: messages as any,
        temperature: 0.7,
        maxTokens: 1000,
      })
    } catch (error) {
      console.error("Error streaming response:", error)
      throw error
    }
  }

  /**
   * Bulk index content from CMS
   */
  async indexCMSContent(): Promise<void> {
    try {
      console.log("Starting CMS content indexing...")
      const supabase = createClient(true) // Use service role client

      const { data: content, error } = await supabase
        .from("content_items")
        .select("id, title, content, slug, domain, tenant_id, created_at, tags, author_id, content_type_id")
        .eq("status", "published")

      if (error) {
        console.error("Error fetching CMS content:", error)
        throw error
      }

      if (!content || content.length === 0) {
        console.log("No published CMS content found to index.")
        return
      }

      const indexedCount = 0
      for (const item of content) {
        try {
          await this.addDocument({
            id: item.id,
            content: `${item.title}\n\n${item.content?.text || ""}`, // Assuming content.text holds the main text
            metadata: {
              type: "content", // Default type for CMS content
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
          indexedCount + 1
        } catch (docError) {
          console.error(`Failed to index document ${item.id}:`, docError)
        }
      }

      console.log(`CMS content indexing completed. Indexed ${indexedCount} documents.`)
    } catch (error) {
      console.error("Error indexing CMS content:", error)
      throw error
    }
  }

  /**
   * Delete document from RAG system
   */
  async deleteDocument(documentId: string, type: string): Promise<void> {
    try {
      const collection = COLLECTIONS[type.toUpperCase() as keyof typeof COLLECTIONS] || COLLECTIONS.CONTENT

      await qdrant.delete(collection, {
        wait: true,
        points: [documentId],
      })

      console.log(`Deleted document ${documentId} from ${collection}`)
    } catch (error) {
      console.error("Error deleting document:", error)
      throw error
    }
  }
}

// Export singleton instance
export const ragSystem = new BigBasedRAGSystem()
