"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Circle, Star, Trophy, Target, Zap } from "lucide-react"

interface ProfileData {
  username: string
  full_name: string
  bio: string
  avatar_url: string
  banner_url: string
  social_links: any
}

interface ProfileCompletionWizardProps {
  profileData: ProfileData
  onSuggestionClick: (field: string) => void
}

export function ProfileCompletionWizard({ profileData, onSuggestionClick }: ProfileCompletionWizardProps) {
  const [completionScore, setCompletionScore] = useState(0)
  const [completedItems, setCompletedItems] = useState<string[]>([])
  const [achievements, setAchievements] = useState<string[]>([])

  const completionItems = [
    {
      id: "username",
      label: "Choose a unique username",
      points: 15,
      completed: !!profileData.username,
      field: "username",
    },
    {
      id: "full_name",
      label: "Add your full name",
      points: 10,
      completed: !!profileData.full_name,
      field: "full_name",
    },
    {
      id: "bio",
      label: "Write a compelling bio",
      points: 20,
      completed: !!profileData.bio && profileData.bio.length > 50,
      field: "bio",
    },
    {
      id: "avatar",
      label: "Upload a profile picture",
      points: 15,
      completed: !!profileData.avatar_url,
      field: "avatar",
    },
    {
      id: "banner",
      label: "Add a banner image",
      points: 10,
      completed: !!profileData.banner_url,
      field: "banner",
    },
    {
      id: "social_primary",
      label: "Add 2+ social media links",
      points: 15,
      completed: Object.values(profileData.social_links || {}).filter(Boolean).length >= 2,
      field: "social",
    },
    {
      id: "social_complete",
      label: "Complete social media presence (5+ links)",
      points: 15,
      completed: Object.values(profileData.social_links || {}).filter(Boolean).length >= 5,
      field: "social",
    },
  ]

  useEffect(() => {
    const completed = completionItems.filter((item) => item.completed)
    const score = completed.reduce((sum, item) => sum + item.points, 0)
    setCompletionScore(score)
    setCompletedItems(completed.map((item) => item.id))

    // Check for achievements
    const newAchievements = []
    if (score >= 25) newAchievements.push("Getting Started")
    if (score >= 50) newAchievements.push("Profile Builder")
    if (score >= 75) newAchievements.push("Social Connector")
    if (score >= 100) newAchievements.push("Profile Master")

    setAchievements(newAchievements)
  }, [profileData])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: "Elite", variant: "default" as const, icon: Trophy }
    if (score >= 75) return { label: "Advanced", variant: "secondary" as const, icon: Star }
    if (score >= 50) return { label: "Intermediate", variant: "outline" as const, icon: Target }
    return { label: "Beginner", variant: "destructive" as const, icon: Zap }
  }

  const badge = getScoreBadge(completionScore)
  const BadgeIcon = badge.icon

  return (
    <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BadgeIcon className="h-5 w-5" />
            Profile Completion
          </CardTitle>
          <Badge variant={badge.variant} className="flex items-center gap-1">
            <BadgeIcon className="h-3 w-3" />
            {badge.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progress</span>
            <span className={`text-sm font-bold ${getScoreColor(completionScore)}`}>{completionScore}/100 points</span>
          </div>
          <Progress value={completionScore} className="h-3" />
        </div>

        {achievements.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Achievements Unlocked</span>
            <div className="flex flex-wrap gap-1">
              {achievements.map((achievement) => (
                <Badge key={achievement} variant="secondary" className="text-xs">
                  🏆 {achievement}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <span className="text-sm font-medium">Complete Your Profile</span>
          <div className="space-y-2">
            {completionItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-400" />
                  )}
                  <span className={`text-sm ${item.completed ? "text-gray-500 line-through" : ""}`}>{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">+{item.points}pts</span>
                  {!item.completed && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onSuggestionClick(item.field)}
                      className="h-6 px-2 text-xs"
                    >
                      Do it
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {completionScore < 100 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              💡 Complete your profile to unlock more features and increase your visibility!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
