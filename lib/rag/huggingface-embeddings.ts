import { RAG_CONFIG } from "./config"

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/pipeline/feature-extraction/${RAG_CONFIG.huggingface.model}`,
      {
        headers: {
          Authorization: `Bearer ${RAG_CONFIG.huggingface.apiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: texts,
          options: { wait_for_model: true },
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`HuggingFace API error: ${response.statusText}`)
    }

    const embeddings = await response.json()

    // Handle single text vs array of texts
    if (texts.length === 1) {
      return [embeddings]
    }

    return embeddings
  } catch (error) {
    console.error("Error generating embeddings:", error)
    throw new Error("Failed to generate embeddings")
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const embeddings = await generateEmbeddings([text])
  return embeddings[0]
}
