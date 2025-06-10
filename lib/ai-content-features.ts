import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export class ContentAI {
  // Auto-generate SEO metadata
  static async generateSEOMetadata(content: string, title: string) {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Generate SEO metadata for this content:
      Title: ${title}
      Content: ${content.substring(0, 1000)}...
      
      Return JSON with: description, keywords, ogTitle, ogDescription`,
      temperature: 0.3,
    })

    return JSON.parse(text)
  }

  // Auto-categorize content
  static async categorizeContent(content: string) {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Categorize this content into BigBased categories:
      - Politics & Governance
      - Faith & Values  
      - Technology & Innovation
      - Community & Culture
      - Education & Resources
      
      Content: ${content.substring(0, 500)}...
      
      Return the most relevant category.`,
      temperature: 0.1,
    })

    return text.trim()
  }

  // Generate content summaries
  static async generateSummary(content: string, maxLength = 150) {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Create a compelling ${maxLength}-character summary of this content:
      
      ${content}
      
      Make it engaging and aligned with conservative values.`,
      temperature: 0.4,
    })

    return text
  }

  // Smart content recommendations
  static async getContentRecommendations(userInterests: string[], viewedContent: string[]) {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Based on user interests: ${userInterests.join(", ")}
      And recently viewed: ${viewedContent.join(", ")}
      
      Recommend 5 content topics that would interest this user on BigBased.
      Focus on: conservative values, digital sovereignty, community building.
      
      Return as JSON array of topics.`,
      temperature: 0.6,
    })

    return JSON.parse(text)
  }
}
