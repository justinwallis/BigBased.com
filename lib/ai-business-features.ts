import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export class BusinessAI {
  // Generate domain descriptions
  static async generateDomainDescription(domain: string, category: string) {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Create a compelling description for the domain: ${domain}
      Category: ${category}
      
      Make it:
      - Professional and trustworthy
      - Aligned with conservative values
      - SEO-friendly
      - 2-3 sentences max
      
      Focus on the domain's potential for building conservative digital presence.`,
      temperature: 0.5,
    })

    return text
  }

  // Smart pricing suggestions
  static async suggestDomainPricing(domain: string, marketData: any) {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Suggest pricing for domain: ${domain}
      
      Market data: ${JSON.stringify(marketData)}
      
      Consider:
      - Domain length and memorability
      - Market demand
      - Conservative/patriotic keywords
      - Brandability
      
      Return JSON: { suggestedPrice: number, reasoning: string }`,
      temperature: 0.3,
    })

    return JSON.parse(text)
  }

  // Generate marketing copy
  static async generateMarketingCopy(product: any, audience: string) {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Create marketing copy for:
      Product: ${product.name}
      Description: ${product.description}
      Target: ${audience}
      
      Make it:
      - Compelling and action-oriented
      - Aligned with conservative values
      - Professional tone
      - Include clear value proposition
      
      Return: headline, description, call-to-action`,
      temperature: 0.6,
    })

    return text
  }
}
