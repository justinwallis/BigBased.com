"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Mail, Shield, Users, BookOpen, Heart, Megaphone, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/hooks/use-toast"
import { getNotificationPreferences, saveEmailPreferences } from "@/app/actions/notification-actions"

interface EmailPreferences {
  // Security Notifications (Recommended)
  securityAlerts: boolean
  loginNotifications: boolean
  accountChanges: boolean

  // Platform Updates
  platformUpdates: boolean
  newFeatures: boolean
  maintenanceAlerts: boolean

  // Community
  communityUpdates: boolean
  newMembers: boolean
  communityEvents: boolean

  // Content & Library
  newContent: boolean
  libraryUpdates: boolean
  bookRecommendations: boolean

  // Prayer & Spiritual
  prayerRequests: boolean
  spiritualContent: boolean
  dailyDevotions: boolean

  // Marketing & Events
  newsletters: boolean
  eventInvitations: boolean
  specialOffers: boolean
}

const defaultPreferences: EmailPreferences = {
  securityAlerts: true,
  loginNotifications: true,
  accountChanges: true,
  platformUpdates: true,
  newFeatures: true,
  maintenanceAlerts: true,
  communityUpdates: false,
  newMembers: false,
  communityEvents: true,
  newContent: true,
  libraryUpdates: false,
  bookRecommendations: false,
  prayerRequests: true,
  spiritualContent: false,
  dailyDevotions: false,
  newsletters: false,
  eventInvitations: true,
  specialOffers: false,
}

export default function EmailNotificationsClientPage() {
  const [preferences, setPreferences] = useState<EmailPreferences>(defaultPreferences)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadPreferences()
  }, [])

  const loadPreferences = async () => {
    try {
      const result = await getNotificationPreferences()
      if (result.success && result.data?.emailPreferences) {
        setPreferences({ ...defaultPreferences, ...result.data.emailPreferences })
      }
    } catch (error) {
      console.error("Error loading preferences:", error)
      toast({
        title: "Error",
        description: "Failed to load notification preferences",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreferenceChange = (key: keyof EmailPreferences, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const result = await saveEmailPreferences(preferences)
      if (result.success) {
        toast({
          title: "Success",
          description: "Email notification preferences saved successfully",
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error saving preferences:", error)
      toast({
        title: "Error",
        description: "Failed to save notification preferences",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEnableAll = () => {
    const allEnabled = Object.keys(defaultPreferences).reduce((acc, key) => {
      acc[key as keyof EmailPreferences] = true
      return acc
    }, {} as EmailPreferences)
    setPreferences(allEnabled)
  }

  const handleDisableAll = () => {
    // Keep security notifications enabled for safety
    const securityOnly = {
      ...Object.keys(defaultPreferences).reduce((acc, key) => {
        acc[key as keyof EmailPreferences] = false
        return acc
      }, {} as EmailPreferences),
      securityAlerts: true,
      loginNotifications: true,
      accountChanges: true,
    }
    setPreferences(securityOnly)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-10">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading Email Preferences...
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl py-10 px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/profile?tab=notifications">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Profile</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Mail className="h-8 w-8" />
                Email Notifications
              </h1>
              <p className="text-muted-foreground">Manage your email notification preferences</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Quickly enable or disable notification categories</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button variant="outline" onClick={handleEnableAll}>
                Enable All
              </Button>
              <Button variant="outline" onClick={handleDisableAll}>
                Disable All (Keep Security)
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="ml-auto">
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Security Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Notifications
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Recommended</span>
              </CardTitle>
              <CardDescription>Important security alerts and account changes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="securityAlerts" className="font-medium">
                    Security Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground">Critical security notifications and warnings</p>
                </div>
                <Switch
                  id="securityAlerts"
                  checked={preferences.securityAlerts}
                  onCheckedChange={(checked) => handlePreferenceChange("securityAlerts", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="loginNotifications" className="font-medium">
                    Login Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">Alerts when someone signs into your account</p>
                </div>
                <Switch
                  id="loginNotifications"
                  checked={preferences.loginNotifications}
                  onCheckedChange={(checked) => handlePreferenceChange("loginNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="accountChanges" className="font-medium">
                    Account Changes
                  </Label>
                  <p className="text-sm text-muted-foreground">Notifications when your account settings are modified</p>
                </div>
                <Switch
                  id="accountChanges"
                  checked={preferences.accountChanges}
                  onCheckedChange={(checked) => handlePreferenceChange("accountChanges", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Platform Updates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                Platform Updates
              </CardTitle>
              <CardDescription>Stay informed about Big Based platform changes and improvements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="platformUpdates" className="font-medium">
                    Platform Updates
                  </Label>
                  <p className="text-sm text-muted-foreground">Major platform updates and announcements</p>
                </div>
                <Switch
                  id="platformUpdates"
                  checked={preferences.platformUpdates}
                  onCheckedChange={(checked) => handlePreferenceChange("platformUpdates", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="newFeatures" className="font-medium">
                    New Features
                  </Label>
                  <p className="text-sm text-muted-foreground">Notifications about new features and tools</p>
                </div>
                <Switch
                  id="newFeatures"
                  checked={preferences.newFeatures}
                  onCheckedChange={(checked) => handlePreferenceChange("newFeatures", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceAlerts" className="font-medium">
                    Maintenance Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground">Scheduled maintenance and downtime notifications</p>
                </div>
                <Switch
                  id="maintenanceAlerts"
                  checked={preferences.maintenanceAlerts}
                  onCheckedChange={(checked) => handlePreferenceChange("maintenanceAlerts", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Community */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Community
              </CardTitle>
              <CardDescription>Stay connected with the Big Based community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="communityUpdates" className="font-medium">
                    Community Updates
                  </Label>
                  <p className="text-sm text-muted-foreground">General community news and updates</p>
                </div>
                <Switch
                  id="communityUpdates"
                  checked={preferences.communityUpdates}
                  onCheckedChange={(checked) => handlePreferenceChange("communityUpdates", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="newMembers" className="font-medium">
                    New Members
                  </Label>
                  <p className="text-sm text-muted-foreground">Notifications when new members join</p>
                </div>
                <Switch
                  id="newMembers"
                  checked={preferences.newMembers}
                  onCheckedChange={(checked) => handlePreferenceChange("newMembers", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="communityEvents" className="font-medium">
                    Community Events
                  </Label>
                  <p className="text-sm text-muted-foreground">Upcoming community events and gatherings</p>
                </div>
                <Switch
                  id="communityEvents"
                  checked={preferences.communityEvents}
                  onCheckedChange={(checked) => handlePreferenceChange("communityEvents", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Content & Library */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Content & Library
              </CardTitle>
              <CardDescription>Updates about new content, books, and educational resources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="newContent" className="font-medium">
                    New Content
                  </Label>
                  <p className="text-sm text-muted-foreground">Notifications about new articles and content</p>
                </div>
                <Switch
                  id="newContent"
                  checked={preferences.newContent}
                  onCheckedChange={(checked) => handlePreferenceChange("newContent", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="libraryUpdates" className="font-medium">
                    Library Updates
                  </Label>
                  <p className="text-sm text-muted-foreground">New additions to the digital library</p>
                </div>
                <Switch
                  id="libraryUpdates"
                  checked={preferences.libraryUpdates}
                  onCheckedChange={(checked) => handlePreferenceChange("libraryUpdates", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="bookRecommendations" className="font-medium">
                    Book Recommendations
                  </Label>
                  <p className="text-sm text-muted-foreground">Curated book recommendations and reviews</p>
                </div>
                <Switch
                  id="bookRecommendations"
                  checked={preferences.bookRecommendations}
                  onCheckedChange={(checked) => handlePreferenceChange("bookRecommendations", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Prayer & Spiritual */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Prayer & Spiritual
              </CardTitle>
              <CardDescription>Spiritual content and prayer-related notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="prayerRequests" className="font-medium">
                    Prayer Requests
                  </Label>
                  <p className="text-sm text-muted-foreground">Community prayer requests and updates</p>
                </div>
                <Switch
                  id="prayerRequests"
                  checked={preferences.prayerRequests}
                  onCheckedChange={(checked) => handlePreferenceChange("prayerRequests", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="spiritualContent" className="font-medium">
                    Spiritual Content
                  </Label>
                  <p className="text-sm text-muted-foreground">Daily spiritual content and inspirational messages</p>
                </div>
                <Switch
                  id="spiritualContent"
                  checked={preferences.spiritualContent}
                  onCheckedChange={(checked) => handlePreferenceChange("spiritualContent", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dailyDevotions" className="font-medium">
                    Daily Devotions
                  </Label>
                  <p className="text-sm text-muted-foreground">Daily devotional content and scripture</p>
                </div>
                <Switch
                  id="dailyDevotions"
                  checked={preferences.dailyDevotions}
                  onCheckedChange={(checked) => handlePreferenceChange("dailyDevotions", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Marketing & Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                Marketing & Events
              </CardTitle>
              <CardDescription>Newsletters, events, and promotional content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="newsletters" className="font-medium">
                    Newsletters
                  </Label>
                  <p className="text-sm text-muted-foreground">Weekly and monthly newsletters</p>
                </div>
                <Switch
                  id="newsletters"
                  checked={preferences.newsletters}
                  onCheckedChange={(checked) => handlePreferenceChange("newsletters", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="eventInvitations" className="font-medium">
                    Event Invitations
                  </Label>
                  <p className="text-sm text-muted-foreground">Invitations to special events and webinars</p>
                </div>
                <Switch
                  id="eventInvitations"
                  checked={preferences.eventInvitations}
                  onCheckedChange={(checked) => handlePreferenceChange("eventInvitations", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="specialOffers" className="font-medium">
                    Special Offers
                  </Label>
                  <p className="text-sm text-muted-foreground">Promotional offers and discounts</p>
                </div>
                <Switch
                  id="specialOffers"
                  checked={preferences.specialOffers}
                  onCheckedChange={(checked) => handlePreferenceChange("specialOffers", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving} size="lg">
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving Preferences...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save All Preferences
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
