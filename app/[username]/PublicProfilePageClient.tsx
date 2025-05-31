"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useTheme } from "@/components/theme-provider"

export interface Profile {
  id: string
  username: string
  full_name?: string
  avatar_url?: string
  website?: string
  bio?: string
  created_at: string
  updated_at: string
}

interface PublicProfilePageClientProps {
  profile: Profile
}

export function PublicProfilePageClient({ profile }: PublicProfilePageClientProps) {
  const { theme } = useTheme()
  const [isFollowing, setIsFollowing] = useState(false)

  const toggleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  return (
    <div className="container max-w-4xl py-8 px-4">
      <Link href="/">
        <Button
          variant="outline"
          className={`mb-6 ${theme === "dark" ? "bg-transparent text-white hover:bg-gray-800" : ""}`}
        >
          Back to Big Based
        </Button>
      </Link>

      <Card className="overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
          {/* Banner image would go here */}
        </div>

        <div className="relative px-6">
          <div className="absolute -top-16 left-6 rounded-full border-4 border-background overflow-hidden">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url || "/placeholder.svg"}
                alt={profile.username}
                width={128}
                height={128}
                className="h-32 w-32 object-cover"
              />
            ) : (
              <div className="h-32 w-32 bg-muted flex items-center justify-center">
                <span className="text-4xl font-bold text-muted-foreground">
                  {profile.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>

        <CardHeader className="pt-20">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{profile.full_name || profile.username}</h1>
              <p className="text-muted-foreground">@{profile.username}</p>
            </div>
            <Button onClick={toggleFollow} variant={isFollowing ? "outline" : "default"}>
              {isFollowing ? "Following" : "Follow"}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {profile.bio && <p className="mb-4">{profile.bio}</p>}

          {profile.website && (
            <p className="text-sm text-muted-foreground mb-4">
              <a
                href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {profile.website}
              </a>
            </p>
          )}

          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Add both named and default export for compatibility
export default PublicProfilePageClient
