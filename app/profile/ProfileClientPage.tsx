"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getCurrentUserProfile, updateCurrentUserProfile } from "@/app/actions/profile-actions"
import { User, Shield, Bell, CreditCard, RefreshCw, Linkedin, Github, Globe } from "lucide-react"
import { AvatarUpload } from "@/components/avatar-upload"
import { BannerUpload } from "@/components/banner-upload"

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
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [loadError, setLoadError] = useState("")

  // Form states
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    bio: "",
    avatar_url: "",
    banner_url: "",
    social_links: {
      x: "",
      linkedin: "",
      github: "",
      website: "",
    },
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
        setFormData({
          username: profileData.username || "",
          full_name: profileData.full_name || "",
          bio: profileData.bio || "",
          avatar_url: profileData.avatar_url || "",
          banner_url: profileData.banner_url || "",
          social_links: profileData.social_links || {
            x: "",
            linkedin: "",
            github: "",
            website: "",
          },
        })
      } else {
        setLoadError("Failed to load profile data")
        // Set default form data if no profile exists
        setFormData({
          username: user?.email?.split("@")[0] || "",
          full_name: "",
          bio: "",
          avatar_url: "",
          banner_url: "",
          social_links: {
            x: "",
            linkedin: "",
            github: "",
            website: "",
          },
        })
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

  // X (Twitter) icon component
  const XIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )

  return (
    <div className="container mx-auto py-10 space-y-8">
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
          <div
            className="h-32 md:h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative"
            style={{
              backgroundImage: formData.banner_url ? `url(${formData.banner_url})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
              <AvatarUpload
                currentAvatarUrl={formData.avatar_url}
                onAvatarChange={(newUrl) => handleInputChange("avatar_url", newUrl)}
                userInitials={getInitials(formData.full_name || formData.username || user.email || "U")}
                className="h-16 w-16 md:h-20 md:w-20 border-4 border-white shadow-lg"
              />
            </div>
          </div>
        </div>
        <CardHeader className="pt-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl">{formData.full_name || formData.username || "User"}</CardTitle>
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
      <Tabs defaultValue="general" className="space-y-6">
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
                          />
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

                      {/* Banner Upload */}
                      <BannerUpload
                        currentBannerUrl={formData.banner_url}
                        onBannerChange={(newUrl) => handleInputChange("banner_url", newUrl)}
                      />

                      {/* Social Links Section */}
                      <div className="space-y-4">
                        <Label className="text-base font-medium">Social Links</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="x" className="flex items-center space-x-2">
                              <XIcon className="h-4 w-4" />
                              <span>X (Twitter)</span>
                            </Label>
                            <Input
                              id="x"
                              value={formData.social_links.x}
                              onChange={(e) => handleSocialLinkChange("x", e.target.value)}
                              placeholder="https://x.com/username"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="linkedin" className="flex items-center space-x-2">
                              <Linkedin className="h-4 w-4" />
                              <span>LinkedIn</span>
                            </Label>
                            <Input
                              id="linkedin"
                              value={formData.social_links.linkedin}
                              onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                              placeholder="https://linkedin.com/in/username"
                            />
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
                              placeholder="https://github.com/username"
                            />
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

                      <div className="flex justify-between">
                        <Button type="submit" disabled={isSaving}>
                          {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button variant="outline" onClick={handleSignOut}>
                          Sign Out
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
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
                    <span className="font-medium">Coming Soon</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Connections</span>
                    <span className="font-medium">Coming Soon</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Contributions</span>
                    <span className="font-medium">Coming Soon</span>
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
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Password</h4>
                    <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                  </div>
                  <Button variant="outline">Change Password</Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Button variant="outline">Enable 2FA</Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Active Sessions</h4>
                    <p className="text-sm text-muted-foreground">Manage your active login sessions</p>
                  </div>
                  <Button variant="outline">View Sessions</Button>
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
                  <Button variant="outline">Configure</Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-muted-foreground">Get notified on your devices</p>
                  </div>
                  <Button variant="outline">Configure</Button>
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
                  <Button variant="outline">Add Payment Method</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
