"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Users, Eye, Share2, Globe, Calendar } from "lucide-react"

interface ProfileInsightsProps {
  profileData: {
    username: string
    full_name: string
    bio: string
    avatar_url: string
    social_links: any
    created_at: string
  }
}

export function ProfileInsights({ profileData }: ProfileInsightsProps) {
  // Mock data - in real app, this would come from analytics
  const insights = {
    profileViews: 127,
    profileViewsGrowth: 23,
    socialClicks: 45,
    socialClicksGrowth: 12,
    profileShares: 8,
    profileSharesGrowth: 5,
    networkConnections: 34,
    networkGrowth: 15,
  }

  const socialStrength = Object.values(profileData.social_links || {}).filter(Boolean).length
  const profileStrength = [profileData.username, profileData.full_name, profileData.bio, profileData.avatar_url].filter(
    Boolean,
  ).length

  const overallScore = Math.round((socialStrength * 10 + profileStrength * 15) / 1.0)

  const memberSince = new Date(profileData.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Profile Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Profile Strength</span>
            <Badge variant={overallScore >= 80 ? "default" : overallScore >= 60 ? "secondary" : "outline"}>
              {overallScore >= 80 ? "Strong" : overallScore >= 60 ? "Good" : "Needs Work"}
            </Badge>
          </div>
          <Progress value={overallScore} className="h-2" />
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {overallScore}/100 - Complete your profile to increase visibility
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3 text-blue-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Profile Views</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{insights.profileViews}</span>
              <Badge variant="secondary" className="text-xs">
                +{insights.profileViewsGrowth}%
              </Badge>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-green-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Connections</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{insights.networkConnections}</span>
              <Badge variant="secondary" className="text-xs">
                +{insights.networkGrowth}%
              </Badge>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3 text-purple-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Social Clicks</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{insights.socialClicks}</span>
              <Badge variant="secondary" className="text-xs">
                +{insights.socialClicksGrowth}%
              </Badge>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Share2 className="h-3 w-3 text-orange-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Profile Shares</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{insights.profileShares}</span>
              <Badge variant="secondary" className="text-xs">
                +{insights.profileSharesGrowth}%
              </Badge>
            </div>
          </div>
        </div>

        {/* Member Info */}
        <div className="pt-4 border-t space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-400">Member since {memberSince}</span>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Quick Tips</span>
            <ul className="text-xs text-gray-500 space-y-1">
              {!profileData.bio && <li>• Add a bio to increase profile views by 40%</li>}
              {socialStrength < 3 && <li>• Add more social links to boost credibility</li>}
              {!profileData.avatar_url && <li>• Upload a profile picture for better engagement</li>}
              {profileStrength >= 4 && socialStrength >= 3 && (
                <li>• Your profile looks great! Share it to grow your network</li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
