import { type NextRequest, NextResponse } from "next/server"
import { contentRetriever, type RetrievalFilters } from "@/lib/rag/retriever"
import { streamText } from "ai"
import { createGroq } from "@ai-sdk/groq"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { query, filters, tenantId, conversationHistory } = await request.json()

    if (!query || !tenantId) {
      return NextResponse.json({ error: "Query and tenantId are required" }, { status: 400 })
    }

    // Retrieve relevant content
    const relevantContent = await contentRetriever.retrieveRelevantContent(
      query,
      tenantId,
      filters as RetrievalFilters,
      5,
    )

    // Build context from retrieved content
    const context = relevantContent
      .map(
        (result) => `
**${result.metadata.title}** (${result.metadata.content_type})
${result.content}
Source: ${result.metadata.url}
---`,
      )
      .join("\n")

    // Build conversation history
    const messages = [
      {
        role: "system" as const,
        content: `You are an AI assistant for BigBased.com, a platform focused on truth, faith, and conservative values. 

Use the following context to answer questions accurately and helpfully. If the context doesn't contain enough information to answer the question, say so clearly.

Always cite your sources by mentioning the relevant content titles and providing the source URLs when possible.

Context:
${context}

Guidelines:
- Be helpful, accurate, and respectful
- Stay true to BigBased's values of truth, faith, and freedom
- Provide specific references to the source material
- If you don't know something, admit it rather than guessing
- Keep responses concise but comprehensive`,
      },
      ...(conversationHistory || []),
      {
        role: "user" as const,
        content: query,
      },
    ]

    // Generate streaming response
    const result = await streamText({
      model: groq("mixtral-8x7b-32768"),
      messages,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return result.toAIStreamResponse({
      headers: {
        "X-Sources": JSON.stringify(
          relevantContent.map((r) => ({
            title: r.metadata.title,
            url: r.metadata.url,
            type: r.metadata.content_type,
            score: r.score,
          })),
        ),
      },
    })
  } catch (error) {
    console.error("Error in AI query:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
