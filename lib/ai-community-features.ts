import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export class CommunityAI {
  // Auto-moderate comments
  static async moderateComment(comment: string) {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Analyze this comment for BigBased community guidelines:
      
      Comment: "${comment}"
      
      Check for:
      - Inappropriate language
      - Off-topic content  
      - Spam or promotional content
      - Violations of conservative community standards
      
      Return JSON: { approved: boolean, reason: string, confidence: number }`,
      temperature: 0.1,
    })

    return JSON.parse(text)
  }

  // Generate discussion starters
  static async generateDiscussionPrompts(topic: string) {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Generate 3 thoughtful discussion questions about: ${topic}
      
      Make them:
      - Engaging for conservative audiences
      - Thought-provoking but respectful
      - Relevant to current events
      
      Return as JSON array.`,
      temperature: 0.7,
    })

    return JSON.parse(text)
  }

  // Smart user matching
  static async findSimilarUsers(userProfile: any, allUsers: any[]) {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Find users similar to this profile:
      Interests: ${userProfile.interests?.join(", ")}
      Location: ${userProfile.location}
      Values: ${userProfile.values?.join(", ")}
      
      From these users: ${JSON.stringify(allUsers.slice(0, 20))}
      
      Return top 5 matches with similarity scores.`,
      temperature: 0.3,
    })

    return JSON.parse(text)
  }
}
