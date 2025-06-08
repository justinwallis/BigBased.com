"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, MessageCircle, TrendingUp, Heart } from "lucide-react"

export default function AICommunityInsights() {
  const [insights, setInsights] = useState<any>(null)

  useEffect(() => {
    // Mock data - in real implementation, this would call your AI API
    setInsights({
      engagementScore: 85,
      trendingTopics: ["Digital Sovereignty", "Conservative Values", "Community Building"],
      sentimentAnalysis: {
        positive: 78,
        neutral: 18,
        negative: 4,
      },
      recommendedActions: [
        "Host a discussion on digital privacy",
        "Share success stories from community members",
        "Create content about conservative tech alternatives",
      ],
      activeDiscussions: 24,
      newMembers: 12,
    })
  }, [])

  if (!insights) return null

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          AI Community Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Engagement Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Community Engagement</span>
            <span className="text-sm text-muted-foreground">{insights.engagementScore}%</span>
          </div>
          <Progress value={insights.engagementScore} className="h-2" />
        </div>

        {/* Trending Topics */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">Trending Topics</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {insights.trendingTopics.map((topic: string, i: number) => (
              <Badge key={i} variant="secondary">
                {topic}
              </Badge>
            ))}
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span className="text-sm font-medium">Community Sentiment</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-green-600">Positive</span>
              <span>{insights.sentimentAnalysis.positive}%</span>
            </div>
            <Progress value={insights.sentimentAnalysis.positive} className="h-1" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Neutral</span>
              <span>{insights.sentimentAnalysis.neutral}%</span>
            </div>
            <Progress value={insights.sentimentAnalysis.neutral} className="h-1" />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Active Discussions</span>
            </div>
            <span className="text-2xl font-bold">{insights.activeDiscussions}</span>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">New Members</span>
            </div>
            <span className="text-2xl font-bold">{insights.newMembers}</span>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="space-y-2">
          <span className="text-sm font-medium">AI Recommendations</span>
          <div className="space-y-2">
            {insights.recommendedActions.map((action: string, i: number) => (
              <div key={i} className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded text-xs border border-blue-200">
                {action}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
