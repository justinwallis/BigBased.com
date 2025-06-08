import OpenAI from "openai"
import { RAG_CONFIG } from "./config"

const openai = new OpenAI({
  apiKey: RAG_CONFIG.openai.apiKey,
})

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const response = await openai.embeddings.create({
      model: RAG_CONFIG.openai.model,
      input: texts,
    })

    return response.data.map((item) => item.embedding)
  } catch (error) {
    console.error("Error generating embeddings:", error)
    throw new Error("Failed to generate embeddings")
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const embeddings = await generateEmbeddings([text])
  return embeddings[0]
}
