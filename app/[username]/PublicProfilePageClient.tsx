"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import Link from "next/link"

interface ProfileData {
  username: string
  name: string
  email: string
  image: string | null
  bio: string | null
  location: string | null
  company: string | null
  social_links: {
    twitter?: string | null
    github?: string | null
    linkedin?: string | null
    website?: string | null
  } | null
  personal_info: {
    languages: string[] | null
  } | null
}

export function PublicProfilePageClient() {
  // Temporary debugging - add this at the top of the component function
  console.log("Profile component loading...")

  const { username } = useParams()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/profile/${username}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setProfile(data)
      } catch (error) {
        console.error("Could not fetch profile:", error)
        setProfile(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (username && typeof username === "string") {
      fetchProfile()
    }
  }, [username])

  useEffect(() => {
    console.log("Profile data:", profile)
    if (profile?.social_links) {
      console.log("Social links:", profile.social_links)
      Object.entries(profile.social_links).forEach(([key, value]) => {
        console.log(`Social link ${key}:`, typeof value, value)
      })
    }
    if (profile?.personal_info?.languages) {
      console.log("Languages:", typeof profile.personal_info.languages, profile.personal_info.languages)
    }
  }, [profile])

  if (isLoading) {
    return (
      <div className="container mx-auto mt-8 p-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="mt-4">
          <Skeleton className="h-4 w-[400px]" />
          <Skeleton className="h-4 w-[400px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto mt-8 p-4">
        <p>Profile not found.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="flex items-center space-x-4">
        <Avatar className="h-12 w-12">
          {profile.image ? (
            <AvatarImage src={profile.image || "/placeholder.svg"} alt={profile.name} />
          ) : (
            <AvatarFallback>{profile.name?.charAt(0).toUpperCase()}</AvatarFallback>
          )}
        </Avatar>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">{profile.name}</h2>
          <p className="text-gray-500">@{profile.username}</p>
        </div>
      </div>

      <div className="mt-4">
        {profile.bio && <p className="mb-2">{profile.bio}</p>}
        {profile.location && (
          <p className="text-gray-600">
            <Icons.location className="mr-2 inline-block h-4 w-4" />
            {profile.location}
          </p>
        )}
        {profile.company && (
          <p className="text-gray-600">
            <Icons.company className="mr-2 inline-block h-4 w-4" />
            {profile.company}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {profile?.personal_info?.languages &&
            profile.personal_info.languages.map((language) => <Badge key={language}>{language}</Badge>)}
        </div>

        <div className="mt-4 flex space-x-4">
          {profile?.social_links &&
            Object.entries(profile.social_links)
              .filter(([_, value]) => {
                console.log("Filtering social link:", typeof value, value)
                return value && typeof value === "string" && value.trim().length > 0
              })
              .map(([platform, username]) => {
                console.log("Processing social link:", platform, typeof username, username)
                let href = ""
                let icon = null

                switch (platform) {
                  case "twitter":
                    href = `https://twitter.com/${username}`
                    icon = <Icons.twitter className="h-4 w-4" />
                    break
                  case "github":
                    href = `https://github.com/${username}`
                    icon = <Icons.gitHub className="h-4 w-4" />
                    break
                  case "linkedin":
                    href = `https://linkedin.com/in/${username}`
                    icon = <Icons.linkedIn className="h-4 w-4" />
                    break
                  case "website":
                    href = username.startsWith("http") ? username : `https://${username}`
                    icon = <Icons.website className="h-4 w-4" />
                    break
                  default:
                    break
                }

                if (href && icon) {
                  return (
                    <Link
                      key={platform}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      {icon}
                    </Link>
                  )
                }
                return null
              })}
        </div>
      </div>
    </div>
  )
}
