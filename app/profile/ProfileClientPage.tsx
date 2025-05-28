"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  getCurrentUserProfile,
  updateCurrentUserProfile,
  checkUsernameAvailability,
} from "@/app/actions/profile-actions"
import { Linkedin, Github, Globe, Instagram, Youtube, Home } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

interface ProfileData {
  id: string
  username: string
  full_name: string
  bio: string
  avatar_url: string
  banner_url: string
  social_links: any
  created_at: string
  updated_at: string
}

export default function ProfileClientPage() {
  const { user, isLoading, signOut } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [loadError, setLoadError] = useState("")
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null)

  // Get initial tab from URL parameter
  const initialTab = searchParams.get("tab") || "general"

  // Form states
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    bio: "",
    avatar_url: "",
    banner_url: "",
    banner_position: "center",
    social_links: {
      x: "",
      linkedin: "",
      github: "",
      website: "",
      instagram: "",
      youtube: "",
      telegram: "",
      discord: "",
      tiktok: "",
      facebook: "",
      therealworld: "",
      rumble: "",
    },
  })

  const [usernameStatus, setUsernameStatus] = useState<{
    checking: boolean
    available: boolean | null
    error: string | null
    originalUsername: string
  }>({
    checking: false,
    available: null,
    error: null,
    originalUsername: "",
  })

  // Activity state
  const [activities] = useState([
    {
      id: 1,
      type: "profile_update",
      description: "Updated profile information",
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      type: "joined",
      description: "Joined Big Based",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ])

  useEffect(() => {
    if (!isLoading && !user) {
      console.log("No user found, redirecting to sign in")
      router.push("/auth/sign-in?redirect=/profile")
    }
  }, [isLoading, user, router])

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    try {
      setIsLoadingProfile(true)
      setLoadError("")
      console.log("Loading profile for user:", user?.id)

      const profileData = await getCurrentUserProfile()
      console.log("Profile data received:", profileData)

      if (profileData) {
        setProfile(profileData)
        const defaultSocialLinks = {
          x: "",
          linkedin: "",
          github: "",
          website: "",
          instagram: "",
          youtube: "",
          telegram: "",
          discord: "",
          tiktok: "",
          facebook: "",
          therealworld: "",
          rumble: "",
        }

        setFormData({
          username: profileData.username || "",
          full_name: profileData.full_name || "",
          bio: profileData.bio || "",
          avatar_url: profileData.avatar_url || "",
          banner_url: profileData.banner_url || "",
          banner_position: profileData.banner_position || "center",
          social_links: { ...defaultSocialLinks, ...(profileData.social_links || {}) },
        })
        setUsernameStatus((prev) => ({
          ...prev,
          originalUsername: profileData?.username || user?.email?.split("@")[0] || "",
        }))
      } else {
        setLoadError("Failed to load profile data")
        // Set default form data if no profile exists
        const defaultUsername = user?.email?.split("@")[0] || ""
        setFormData({
          username: defaultUsername,
          full_name: "",
          bio: "",
          avatar_url: "",
          banner_url: "",
          banner_position: "center",
          social_links: {
            x: "",
            linkedin: "",
            github: "",
            website: "",
            instagram: "",
            youtube: "",
            telegram: "",
            discord: "",
            tiktok: "",
            facebook: "",
            therealworld: "",
            rumble: "",
          },
        })
        setUsernameStatus((prev) => ({
          ...prev,
          originalUsername: defaultUsername,
        }))
      }
    } catch (error) {
      console.error("Error loading profile:", error)
      setLoadError("An error occurred while loading your profile")
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value,
      },
    }))
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveMessage("")

    try {
      console.log("Saving profile with data:", formData)
      console.log("Current user:", user?.id)

      const result = await updateCurrentUserProfile(formData)
      console.log("Save result:", result)

      if (result.success) {
        setSaveMessage("Profile updated successfully!")
        // Reload the profile data to reflect changes
        await loadProfile()
      } else {
        setSaveMessage(`Error: ${result.error}`)
        if (result.debug) {
          console.log("Debug info:", result.debug)
        }
      }
    } catch (error) {
      setSaveMessage("An unexpected error occurred")
      console.error("Error saving profile:", error)
    } finally {
      setIsSaving(false)
      // Clear message after 5 seconds
      setTimeout(() => setSaveMessage(""), 5000)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  // Debounced username check
  const checkUsername = async (username: string) => {
    if (!username || username === usernameStatus.originalUsername) {
      setUsernameStatus((prev) => ({ ...prev, checking: false, available: null, error: null }))
      return
    }

    setUsernameStatus((prev) => ({ ...prev, checking: true, error: null }))

    try {
      const result = await checkUsernameAvailability(username, user.id)
      setUsernameStatus((prev) => ({
        ...prev,
        checking: false,
        available: result.available,
        error: result.error || null,
      }))
    } catch (error) {
      setUsernameStatus((prev) => ({
        ...prev,
        checking: false,
        available: false,
        error: "Error checking username availability",
      }))
    }
  }

  // Debounce the username check
  useEffect(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current)
    }

    timeoutIdRef.current = setTimeout(() => {
      if (formData.username && formData.username.length >= 3) {
        checkUsername(formData.username)
      } else if (formData.username && formData.username.length > 0) {
        setUsernameStatus((prev) => ({
          ...prev,
          checking: false,
          available: false,
          error: "Username must be at least 3 characters long",
        }))
      } else {
        setUsernameStatus((prev) => ({
          ...prev,
          checking: false,
          available: null,
          error: null,
        }))
      }
    }, 500)

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current)
      }
    }
  }, [formData.username, usernameStatus.originalUsername, user.id])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return time.toLocaleDateString()
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

  const socialLinks = profile?.social_links || {}

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-4 space-y-8">
        {/* Profile Header with Banner */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="pt-4 pb-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {profile?.full_name || profile?.username}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Link href="/">
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <Home className="h-4 w-4" />
                      <span>Back to Big Based</span>
                    </Button>
                  </Link>
                  <ThemeToggle />
                </div>
              </div>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
                @{profile?.username}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
