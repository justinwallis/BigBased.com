"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Eye, Share2, Copy, Check } from "lucide-react"
import { useState } from "react"

interface SocialMediaPreviewProps {
  profileData: {
    username: string
    full_name: string
    bio: string
    avatar_url: string
    banner_url: string
    social_links: any
  }
}

export function SocialMediaPreview({ profileData }: SocialMediaPreviewProps) {
  const [copied, setCopied] = useState(false)

  const profileUrl = `https://bigbased.com/${profileData.username}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profileData.full_name || profileData.username} - Big Based`,
          text: profileData.bio || "Check out my Big Based profile!",
          url: profileUrl,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    } else {
      handleCopyLink()
    }
  }

  const socialPlatforms = [
    { key: "x", name: "X (Twitter)", baseUrl: "https://x.com/" },
    { key: "instagram", name: "Instagram", baseUrl: "https://instagram.com/" },
    { key: "youtube", name: "YouTube", baseUrl: "https://youtube.com/@" },
    { key: "linkedin", name: "LinkedIn", baseUrl: "https://linkedin.com/in/" },
    { key: "github", name: "GitHub", baseUrl: "https://github.com/" },
    { key: "tiktok", name: "TikTok", baseUrl: "https://tiktok.com/@" },
  ]

  const activeSocials = socialPlatforms.filter((platform) => profileData.social_links?.[platform.key])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Profile Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Profile Preview Card */}
        <div className="border rounded-lg p-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {profileData.avatar_url ? (
                <img
                  src={profileData.avatar_url || "/placeholder.svg"}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                profileData.full_name?.charAt(0) || profileData.username?.charAt(0) || "U"
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm">{profileData.full_name || profileData.username || "Your Name"}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">@{profileData.username || "username"}</p>
              <p className="text-xs mt-1 text-gray-700 dark:text-gray-300 line-clamp-2">
                {profileData.bio || "Add a bio to tell people about yourself..."}
              </p>
            </div>
          </div>

          {activeSocials.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-1">
                {activeSocials.slice(0, 4).map((platform) => (
                  <Badge key={platform.key} variant="secondary" className="text-xs">
                    {platform.name}
                  </Badge>
                ))}
                {activeSocials.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{activeSocials.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Share Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="flex-1"
            disabled={!profileData.username}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                Copy Link
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare} className="flex-1" disabled={!profileData.username}>
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
          {profileData.username && (
            <Button variant="outline" size="sm" asChild>
              <a href={`/${profileData.username}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>

        {!profileData.username && (
          <p className="text-xs text-gray-500 text-center">Choose a username to enable profile sharing</p>
        )}
      </CardContent>
    </Card>
  )
}
