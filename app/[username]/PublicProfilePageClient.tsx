"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CalendarDays,
  Linkedin,
  Github,
  Globe,
  Instagram,
  Youtube,
  MapPin,
  LinkIcon,
  Users,
  Heart,
  MessageCircle,
} from "lucide-react"
import type { Profile } from "@/app/actions/profile-actions"
import { uploadImageClient } from "@/lib/upload-client"

interface PublicProfile {
  id: string
  username: string
  displayName: string
  bio: string
  avatar: string
  banner: string
  location: string
  website: string
  joinedDate: string
  followerCount: number
  followingCount: number
  postCount: number
  isFollowing: boolean
}

interface PublicProfilePageClientProps {
  profile: Profile | null
}

export function PublicProfilePageClient() {
  const params = useParams()
  const username = params?.username as string
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("posts")
  const [showFriendsSection, setShowFriendsSection] = useState(false)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [showMoreDropdown, setShowMoreDropdown] = useState(false)

  // Add these state variables inside the component, after the existing useState declarations
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false)
  const [isCoverDialogOpen, setIsCoverDialogOpen] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    // Fetch public profile data
    const fetchProfile = async () => {
      try {
        // Mock data for now
        setProfile({
          id: "1",
          username: username,
          displayName: "John Doe",
          bio: "Digital freedom advocate and technology enthusiast. Building the future of decentralized communication.",
          avatar: "/placeholder.svg?height=120&width=120",
          banner: "/placeholder.svg?height=200&width=800",
          location: "Austin, TX",
          website: "https://johndoe.com",
          joinedDate: "2023-01-15",
          followerCount: 1234,
          followingCount: 567,
          postCount: 89,
          isFollowing: false,
        })
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchProfile()
    }
  }, [username])

  const handleFollow = () => {
    if (profile) {
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              isFollowing: !prev.isFollowing,
              followerCount: prev.isFollowing ? prev.followerCount - 1 : prev.followerCount + 1,
            }
          : null,
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-6">
          <Card>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-32 bg-muted rounded-lg"></div>
                <div className="flex items-center space-x-4">
                  <div className="h-24 w-24 bg-muted rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-6 bg-muted rounded w-48"></div>
                    <div className="h-4 bg-muted rounded w-32"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-6">
          <Card>
            <CardContent className="p-6 text-center">
              <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
              <p className="text-muted-foreground">The user @{username} could not be found.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Social media icon components
  const XIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )

  const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )

  const FacebookIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )

  const DiscordIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z" />
    </svg>
  )

  const TelegramIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )

  const RumbleIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.38 14.953c-.393 0-.707-.314-.707-.707s.314-.707.707-.707.707.314.707.707-.314.707-.707.707zm-2.76 0c-.393 0-.707-.314-.707-.707s.314-.707.707-.707.707.314.707.707-.314.707-.707.707zm5.52 0c-.393 0-.707-.314-.707-.707s.314-.707.707-.707.707.314.707.707-.314.707-.707.707zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6 14.246c0 .69-.56 1.25-1.25 1.25H7.25c-.69 0-1.25-.56-1.25-1.25V9.754c0-.69.56-1.25 1.25-1.25h9.5c.69 0 1.25.56 1.25 1.25v4.492z" />
    </svg>
  )

  const TheRealWorldIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  )

  const socialLinks = {}

  // Helper function to get the correct URL for social links
  const getSocialUrl = (platform: string, value: string) => {
    if (!value) return null

    // Clean the value by removing @ symbols and trimming
    const cleanValue = value.replace(/^@/, "").trim()

    switch (platform) {
      case "therealworld":
        // For The Real World, we don't return a URL since there's no public profile link
        return null
      case "x":
        return value.startsWith("http") ? value : `https://x.com/${cleanValue}`
      case "instagram":
        return value.startsWith("http") ? value : `https://instagram.com/${cleanValue}`
      case "youtube":
        return value.startsWith("http") ? value : `https://youtube.com/@${cleanValue}`
      case "tiktok":
        return value.startsWith("http") ? value : `https://tiktok.com/@${cleanValue}`
      case "facebook":
        return value.startsWith("http") ? value : `https://facebook.com/${cleanValue}`
      case "linkedin":
        return value.startsWith("http") ? value : `https://linkedin.com/in/${cleanValue}`
      case "github":
        return value.startsWith("http") ? value : `https://github.com/${cleanValue}`
      case "telegram":
        return value.startsWith("http") ? value : `https://t.me/${cleanValue}`
      case "rumble":
        return value.startsWith("http") ? value : `https://rumble.com/c/${cleanValue}`
      case "discord":
        // Discord doesn't have direct profile links, so we return null
        return null
      case "website":
        return value.startsWith("http") ? value : `https://${value}`
      default:
        return value.startsWith("http") ? value : `https://${value}`
    }
  }

  const socialPlatforms = [
    { key: "x", icon: XIcon, label: "X (Twitter)" },
    { key: "instagram", icon: Instagram, label: "Instagram" },
    { key: "youtube", icon: Youtube, label: "YouTube" },
    { key: "tiktok", icon: TikTokIcon, label: "TikTok" },
    { key: "facebook", icon: FacebookIcon, label: "Facebook" },
    { key: "linkedin", icon: Linkedin, label: "LinkedIn" },
    { key: "github", icon: Github, label: "GitHub" },
    { key: "telegram", icon: TelegramIcon, label: "Telegram" },
    { key: "rumble", icon: RumbleIcon, label: "Rumble" },
    { key: "website", icon: Globe, label: "Website" },
  ]

  // Special platforms that show but don't link
  const specialPlatforms = [
    { key: "discord", icon: DiscordIcon, label: "Discord" },
    { key: "therealworld", icon: TheRealWorldIcon, label: "The Real World" },
  ]

  // Get current location string
  const getCurrentLocation = () => {
    return profile?.location || null
  }

  // Generate a short bio from profile data
  const generateShortBio = () => {
    return profile?.bio || ""
  }

  // Add these functions inside the component, before the return statement
  const handleAvatarUpload = async (file: File) => {
    setIsUploading(true)
    setUploadError(null)

    try {
      const result = await uploadImageClient(file, "avatar")
      if (result.success) {
        // Close the dialog first
        setIsAvatarDialogOpen(false)
        // Refresh the page to show the new avatar
        router.refresh()
      } else {
        setUploadError(result.error || "Failed to upload avatar")
      }
    } catch (error) {
      setUploadError("An unexpected error occurred")
      console.error("Avatar upload error:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleCoverUpload = async (file: File) => {
    setIsUploading(true)
    setUploadError(null)

    try {
      const result = await uploadImageClient(file, "banner")
      if (result.success) {
        // Close the dialog first
        setIsCoverDialogOpen(false)
        // Refresh the page to show the new cover
        router.refresh()
      } else {
        setUploadError(result.error || "Failed to upload cover photo")
      }
    } catch (error) {
      setUploadError("An unexpected error occurred")
      console.error("Cover upload error:", error)
    } finally {
      setIsUploading(false)
    }
  }

  // Add these functions inside the component, before the return statement
  const handleScroll = (e: Event) => {
    const container = e.target as HTMLElement
    const scrollLeft = container.scrollLeft
    const maxScroll = container.scrollWidth - container.clientWidth

    setShowLeftArrow(scrollLeft > 0)
    setShowRightArrow(scrollRightArrow(container, maxScroll, scrollLeft)) // -1 for rounding issues
  }

  const scrollRightArrow = (container: HTMLElement, maxScroll: number, scrollLeft: number) => {
    return scrollLeft < maxScroll - 1
  }

  const scrollFriendsLeft = () => {
    const container = document.querySelector(".friends-scroll-container") as HTMLElement
    if (container) {
      const cardWidth = 175 + 8 // card width + gap
      const visibleCards = Math.floor(container.clientWidth / cardWidth)
      const scrollAmount = visibleCards * cardWidth
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" })
    }
  }

  const scrollFriendsRight = () => {
    const container = document.querySelector(".friends-scroll-container") as HTMLElement
    if (container) {
      const cardWidth = 175 + 8 // card width + gap
      const visibleCards = Math.floor(container.clientWidth / cardWidth)
      const scrollAmount = visibleCards * cardWidth
      container.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  // Add useEffect to set up scroll listener
  useEffect(() => {
    let container: HTMLElement | null = null

    const setupScrollListener = () => {
      container = document.querySelector(".friends-scroll-container")
      if (container) {
        container.addEventListener("scroll", handleScroll)
        // Initial check
        handleScroll({ target: container } as Event)
      }
    }

    if (showFriendsSection) {
      setupScrollListener()
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll)
      }
    }
  }, [showFriendsSection])

  const formatBioWithLinks = (text: string) => {
    if (!text) return ""

    // Regular expression to find URLs
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}[^\s]*)/gi

    // Split by URL matches and create an array of text and link elements
    const parts = []
    let lastIndex = 0
    let match

    // Create a new regex object each time to reset lastIndex
    const regex = new RegExp(urlRegex)

    while ((match = regex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index))
      }

      // Get the URL and ensure it has a protocol
      const url = match[0]
      const href = url.startsWith("http") ? url : `https://${url}`

      // Add the link element
      parts.push(
        <a
          key={match.index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {url}
        </a>,
      )

      lastIndex = match.index + match[0].length
    }

    // Add any remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }

    return parts
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              {/* Banner */}
              <div
                className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mb-4 bg-cover bg-center"
                style={{ backgroundImage: `url(${profile?.banner})` }}
              />

              {/* Avatar and Basic Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16 relative z-10">
                <Avatar className="h-24 w-24 border-4 border-background">
                  <AvatarImage src={profile?.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">{profile?.displayName?.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">{profile?.displayName}</h1>
                    <Badge variant="secondary">Member</Badge>
                  </div>
                  <p className="text-muted-foreground">@{profile?.username}</p>
                  {profile?.bio && <p className="text-sm max-w-2xl">{profile?.bio}</p>}

                  {/* Profile metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {profile?.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {profile?.location}
                      </div>
                    )}
                    {profile?.website && (
                      <div className="flex items-center gap-1">
                        <LinkIcon className="h-4 w-4" />
                        <a
                          href={profile?.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {profile?.website?.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      Joined{" "}
                      {new Date(profile?.joinedDate || Date.now().toString()).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{profile?.followingCount}</span>
                      <span className="text-muted-foreground">Following</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{profile?.followerCount}</span>
                      <span className="text-muted-foreground">Followers</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{profile?.postCount}</span>
                      <span className="text-muted-foreground">Posts</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button variant={profile?.isFollowing ? "outline" : "default"} size="sm" onClick={handleFollow}>
                    {profile?.isFollowing ? (
                      <>
                        <Users className="h-4 w-4 mr-2" />
                        Following
                      </>
                    ) : (
                      <>
                        <Heart className="h-4 w-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Content */}
        <Tabs defaultValue="posts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Posts</CardTitle>
                <CardDescription>Latest posts from @{profile?.username}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">No posts yet. Check back later!</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>About {profile?.displayName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile?.bio && (
                  <div>
                    <h4 className="font-medium mb-2">Bio</h4>
                    <p className="text-muted-foreground">{profile?.bio}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile?.location && (
                    <div>
                      <h4 className="font-medium mb-1">Location</h4>
                      <p className="text-muted-foreground">{profile?.location}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium mb-1">Joined</h4>
                    <p className="text-muted-foreground">
                      {new Date(profile?.joinedDate || Date.now().toString()).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Media</CardTitle>
                <CardDescription>Photos and videos shared by @{profile?.username}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">No media shared yet.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default PublicProfilePageClient
