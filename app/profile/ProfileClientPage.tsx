"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  getCurrentUserProfile,
  updateCurrentUserProfile,
  checkUsernameAvailability,
} from "@/app/actions/profile-actions"
import { User, Shield, Bell, CreditCard, RefreshCw, Home, Key, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { AvatarUpload } from "@/components/avatar-upload"
import { InteractiveBannerUpload } from "@/components/interactive-banner-upload"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { ProfileCompletionWizard } from "@/components/profile-completion-wizard"
import { SocialMediaPreview } from "@/components/social-media-preview"
import { ProfileInsights } from "@/components/profile-insights"
// import { ExpandedProfileForm } from "@/components/expanded-profile-form"

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

  // Form states - simplified to match actual database schema
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    bio: "",
    avatar_url: "",
    banner_url: "",
    banner_position: "center",
    website: "",
    location: "",
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
          website: profileData.website || "",
          location: profileData.location || "",
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
          website: "",
          location: "",
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
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Profile Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Profile Information</CardTitle>
                    <CardDescription>Update your basic profile information and social links.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      {/* Username */}
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <div className="relative">
                          <Input
                            id="username"
                            value={formData.username}
                            onChange={(e) => handleInputChange("username", e.target.value)}
                            placeholder="Your unique username"
                            className={`pr-10 ${
                              usernameStatus.error
                                ? "border-red-500"
                                : usernameStatus.available === true
                                  ? "border-green-500"
                                  : ""
                            }`}
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {usernameStatus.checking && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                            {!usernameStatus.checking && usernameStatus.available === true && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                            {!usernameStatus.checking && usernameStatus.error && (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </div>
                        {usernameStatus.error && <p className="text-sm text-red-600">{usernameStatus.error}</p>}
                        {usernameStatus.available === true && formData.username !== usernameStatus.originalUsername && (
                          <p className="text-sm text-green-600">Username is available!</p>
                        )}
                      </div>

                      {/* Full Name */}
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) => handleInputChange("full_name", e.target.value)}
                          placeholder="Your full name"
                        />
                      </div>

                      {/* Bio */}
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => handleInputChange("bio", e.target.value)}
                          placeholder="Tell people about yourself..."
                          rows={4}
                        />
                      </div>

                      {/* Website */}
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={formData.website}
                          onChange={(e) => handleInputChange("website", e.target.value)}
                          placeholder="https://yourwebsite.com"
                        />
                      </div>

                      {/* Location */}
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          placeholder="City, State/Country"
                        />
                      </div>

                      {/* Social Links */}
                      <div className="space-y-4">
                        <h4 className="font-medium">Social Links</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Enter just your username (without @ or full URL). We'll create the proper links automatically.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="x">X (Twitter)</Label>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-800 dark:border-gray-600">
                                <XIcon className="h-4 w-4" />
                              </span>
                              <Input
                                id="x"
                                value={formData.social_links.x}
                                onChange={(e) => handleSocialLinkChange("x", e.target.value)}
                                placeholder="username"
                                className="rounded-l-none"
                              />
                            </div>
                            <p className="text-xs text-gray-500">Will link to: x.com/username</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="instagram">Instagram</Label>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-800 dark:border-gray-600">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                              </span>
                              <Input
                                id="instagram"
                                value={formData.social_links.instagram}
                                onChange={(e) => handleSocialLinkChange("instagram", e.target.value)}
                                placeholder="username"
                                className="rounded-l-none"
                              />
                            </div>
                            <p className="text-xs text-gray-500">Will link to: instagram.com/username</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="youtube">YouTube</Label>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-800 dark:border-gray-600">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                              </span>
                              <Input
                                id="youtube"
                                value={formData.social_links.youtube}
                                onChange={(e) => handleSocialLinkChange("youtube", e.target.value)}
                                placeholder="channel"
                                className="rounded-l-none"
                              />
                            </div>
                            <p className="text-xs text-gray-500">Will link to: youtube.com/@channel</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="tiktok">TikTok</Label>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-800 dark:border-gray-600">
                                <TikTokIcon className="h-4 w-4" />
                              </span>
                              <Input
                                id="tiktok"
                                value={formData.social_links.tiktok}
                                onChange={(e) => handleSocialLinkChange("tiktok", e.target.value)}
                                placeholder="username"
                                className="rounded-l-none"
                              />
                            </div>
                            <p className="text-xs text-gray-500">Will link to: tiktok.com/@username</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="facebook">Facebook</Label>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-800 dark:border-gray-600">
                                <FacebookIcon className="h-4 w-4" />
                              </span>
                              <Input
                                id="facebook"
                                value={formData.social_links.facebook}
                                onChange={(e) => handleSocialLinkChange("facebook", e.target.value)}
                                placeholder="username"
                                className="rounded-l-none"
                              />
                            </div>
                            <p className="text-xs text-gray-500">Will link to: facebook.com/username</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-800 dark:border-gray-600">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                              </span>
                              <Input
                                id="linkedin"
                                value={formData.social_links.linkedin}
                                onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                                placeholder="username"
                                className="rounded-l-none"
                              />
                            </div>
                            <p className="text-xs text-gray-500">Will link to: linkedin.com/in/username</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="github">GitHub</Label>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-800 dark:border-gray-600">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                              </span>
                              <Input
                                id="github"
                                value={formData.social_links.github}
                                onChange={(e) => handleSocialLinkChange("github", e.target.value)}
                                placeholder="username"
                                className="rounded-l-none"
                              />
                            </div>
                            <p className="text-xs text-gray-500">Will link to: github.com/username</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="telegram">Telegram</Label>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-800 dark:border-gray-600">
                                <TelegramIcon className="h-4 w-4" />
                              </span>
                              <Input
                                id="telegram"
                                value={formData.social_links.telegram}
                                onChange={(e) => handleSocialLinkChange("telegram", e.target.value)}
                                placeholder="username"
                                className="rounded-l-none"
                              />
                            </div>
                            <p className="text-xs text-gray-500">Will link to: t.me/username</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="discord">Discord</Label>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-800 dark:border-gray-600">
                                <DiscordIcon className="h-4 w-4" />
                              </span>
                              <Input
                                id="discord"
                                value={formData.social_links.discord}
                                onChange={(e) => handleSocialLinkChange("discord", e.target.value)}
                                placeholder="username#1234"
                                className="rounded-l-none"
                              />
                            </div>
                            <p className="text-xs text-gray-500">Display only (no link)</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="rumble">Rumble</Label>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-800 dark:border-gray-600">
                                <RumbleIcon className="h-4 w-4" />
                              </span>
                              <Input
                                id="rumble"
                                value={formData.social_links.rumble}
                                onChange={(e) => handleSocialLinkChange("rumble", e.target.value)}
                                placeholder="channel"
                                className="rounded-l-none"
                              />
                            </div>
                            <p className="text-xs text-gray-500">Will link to: rumble.com/c/channel</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="therealworld">The Real World</Label>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-800 dark:border-gray-600">
                                <TheRealWorldIcon className="h-4 w-4" />
                              </span>
                              <Input
                                id="therealworld"
                                value={formData.social_links.therealworld}
                                onChange={(e) => handleSocialLinkChange("therealworld", e.target.value)}
                                placeholder="username"
                                className="rounded-l-none"
                              />
                            </div>
                            <p className="text-xs text-gray-500">Display only (no link)</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-800 dark:border-gray-600">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                </svg>
                              </span>
                              <Input
                                id="website"
                                value={formData.social_links.website}
                                onChange={(e) => handleSocialLinkChange("website", e.target.value)}
                                placeholder="yourwebsite.com"
                                className="rounded-l-none"
                              />
                            </div>
                            <p className="text-xs text-gray-500">Will link to: https://yourwebsite.com</p>
                          </div>
                        </div>
                      </div>

                      {/* Save Message */}
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

                      {/* Save Button */}
                      <div className="flex justify-end">
                        <Button type="submit" disabled={isSaving || !isUsernameValid()}>
                          {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Extended Profile Form */}
                {/* <ExpandedProfileForm
                  formData={formData}
                  onInputChange={handleInputChange}
                  onSave={handleSaveProfile}
                  isSaving={isSaving}
                  saveMessage={saveMessage}
                /> */}
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
