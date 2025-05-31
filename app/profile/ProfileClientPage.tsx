"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  getCurrentUserProfile,
  updateCurrentUserProfile,
  checkUsernameAvailability,
} from "@/app/actions/profile-actions"
import {
  User,
  Shield,
  Bell,
  CreditCard,
  RefreshCw,
  Linkedin,
  Github,
  Globe,
  Instagram,
  Youtube,
  Home,
  Key,
} from "lucide-react"
import { AvatarUpload } from "@/components/avatar-upload"
import { InteractiveBannerUpload } from "@/components/interactive-banner-upload"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { ProfileCompletionWizard } from "@/components/profile-completion-wizard"
import { SocialMediaPreview } from "@/components/social-media-preview"
import { ProfileInsights } from "@/components/profile-insights"

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
    personal_info: {
      nickname: "",
      birthday: "",
      gender: "",
      languages: [],
    },
    location: {
      current_city: "",
      current_state: "",
      current_country: "",
      hometown: "",
    },
    contact_info: {
      phone: "",
      alt_email: "",
    },
    personal_details: {
      about_me: "",
      relationship_status: "",
      political_views: "",
      religious_views: "",
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
          personal_info: {
            nickname: profileData.personal_info?.nickname || "",
            birthday: profileData.personal_info?.birthday || "",
            gender: profileData.personal_info?.gender || "",
            languages: profileData.personal_info?.languages || [],
          },
          location: {
            current_city: profileData.location_info?.current_city || "",
            current_state: profileData.location_info?.current_state || "",
            current_country: profileData.location_info?.current_country || "",
            hometown: profileData.location_info?.hometown || "",
          },
          contact_info: {
            phone: profileData.contact_info?.phone || "",
            alt_email: profileData.contact_info?.alt_email || "",
          },
          personal_details: {
            about_me: profileData.personal_details?.about_me || "",
            relationship_status: profileData.personal_details?.relationship_status || "",
            political_views: profileData.personal_details?.political_views || "",
            religious_views: profileData.personal_details?.religious_views || "",
          },
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
          personal_info: {
            nickname: "",
            birthday: "",
            gender: "",
            languages: [],
          },
          location: {
            current_city: "",
            current_state: "",
            current_country: "",
            hometown: "",
          },
          contact_info: {
            phone: "",
            alt_email: "",
          },
          personal_details: {
            about_me: "",
            relationship_status: "",
            political_views: "",
            religious_views: "",
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

  const handleSuggestionClick = (field: string) => {
    // Scroll to the relevant field and focus it
    const fieldMap: { [key: string]: string } = {
      username: "username",
      full_name: "full_name",
      bio: "bio",
      avatar: "avatar",
      banner: "banner",
      social: "x", // Focus on first social field
    }

    const elementId = fieldMap[field]
    if (elementId) {
      const element = document.getElementById(elementId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
        element.focus()
      }
    }
  }

  // Debounced username check
  const checkUsername = async (username: string) => {
    if (!username || username === usernameStatus.originalUsername) {
      setUsernameStatus((prev) => ({ ...prev, checking: false, available: null, error: null }))
      return
    }

    setUsernameStatus((prev) => ({ ...prev, checking: true, error: null }))

    try {
      const result = await checkUsernameAvailability(username, user?.id)
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
  }, [formData.username, usernameStatus.originalUsername, user?.id])

  if (isLoading || !user) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Loading Profile...</CardTitle>
            <CardDescription>Please wait while we load your profile information.</CardDescription>
          </CardHeader>
        </Card>
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

  const isUsernameValid = () => {
    if (formData.username === usernameStatus.originalUsername) {
      return true // Current username is always valid
    }
    return usernameStatus.available === true && !usernameStatus.error && !usernameStatus.checking
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-4 space-y-8">
        {/* Debug Info */}
        {process.env.NODE_ENV === "development" && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-sm">Debug Info</CardTitle>
            </CardHeader>
            <CardContent className="text-xs">
              <p>User ID: {user?.id}</p>
              <p>User Email: {user?.email}</p>
              <p>Profile Loaded: {profile ? "Yes" : "No"}</p>
              <p>Loading Profile: {isLoadingProfile ? "Yes" : "No"}</p>
              {loadError && <p className="text-red-600">Load Error: {loadError}</p>}
              <Button size="sm" variant="outline" onClick={loadProfile} className="mt-2" disabled={isLoadingProfile}>
                <RefreshCw className={`h-3 w-3 mr-1 ${isLoadingProfile ? "animate-spin" : ""}`} />
                Reload Profile
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Profile Header with Banner Preview */}
        <Card className="overflow-hidden">
          <div className="relative">
            {/* Banner */}
            <InteractiveBannerUpload
              currentBannerUrl={formData.banner_url}
              onBannerChange={(newUrl) => handleInputChange("banner_url", newUrl)}
              bannerPosition={formData.banner_position}
              onPositionChange={(position) => handleInputChange("banner_position", position)}
              className="h-32 md:h-48"
            />
            <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
              <AvatarUpload
                currentAvatarUrl={formData.avatar_url}
                onAvatarChange={(newUrl) => {
                  console.log("Avatar changed to:", newUrl)
                  handleInputChange("avatar_url", newUrl)
                }}
                userInitials={getInitials(formData.full_name || formData.username || user.email || "U")}
                className="h-16 w-16 md:h-20 md:w-20 border-4 border-white shadow-lg"
              />
            </div>
          </div>
          <CardHeader className="pt-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{formData.full_name || formData.username || "User"}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Link href="/">
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <Home className="h-4 w-4" />
                      <span>Back to Big Based</span>
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </div>
              </div>
              <CardDescription className="text-base">{user.email}</CardDescription>
              {formData.username && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Public profile:</span>
                  <a
                    href={`/${formData.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    bigbased.com/{formData.username}
                  </a>
                </div>
              )}
              {profile && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Member since {new Date(profile.created_at).toLocaleDateString()}</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue={initialTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>General</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Billing</span>
            </TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Profile Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your profile information and personal details.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingProfile ? (
                      <div className="flex items-center justify-center py-8">
                        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                        Loading profile data...
                      </div>
                    ) : (
                      <form onSubmit={handleSaveProfile} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" value={user.email || ""} disabled />
                            <p className="text-sm text-muted-foreground">Your email address cannot be changed.</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                              id="username"
                              value={formData.username}
                              onChange={(e) => handleInputChange("username", e.target.value)}
                              placeholder="Choose a username"
                              className={
                                usernameStatus.error
                                  ? "border-red-500 focus:border-red-500"
                                  : usernameStatus.available === true &&
                                      formData.username !== usernameStatus.originalUsername
                                    ? "border-green-500 focus:border-green-500"
                                    : ""
                              }
                            />
                            {usernameStatus.checking && (
                              <p className="text-sm text-blue-600 flex items-center">
                                <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                                Checking availability...
                              </p>
                            )}
                            {usernameStatus.error && <p className="text-sm text-red-600">{usernameStatus.error}</p>}
                            {usernameStatus.available === true &&
                              formData.username !== usernameStatus.originalUsername && (
                                <p className="text-sm text-green-600">✓ Username is available</p>
                              )}
                            {usernameStatus.available === false && !usernameStatus.error && (
                              <p className="text-sm text-red-600">✗ Username is already taken</p>
                            )}
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input
                              id="full_name"
                              value={formData.full_name}
                              onChange={(e) => handleInputChange("full_name", e.target.value)}
                              placeholder="Your full name"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={formData.bio}
                            onChange={(e) => handleInputChange("bio", e.target.value)}
                            placeholder="Tell us about yourself..."
                            rows={4}
                          />
                        </div>

                        {/* Social Links Section */}
                        <div className="space-y-4">
                          <Label className="text-base font-medium">Social Links</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Primary Social Platforms */}
                            <div className="space-y-2">
                              <Label htmlFor="x" className="flex items-center space-x-2">
                                <XIcon className="h-4 w-4" />
                                <span>X (Twitter)</span>
                              </Label>
                              <Input
                                id="x"
                                value={formData.social_links.x}
                                onChange={(e) => handleSocialLinkChange("x", e.target.value)}
                                placeholder="username"
                              />
                              <p className="text-xs text-muted-foreground">
                                Just enter your username, we'll create the link automatically
                              </p>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="instagram" className="flex items-center space-x-2">
                                <Instagram className="h-4 w-4" />
                                <span>Instagram</span>
                              </Label>
                              <Input
                                id="instagram"
                                value={formData.social_links.instagram}
                                onChange={(e) => handleSocialLinkChange("instagram", e.target.value)}
                                placeholder="username"
                              />
                              <p className="text-xs text-muted-foreground">
                                Just enter your username, we'll create the link automatically
                              </p>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="youtube" className="flex items-center space-x-2">
                                <Youtube className="h-4 w-4" />
                                <span>YouTube</span>
                              </Label>
                              <Input
                                id="youtube"
                                value={formData.social_links.youtube}
                                onChange={(e) => handleSocialLinkChange("youtube", e.target.value)}
                                placeholder="username"
                              />
                              <p className="text-xs text-muted-foreground">
                                Just enter your username, we'll create the link automatically
                              </p>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="tiktok" className="flex items-center space-x-2">
                                <TikTokIcon className="h-4 w-4" />
                                <span>TikTok</span>
                              </Label>
                              <Input
                                id="tiktok"
                                value={formData.social_links.tiktok}
                                onChange={(e) => handleSocialLinkChange("tiktok", e.target.value)}
                                placeholder="username"
                              />
                              <p className="text-xs text-muted-foreground">
                                Just enter your username, we'll create the link automatically
                              </p>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="facebook" className="flex items-center space-x-2">
                                <FacebookIcon className="h-4 w-4" />
                                <span>Facebook</span>
                              </Label>
                              <Input
                                id="facebook"
                                value={formData.social_links.facebook}
                                onChange={(e) => handleSocialLinkChange("facebook", e.target.value)}
                                placeholder="username"
                              />
                              <p className="text-xs text-muted-foreground">
                                Just enter your username, we'll create the link automatically
                              </p>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="rumble" className="flex items-center space-x-2">
                                <RumbleIcon className="h-4 w-4" />
                                <span>Rumble</span>
                              </Label>
                              <Input
                                id="rumble"
                                value={formData.social_links.rumble}
                                onChange={(e) => handleSocialLinkChange("rumble", e.target.value)}
                                placeholder="username"
                              />
                              <p className="text-xs text-muted-foreground">
                                Just enter your username, we'll create the link automatically
                              </p>
                            </div>

                            {/* Professional Platforms */}
                            <div className="space-y-2">
                              <Label htmlFor="linkedin" className="flex items-center space-x-2">
                                <Linkedin className="h-4 w-4" />
                                <span>LinkedIn</span>
                              </Label>
                              <Input
                                id="linkedin"
                                value={formData.social_links.linkedin}
                                onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                                placeholder="username"
                              />
                              <p className="text-xs text-muted-foreground">
                                Just enter your username, we'll create the link automatically
                              </p>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="github" className="flex items-center space-x-2">
                                <Github className="h-4 w-4" />
                                <span>GitHub</span>
                              </Label>
                              <Input
                                id="github"
                                value={formData.social_links.github}
                                onChange={(e) => handleSocialLinkChange("github", e.target.value)}
                                placeholder="username"
                              />
                              <p className="text-xs text-muted-foreground">
                                Just enter your username, we'll create the link automatically
                              </p>
                            </div>

                            {/* Communication Platforms */}
                            <div className="space-y-2">
                              <Label htmlFor="telegram" className="flex items-center space-x-2">
                                <TelegramIcon className="h-4 w-4" />
                                <span>Telegram</span>
                              </Label>
                              <Input
                                id="telegram"
                                value={formData.social_links.telegram}
                                onChange={(e) => handleSocialLinkChange("telegram", e.target.value)}
                                placeholder="username"
                              />
                              <p className="text-xs text-muted-foreground">
                                Just enter your username, we'll create the link automatically
                              </p>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="discord" className="flex items-center space-x-2">
                                <DiscordIcon className="h-4 w-4" />
                                <span>Discord</span>
                              </Label>
                              <Input
                                id="discord"
                                value={formData.social_links.discord}
                                onChange={(e) => handleSocialLinkChange("discord", e.target.value)}
                                placeholder="username#1234 or discord.gg/invite"
                              />
                            </div>

                            {/* Special Platforms */}
                            <div className="space-y-2">
                              <Label htmlFor="therealworld" className="flex items-center space-x-2">
                                <TheRealWorldIcon className="h-4 w-4" />
                                <span>The Real World</span>
                                <button
                                  type="button"
                                  className="ml-1 text-xs text-blue-600 hover:text-blue-800"
                                  onClick={() =>
                                    alert(
                                      "The Real World is Andrew Tate's exclusive community platform for entrepreneurs and high-achievers. Members get access to courses, networking, and mentorship opportunities.",
                                    )
                                  }
                                >
                                  (what's this?)
                                </button>
                              </Label>
                              <Input
                                id="therealworld"
                                value={formData.social_links.therealworld}
                                onChange={(e) => handleSocialLinkChange("therealworld", e.target.value)}
                                placeholder="username"
                              />
                              <p className="text-xs text-muted-foreground">
                                Just enter your username - this will show on your profile for networking
                              </p>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="website" className="flex items-center space-x-2">
                                <Globe className="h-4 w-4" />
                                <span>Website</span>
                              </Label>
                              <Input
                                id="website"
                                value={formData.social_links.website}
                                onChange={(e) => handleSocialLinkChange("website", e.target.value)}
                                placeholder="https://yoursite.com"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Extended Profile Information */}
                        <Separator className="my-6" />

                        {/* Personal Information Section */}
                        <div className="space-y-4">
                          <Label className="text-base font-medium">Personal Information</Label>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="nickname">Nickname</Label>
                              <Input
                                id="nickname"
                                value={formData.personal_info?.nickname || ""}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    personal_info: { ...prev.personal_info, nickname: e.target.value },
                                  }))
                                }
                                placeholder="What do friends call you?"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="birthday">Birthday</Label>
                              <Input
                                id="birthday"
                                type="date"
                                value={formData.personal_info?.birthday || ""}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    personal_info: { ...prev.personal_info, birthday: e.target.value },
                                  }))
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="gender">Gender</Label>
                              <select
                                id="gender"
                                value={formData.personal_info?.gender || ""}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    personal_info: { ...prev.personal_info, gender: e.target.value },
                                  }))
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="non-binary">Non-binary</option>
                                <option value="prefer-not-to-say">Prefer not to say</option>
                              </select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="languages">Languages (comma separated)</Label>
                              <Input
                                id="languages"
                                value={formData.personal_info?.languages?.join(", ") || ""}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    personal_info: {
                                      ...prev.personal_info,
                                      languages: e.target.value
                                        .split(",")
                                        .map((lang) => lang.trim())
                                        .filter(Boolean),
                                    },
                                  }))
                                }
                                placeholder="English, Spanish, French"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Location Information */}
                        <div className="space-y-4">
                          <Label className="text-base font-medium">Location</Label>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="current_city">Current City</Label>
                              <Input
                                id="current_city"
                                value={formData.location?.current_city || ""}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    location: { ...prev.location, current_city: e.target.value },
                                  }))
                                }
                                placeholder="New York"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="current_state">Current State/Province</Label>
                              <Input
                                id="current_state"
                                value={formData.location?.current_state || ""}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    location: { ...prev.location, current_state: e.target.value },
                                  }))
                                }
                                placeholder="NY"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="current_country">Current Country</Label>
                              <Input
                                id="current_country"
                                value={formData.location?.current_country || ""}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    location: { ...prev.location, current_country: e.target.value },
                                  }))
                                }
                                placeholder="United States"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="hometown">Hometown</Label>
                              <Input
                                id="hometown"
                                value={formData.location?.hometown || ""}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    location: { ...prev.location, hometown: e.target.value },
                                  }))
                                }
                                placeholder="Where you grew up"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4">
                          <Label className="text-base font-medium">Contact Information</Label>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input
                                id="phone"
                                value={formData.contact_info?.phone || ""}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    contact_info: { ...prev.contact_info, phone: e.target.value },
                                  }))
                                }
                                placeholder="+1 (555) 123-4567"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="alt_email">Alternative Email</Label>
                              <Input
                                id="alt_email"
                                type="email"
                                value={formData.contact_info?.alt_email || ""}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    contact_info: { ...prev.contact_info, alt_email: e.target.value },
                                  }))
                                }
                                placeholder="alternative@email.com"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Personal Details */}
                        <div className="space-y-4">
                          <Label className="text-base font-medium">Personal Details</Label>

                          <div className="space-y-2">
                            <Label htmlFor="about_me">About Me</Label>
                            <Textarea
                              id="about_me"
                              value={formData.personal_details?.about_me || ""}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  personal_details: { ...prev.personal_details, about_me: e.target.value },
                                }))
                              }
                              placeholder="Tell us more about yourself, your interests, goals, and what makes you unique..."
                              rows={4}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="relationship_status">Relationship Status</Label>
                              <select
                                id="relationship_status"
                                value={formData.personal_details?.relationship_status || ""}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    personal_details: { ...prev.personal_details, relationship_status: e.target.value },
                                  }))
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <option value="">Select status</option>
                                <option value="single">Single</option>
                                <option value="in_relationship">In a relationship</option>
                                <option value="engaged">Engaged</option>
                                <option value="married">Married</option>
                                <option value="divorced">Divorced</option>
                                <option value="widowed">Widowed</option>
                                <option value="complicated">It's complicated</option>
                              </select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="political_views">Political Views</Label>
                              <select
                                id="political_views"
                                value={formData.personal_details?.political_views || ""}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    personal_details: { ...prev.personal_details, political_views: e.target.value },
                                  }))
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <option value="">Select views</option>
                                <option value="conservative">Conservative</option>
                                <option value="liberal">Liberal</option>
                                <option value="libertarian">Libertarian</option>
                                <option value="moderate">Moderate</option>
                                <option value="progressive">Progressive</option>
                                <option value="independent">Independent</option>
                                <option value="other">Other</option>
                              </select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="religious_views">Religious Views</Label>
                              <select
                                id="religious_views"
                                value={formData.personal_details?.religious_views || ""}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    personal_details: { ...prev.personal_details, religious_views: e.target.value },
                                  }))
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <option value="">Select views</option>
                                <option value="christian">Christian</option>
                                <option value="catholic">Catholic</option>
                                <option value="protestant">Protestant</option>
                                <option value="orthodox">Orthodox</option>
                                <option value="jewish">Jewish</option>
                                <option value="muslim">Muslim</option>
                                <option value="hindu">Hindu</option>
                                <option value="buddhist">Buddhist</option>
                                <option value="spiritual">Spiritual</option>
                                <option value="agnostic">Agnostic</option>
                                <option value="atheist">Atheist</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {saveMessage && (
                          <div
                            className={`p-3 rounded-md text-sm ${
                              saveMessage.includes("Error")
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-green-50 text-green-700 border border-green-200"
                            }`}
                          >
                            {saveMessage}
                          </div>
                        )}

                        {loadError && (
                          <div className="p-3 rounded-md text-sm bg-yellow-50 text-yellow-700 border border-yellow-200">
                            {loadError}
                          </div>
                        )}

                        <div className="flex justify-end">
                          <Button type="submit" disabled={isSaving || !isUsernameValid()}>
                            {isSaving ? "Saving..." : "Save Changes"}
                          </Button>
                        </div>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Profile Completion Wizard */}
                <ProfileCompletionWizard profileData={formData} onSuggestionClick={handleSuggestionClick} />

                {/* Social Media Preview */}
                <SocialMediaPreview profileData={formData} />

                {/* Profile Insights */}
                {profile && <ProfileInsights profileData={profile} />}

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 dark:text-gray-100">{activity.description}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTimeAgo(activity.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Profile Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Profile Views</span>
                      <span className="font-medium">127 this month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Connections</span>
                      <span className="font-medium">34 total</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Social Clicks</span>
                      <span className="font-medium">45 this week</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-gray-600 dark:text-gray-400">Theme</span>
                      <ThemeToggle />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and authentication methods.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {/* Two-Factor Authentication */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Two-Factor Authentication
                      </h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Link href="/profile/security/two-factor">
                      <Button variant="outline">Manage 2FA</Button>
                    </Link>
                  </div>

                  <Separator />

                  {/* Change Password */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        Password
                      </h4>
                      <p className="text-sm text-muted-foreground">Update your password to keep your account secure</p>
                    </div>
                    <Link href="/profile/security/change-password">
                      <Button variant="outline">Change Password</Button>
                    </Link>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Active Sessions</h4>
                      <p className="text-sm text-muted-foreground">Manage your active login sessions</p>
                    </div>
                    <Link href="/profile/security/sessions">
                      <Button variant="outline">View Sessions</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified about activity.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Link href="/profile/notifications/email">
                      <Button variant="outline">Configure</Button>
                    </Link>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Push Notifications</h4>
                      <p className="text-sm text-muted-foreground">Get instant notifications on your devices</p>
                    </div>
                    <Link href="/profile/notifications/push">
                      <Button variant="outline">Configure</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
                <CardDescription>Manage your subscription and billing information.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Current Plan</h4>
                      <p className="text-sm text-muted-foreground">Free Plan - No active subscription</p>
                    </div>
                    <Button>Upgrade Plan</Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Payment Methods</h4>
                      <p className="text-sm text-muted-foreground">No payment methods on file</p>
                    </div>
                    <Link href="/profile/billing">
                      <Button variant="outline">Add Payment Method</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
