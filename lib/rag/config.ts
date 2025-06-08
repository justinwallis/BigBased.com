export const RAG_CONFIG = {
  // Vector DB - Using local Chroma (free) instead of Qdrant Cloud
  chroma: {
    url: process.env.CHROMA_URL || "http://localhost:8000",
    collectionName: "bigbased_content",
  },

  // Embeddings - Using HuggingFace (free) instead of OpenAI
  huggingface: {
    apiKey: process.env.HUGGINGFACE_API_KEY, // Free tier available
    model: "sentence-transformers/all-MiniLM-L6-v2",
    dimensions: 384,
  },

  // LLM - Groq has generous free tier
  groq: {
    apiKey: process.env.GROQ_API_KEY, // Free: 6,000 requests/day
    model: "mixtral-8x7b-32768",
  },

  // Google Drive integration
  googleDrive: {
    folderId: "1--U-oXYh5kcm7Dq0XAxuDllv1lwSZHs4",
    serviceAccountKey: process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
  },

  // Chunking
  chunking: {
    maxChunkSize: 1000,
    overlap: 200,
    minChunkSize: 100,
  },

  // Retrieval
  retrieval: {
    topK: 5,
    similarityThreshold: 0.7,
  },
}

export type ContentType = "documentation" | "cms_content" | "forum_post" | "product" | "user_profile" | "google_drive"

export interface ContentChunk {
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
  embedding?: number[]
}
