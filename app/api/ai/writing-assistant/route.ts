import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { content, context } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required for writing assistance" }, { status: 400 })
    }

    const prompt = `You are an AI writing assistant for BigBased.com, a platform focused on conservative values, digital sovereignty, and community building. Your task is to analyze the provided content and offer constructive suggestions for improvement across several categories.

Content Context: ${context}

Analyze the following content:
---
${content}
---

Provide suggestions for:
1.  **Clarity & Engagement**: How clear, concise, and engaging is the writing? Suggest improvements for readability and impact.
2.  **Conservative Messaging**: How well does the content align with conservative values, digital sovereignty, and BigBased.com's mission? Suggest ways to strengthen this alignment.
3.  **Suggested Examples & Data**: Propose specific examples, statistics, or historical references that could enhance the arguments.
4.  **Call-to-Action Effectiveness**: If applicable, how effective is the call-to-action? Suggest improvements to make it more compelling.

Format your response as a JSON object with the following structure:
{
  "clarity": {
    "score": number, // 1-10, higher is better
    "suggestions": string[]
  },
  "messaging": {
    "score": number, // 1-10, higher is better
    "suggestions": string[]
  },
  "examples": {
    "suggestions": string[]
  },
  "cta": {
    "score": number, // 1-10, higher is better, 0 if no CTA
    "suggestions": string[]
  }
}
Ensure the JSON is valid and can be parsed directly.`

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: prompt,
      temperature: 0.7,
      maxTokens: 1500,
      response_format: { type: "json_object" },
    })

    const suggestions = JSON.parse(text)

    return NextResponse.json({ success: true, suggestions })
  } catch (error) {
    console.error("Writing assistant error:", error)
    return NextResponse.json({ error: "Failed to get writing assistance" }, { status: 500 })
  }
}
