"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MapPin,
  Calendar,
  Globe,
  Github,
  Linkedin,
  Instagram,
  Youtube,
  MessageCircle,
  Share2,
  Heart,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { uploadImageClient } from "@/lib/upload-client"

interface PublicProfileData {
  id: string
  username: string
  full_name: string | null
  bio: string | null
  avatar_url: string | null
  banner_url: string | null
  social_links: Record<string, any> | null
  location_info: Record<string, any> | null
  personal_info: Record<string, any> | null
  personal_details: Record<string, any> | null
  contact_info: Record<string, any> | null
  created_at: string
  updated_at: string
}

export function PublicProfilePageClient({ profile: initialProfile }: { profile?: PublicProfileData }) {
  const params = useParams()
  const username = params.username as string
  const [profile, setProfile] = useState<PublicProfileData | null>(initialProfile || null)
  const [isLoading, setIsLoading] = useState(!initialProfile)
  const [error, setError] = useState("")
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("posts")
  const [showFriendsSection, setShowFriendsSection] = useState(false)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [showMoreDropdown, setShowMoreDropdown] = useState(false)
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false)
  const [isCoverDialogOpen, setIsCoverDialogOpen] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const containerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!initialProfile && username) {
      loadPublicProfile()
    }
  }, [username, initialProfile])

  const loadPublicProfile = async () => {
    try {
      setIsLoading(true)
      setError("")

      console.log(`Fetching profile for username: ${username}`)
      const response = await fetch(`/api/user/${username}`)
      const data = await response.json()
      console.log("API response:", data)

      if (response.ok && data.success) {
        setProfile(data.profile)
      } else {
        setError(data.error || "Profile not found")
        console.error("Error from API:", data.error)
      }
    } catch (error) {
      console.error("Error loading public profile:", error)
      setError("An error occurred while loading the profile")
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name: string) => {
    if (!name || typeof name !== "string") return "??"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatJoinDate = (dateString: string) => {
    if (!dateString) return "Unknown"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
  }

  const getSocialLink = (platform: string, username: string) => {
    if (!platform || !username || typeof username !== "string") return "#"

    const socialPlatforms: { [key: string]: string } = {
      x: `https://x.com/${username}`,
      twitter: `https://twitter.com/${username}`,
      instagram: `https://instagram.com/${username}`,
      youtube: `https://youtube.com/@${username}`,
      linkedin: `https://linkedin.com/in/${username}`,
      github: `https://github.com/${username}`,
      tiktok: `https://tiktok.com/@${username}`,
      facebook: `https://facebook.com/${username}`,
      telegram: `https://t.me/${username}`,
      discord:
        typeof username === "string" && username.includes("discord.gg")
          ? username
          : `https://discord.com/users/${username}`,
      rumble: `https://rumble.com/c/${username}`,
      therealworld: `https://therealworld.ai/profile/${username}`,
    }

    return socialPlatforms[platform] || username
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

  const getSocialIcon = (platform: string) => {
    const iconProps = { className: "h-5 w-5" }
    switch (platform) {
      case "x":
      case "twitter":
        return <XIcon {...iconProps} />
      case "instagram":
        return <Instagram {...iconProps} />
      case "youtube":
        return <Youtube {...iconProps} />
      case "linkedin":
        return <Linkedin {...iconProps} />
      case "github":
        return <Github {...iconProps} />
      case "tiktok":
        return <TikTokIcon {...iconProps} />
      case "facebook":
        return <FacebookIcon {...iconProps} />
      case "discord":
        return <DiscordIcon {...iconProps} />
      case "telegram":
        return <TelegramIcon {...iconProps} />
      case "rumble":
        return <RumbleIcon {...iconProps} />
      case "therealworld":
        return <TheRealWorldIcon {...iconProps} />
      case "website":
        return <Globe {...iconProps} />
      default:
        return <ExternalLink {...iconProps} />
    }
  }

  // Helper function to get the correct URL for social links
  const getSocialUrl = (platform: string, value: string) => {
    if (!value || typeof value !== "string") return null

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

  const formatBioWithLinks = (text: string) => {
    if (!text || typeof text !== "string") return ""

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

  if (isLoading) {
    return (
      <div className="min-h-screen profile-page-bg">
        <div className="container mx-auto py-10">
          <Card className="profile-card-bg">
            <CardHeader>
              <CardTitle>Loading Profile...</CardTitle>
              <CardDescription>Please wait while we load the profile information.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen profile-page-bg">
        <div className="container mx-auto py-10">
          <Card className="profile-card-bg">
            <CardHeader>
              <CardTitle>Profile Not Found</CardTitle>
              <CardDescription>{error || "The requested profile could not be found."}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/">
                <Button>Return Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const socialLinks = profile?.social_links || {}
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
    if (!profile?.location_info) return null

    const parts = [
      profile?.location_info?.current_city,
      profile?.location_info?.current_state,
      profile?.location_info?.current_country,
    ].filter(Boolean)

    return parts.length > 0 ? parts.join(", ") : null
  }

  // Generate a short bio from profile data
  const generateShortBio = () => {
    const parts = []

    if (profile?.personal_details?.religious_views) {
      parts.push(profile?.personal_details.religious_views)
    }

    if (profile?.personal_details?.political_views) {
      parts.push(profile?.personal_details.political_views)
    }

    if (profile?.personal_info?.gender) {
      parts.push(profile?.personal_info.gender)
    }

    return parts.join(" · ")
  }

  return (
    <div className="min-h-screen profile-page-bg">
      <div className="container mx-auto py-4 space-y-8">
        {/* Profile Header */}
        <Card className="overflow-hidden profile-card-bg">
          <div className="relative">
            {/* Banner */}
            {profile.banner_url ? (
              <div
                className="h-32 md:h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${profile.banner_url})` }}
              />
            ) : (
              <div className="h-32 md:h-48 bg-gradient-to-r from-blue-500 to-purple-600" />
            )}
            <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
              <Avatar className="h-16 w-16 md:h-20 md:w-20 border-4 border-white shadow-lg">
                <AvatarImage
                  src={profile.avatar_url || "/placeholder.svg"}
                  alt={profile.full_name || profile.username}
                />
                <AvatarFallback className="text-lg md:text-xl">
                  {getInitials(profile.full_name || profile.username)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <CardHeader className="pt-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{profile.full_name || profile.username}</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription className="text-base">@{profile.username}</CardDescription>
              {profile.bio && <p className="text-sm mt-2">{profile.bio}</p>}
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                {profile.location_info?.current_city && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {profile.location_info.current_city}
                      {profile.location_info.current_state && `, ${profile.location_info.current_state}`}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formatJoinDate(profile.created_at)}</span>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            {profile.personal_details?.about_me && (
              <Card className="profile-card-bg">
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{profile.personal_details.about_me}</p>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            <Card className="profile-card-bg">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">Joined Big Based</p>
                      <p className="text-xs text-muted-foreground">{formatJoinDate(profile.created_at)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Social Links */}
            {profile.social_links &&
              Object.keys(profile.social_links).some((key) => profile.social_links && profile.social_links[key]) && (
                <Card className="profile-card-bg">
                  <CardHeader>
                    <CardTitle className="text-lg">Connect</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(profile.social_links)
                        .filter(([_, value]) => value && typeof value === "string")
                        .map(([platform, username]) => (
                          <a
                            key={platform}
                            href={getSocialLink(platform, username as string)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            {getSocialIcon(platform)}
                            <span className="text-sm capitalize">{platform}</span>
                            <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
                          </a>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Personal Info */}
            <Card className="profile-card-bg">
              <CardHeader>
                <CardTitle className="text-lg">Personal Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.personal_info?.birthday && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Birthday</span>
                    <span className="text-sm">
                      {new Date(profile.personal_info.birthday).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
                {profile.personal_info?.gender && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Gender</span>
                    <span className="text-sm capitalize">{profile.personal_info.gender}</span>
                  </div>
                )}
                {profile.personal_details?.relationship_status && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Relationship</span>
                    <span className="text-sm capitalize">
                      {typeof profile.personal_details.relationship_status === "string"
                        ? profile.personal_details.relationship_status.replace("_", " ")
                        : profile.personal_details.relationship_status}
                    </span>
                  </div>
                )}
                {profile.personal_details?.political_views && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Political Views</span>
                    <span className="text-sm capitalize">{profile.personal_details.political_views}</span>
                  </div>
                )}
                {profile.personal_details?.religious_views && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Religious Views</span>
                    <span className="text-sm capitalize">{profile.personal_details.religious_views}</span>
                  </div>
                )}
                {profile.personal_info?.languages &&
                  Array.isArray(profile.personal_info.languages) &&
                  profile.personal_info.languages.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Languages</span>
                      <span className="text-sm">{profile.personal_info.languages.join(", ")}</span>
                    </div>
                  )}
              </CardContent>
            </Card>

            {/* Profile Stats */}
            <Card className="profile-card-bg">
              <CardHeader>
                <CardTitle className="text-lg">Profile Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Profile Views</span>
                  <span className="font-medium">42 this month</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Connections</span>
                  <span className="font-medium">18 total</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="font-medium">{formatJoinDate(profile.created_at)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
