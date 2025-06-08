import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export class EnhancedAI {
  // AI-Powered Content Editor Assistant
  static async getWritingAssistance(content: string, context: string) {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `You're a writing assistant for BigBased.com, focused on conservative values and digital sovereignty.

Current content: "${content}"
Context: ${context}

Provide suggestions for:
1. Improving clarity and engagement
2. Strengthening conservative messaging
3. Adding relevant examples or data
4. Improving call-to-action

Return as JSON with specific suggestions.`,
      temperature: 0.6,
    })

    return JSON.parse(text)
  }

  // Smart Domain Recommendations
  static async recommendDomains(userProfile: any, searchHistory: string[]) {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Based on user profile and search history, recommend 10 domains:

User Profile: ${JSON.stringify(userProfile)}
Recent Searches: ${searchHistory.join(", ")}

Focus on:
- Conservative/patriotic themes
- Business opportunities
- Personal branding
- Investment potential

Return JSON array with domain suggestions and reasoning.`,
      temperature: 0.7,
    })

    return JSON.parse(text)
  }

  // AI Community Moderator
  static async analyzePost(content: string, author: any, community: string) {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Analyze this community post for BigBased:

Content: "${content}"
Author: ${JSON.stringify(author)}
Community: ${community}

Check for:
1. Alignment with conservative values
2. Quality and constructiveness
3. Potential for engagement
4. Any red flags

Return JSON: { score: 1-10, flags: [], suggestions: [], shouldPromote: boolean }`,
      temperature: 0.3,
    })

    return JSON.parse(text)
  }

  // Smart Affiliate Matching
  static async matchAffiliateOpportunities(userProfile: any, availablePrograms: any[]) {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Match user with best affiliate opportunities:

User: ${JSON.stringify(userProfile)}
Programs: ${JSON.stringify(availablePrograms)}

Consider:
- User's audience and reach
- Alignment with conservative values
- Earning potential
- User's interests and expertise

Return top 5 matches with scores and reasoning.`,
      temperature: 0.4,
    })

    return JSON.parse(text)
  }

  // AI-Powered Documentation Assistant
  static async generateDocumentation(topic: string, audience: string, existingDocs: any[]) {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Create comprehensive documentation for BigBased:

Topic: ${topic}
Audience: ${audience}
Existing Docs: ${JSON.stringify(existingDocs.slice(0, 3))}

Create:
1. Clear step-by-step guide
2. Common troubleshooting
3. Best practices
4. Related resources

Format as markdown with proper structure.`,
      temperature: 0.5,
    })

    return text
  }

  // Smart Notification System
  static async generatePersonalizedNotifications(user: any, recentActivity: any[]) {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Generate personalized notifications for user:

User: ${JSON.stringify(user)}
Recent Activity: ${JSON.stringify(recentActivity)}

Create 3-5 relevant notifications about:
- New content they'd like
- Community discussions to join
- Domain opportunities
- Platform updates

Make them engaging and actionable.`,
      temperature: 0.6,
    })

    return JSON.parse(text)
  }
}
