"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Bell, Mail, Shield, Users, BookOpen, TrendingUp, Heart } from "lucide-react"
import Link from "next/link"

interface NotificationSettings {
  // Security notifications
  security_alerts: boolean
  login_notifications: boolean
  password_changes: boolean

  // Platform updates
  platform_updates: boolean
  new_features: boolean
  maintenance_alerts: boolean

  // Community notifications
  community_updates: boolean
  new_connections: boolean
  mentions: boolean

  // Content notifications
  new_content: boolean
  recommended_content: boolean
  library_updates: boolean

  // Marketing notifications
  newsletters: boolean
  promotional_offers: boolean
  event_invitations: boolean

  // Prayer and spiritual
  prayer_requests: boolean
  daily_devotionals: boolean
  spiritual_content: boolean
}

export default function EmailNotificationsClientPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [settings, setSettings] = useState<NotificationSettings>({
    // Security notifications (always recommended)
    security_alerts: true,
    login_notifications: true,
    password_changes: true,

    // Platform updates
    platform_updates: true,
    new_features: true,
    maintenance_alerts: true,

    // Community notifications
    community_updates: false,
    new_connections: false,
    mentions: true,

    // Content notifications
    new_content: false,
    recommended_content: false,
    library_updates: false,

    // Marketing notifications
    newsletters: false,
    promotional_offers: false,
    event_invitations: false,

    // Prayer and spiritual
    prayer_requests: false,
    daily_devotionals: false,
    spiritual_content: false,
  })

  const [isSaving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/sign-in?redirect=/profile/notifications/email")
    }
  }, [isLoading, user, router])

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveMessage("")

    try {
      // TODO: Implement API call to save notification settings
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      setSaveMessage("Notification preferences saved successfully!")
    } catch (error) {
      setSaveMessage("Error saving preferences. Please try again.")
    } finally {
      setSaving(false)
      setTimeout(() => setSaveMessage(""), 5000)
    }
  }

  const handleSelectAll = () => {
    setSettings((prev) => {
      const allEnabled = Object.fromEntries(Object.keys(prev).map((key) => [key, true])) as NotificationSettings
      return allEnabled
    })
  }

  const handleSelectNone = () => {
    setSettings((prev) => {
      // Keep security notifications enabled for safety
      const allDisabled = Object.fromEntries(
        Object.keys(prev).map((key) => [
          key,
          key === "security_alerts" || key === "login_notifications" || key === "password_changes",
        ]),
      ) as NotificationSettings
      return allDisabled
    })
  }

  if (isLoading || !user) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please wait while we load your notification preferences.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/profile?tab=notifications">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Email Notifications</h1>
            <p className="text-muted-foreground">Manage your email notification preferences</p>
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>Quickly enable or disable all notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={handleSelectAll}>
                Enable All
              </Button>
              <Button variant="outline" onClick={handleSelectNone}>
                Disable All (Keep Security)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security Notifications</span>
              <Badge variant="secondary">Recommended</Badge>
            </CardTitle>
            <CardDescription>Important security alerts and account activity notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="security_alerts">Security Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Suspicious activity, failed login attempts, and security warnings
                </p>
              </div>
              <Switch
                id="security_alerts"
                checked={settings.security_alerts}
                onCheckedChange={() => handleToggle("security_alerts")}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="login_notifications">Login Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified when someone signs into your account</p>
              </div>
              <Switch
                id="login_notifications"
                checked={settings.login_notifications}
                onCheckedChange={() => handleToggle("login_notifications")}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="password_changes">Password Changes</Label>
                <p className="text-sm text-muted-foreground">Confirmation emails when your password is changed</p>
              </div>
              <Switch
                id="password_changes"
                checked={settings.password_changes}
                onCheckedChange={() => handleToggle("password_changes")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Platform Updates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Platform Updates</span>
            </CardTitle>
            <CardDescription>Stay informed about Big Based platform changes and improvements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="platform_updates">Platform Updates</Label>
                <p className="text-sm text-muted-foreground">Major platform changes and announcements</p>
              </div>
              <Switch
                id="platform_updates"
                checked={settings.platform_updates}
                onCheckedChange={() => handleToggle("platform_updates")}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="new_features">New Features</Label>
                <p className="text-sm text-muted-foreground">Be the first to know about new features and tools</p>
              </div>
              <Switch
                id="new_features"
                checked={settings.new_features}
                onCheckedChange={() => handleToggle("new_features")}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenance_alerts">Maintenance Alerts</Label>
                <p className="text-sm text-muted-foreground">Scheduled maintenance and downtime notifications</p>
              </div>
              <Switch
                id="maintenance_alerts"
                checked={settings.maintenance_alerts}
                onCheckedChange={() => handleToggle("maintenance_alerts")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Community Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Community</span>
            </CardTitle>
            <CardDescription>Notifications about community activity and connections</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="community_updates">Community Updates</Label>
                <p className="text-sm text-muted-foreground">Weekly digest of community highlights and discussions</p>
              </div>
              <Switch
                id="community_updates"
                checked={settings.community_updates}
                onCheckedChange={() => handleToggle("community_updates")}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="new_connections">New Connections</Label>
                <p className="text-sm text-muted-foreground">When someone follows you or wants to connect</p>
              </div>
              <Switch
                id="new_connections"
                checked={settings.new_connections}
                onCheckedChange={() => handleToggle("new_connections")}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="mentions">Mentions</Label>
                <p className="text-sm text-muted-foreground">When someone mentions you in discussions or comments</p>
              </div>
              <Switch id="mentions" checked={settings.mentions} onCheckedChange={() => handleToggle("mentions")} />
            </div>
          </CardContent>
        </Card>

        {/* Content Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Content & Library</span>
            </CardTitle>
            <CardDescription>Updates about new content, books, and educational resources</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="new_content">New Content</Label>
                <p className="text-sm text-muted-foreground">New articles, videos, and educational materials</p>
              </div>
              <Switch
                id="new_content"
                checked={settings.new_content}
                onCheckedChange={() => handleToggle("new_content")}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="recommended_content">Recommended Content</Label>
                <p className="text-sm text-muted-foreground">
                  Personalized content recommendations based on your interests
                </p>
              </div>
              <Switch
                id="recommended_content"
                checked={settings.recommended_content}
                onCheckedChange={() => handleToggle("recommended_content")}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="library_updates">Library Updates</Label>
                <p className="text-sm text-muted-foreground">New books and resources added to the digital library</p>
              </div>
              <Switch
                id="library_updates"
                checked={settings.library_updates}
                onCheckedChange={() => handleToggle("library_updates")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Prayer and Spiritual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5" />
              <span>Prayer & Spiritual</span>
            </CardTitle>
            <CardDescription>Faith-based content and prayer community notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="prayer_requests">Prayer Requests</Label>
                <p className="text-sm text-muted-foreground">Community prayer requests and updates</p>
              </div>
              <Switch
                id="prayer_requests"
                checked={settings.prayer_requests}
                onCheckedChange={() => handleToggle("prayer_requests")}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="daily_devotionals">Daily Devotionals</Label>
                <p className="text-sm text-muted-foreground">Daily spiritual content and devotional messages</p>
              </div>
              <Switch
                id="daily_devotionals"
                checked={settings.daily_devotionals}
                onCheckedChange={() => handleToggle("daily_devotionals")}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="spiritual_content">Spiritual Content</Label>
                <p className="text-sm text-muted-foreground">
                  New faith-based articles, sermons, and spiritual resources
                </p>
              </div>
              <Switch
                id="spiritual_content"
                checked={settings.spiritual_content}
                onCheckedChange={() => handleToggle("spiritual_content")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Marketing Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Marketing & Events</span>
            </CardTitle>
            <CardDescription>Newsletters, promotional content, and event invitations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="newsletters">Newsletters</Label>
                <p className="text-sm text-muted-foreground">Weekly and monthly newsletters with platform highlights</p>
              </div>
              <Switch
                id="newsletters"
                checked={settings.newsletters}
                onCheckedChange={() => handleToggle("newsletters")}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="promotional_offers">Promotional Offers</Label>
                <p className="text-sm text-muted-foreground">Special offers, discounts, and promotional content</p>
              </div>
              <Switch
                id="promotional_offers"
                checked={settings.promotional_offers}
                onCheckedChange={() => handleToggle("promotional_offers")}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="event_invitations">Event Invitations</Label>
                <p className="text-sm text-muted-foreground">
                  Invitations to webinars, conferences, and community events
                </p>
              </div>
              <Switch
                id="event_invitations"
                checked={settings.event_invitations}
                onCheckedChange={() => handleToggle("event_invitations")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Changes will be applied to your email: <strong>{user.email}</strong>
                </p>
                {saveMessage && (
                  <p className={`text-sm mt-1 ${saveMessage.includes("Error") ? "text-red-600" : "text-green-600"}`}>
                    {saveMessage}
                  </p>
                )}
              </div>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
