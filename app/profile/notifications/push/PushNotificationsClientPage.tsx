"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  ArrowLeft,
  Bell,
  BellOff,
  Shield,
  Users,
  BookOpen,
  Heart,
  Megaphone,
  Smartphone,
  Globe,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Clock,
  Send,
} from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { sendTestNotification } from "@/app/actions/notification-actions"

interface NotificationPreferences {
  // Security & Account
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

interface PushNotificationStatus {
  supported: boolean
  permission: NotificationPermission
  subscribed: boolean
  loading: boolean
  error: string | null
}

export default function PushNotificationsClientPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const [preferences, setPreferences] = useState<NotificationPreferences>({
    // Security & Account (recommended to keep enabled)
    securityAlerts: true,
    loginNotifications: true,
    accountChanges: true,

    // Platform Updates
    platformUpdates: true,
    newFeatures: true,
    maintenanceAlerts: true,

    // Community
    communityUpdates: false,
    newMembers: false,
    communityEvents: true,

    // Content & Library
    newContent: true,
    libraryUpdates: false,
    bookRecommendations: false,

    // Prayer & Spiritual
    prayerRequests: true,
    spiritualContent: false,
    dailyDevotions: false,

    // Marketing & Events
    newsletters: false,
    eventInvitations: true,
    specialOffers: false,
  })

  const [pushStatus, setPushStatus] = useState<PushNotificationStatus>({
    supported: false,
    permission: "default",
    subscribed: false,
    loading: true,
    error: null,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [isSendingTest, setIsSendingTest] = useState(false)
  const [activeTab, setActiveTab] = useState("preferences")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/sign-in?redirect=/profile/notifications/push")
    }
  }, [isLoading, user, router])

  useEffect(() => {
    checkPushNotificationStatus()
  }, [])

  const checkPushNotificationStatus = async () => {
    try {
      setPushStatus((prev) => ({ ...prev, loading: true, error: null }))

      // Check if push notifications are supported
      const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window

      if (!supported) {
        setPushStatus({
          supported: false,
          permission: "denied",
          subscribed: false,
          loading: false,
          error: "Push notifications are not supported in this browser",
        })
        return
      }

      // Check current permission
      const permission = Notification.permission

      // Check if we have an active subscription
      let subscribed = false
      if (permission === "granted") {
        try {
          if ("serviceWorker" in navigator) {
            const registration = await navigator.serviceWorker.ready
            const subscription = await registration.pushManager.getSubscription()
            subscribed = !!subscription
          }
        } catch (error) {
          console.warn("Could not check subscription status:", error)
        }
      }

      setPushStatus({
        supported: true,
        permission,
        subscribed,
        loading: false,
        error: null,
      })
    } catch (error) {
      console.error("Error checking push notification status:", error)
      setPushStatus((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to check notification status",
      }))
    }
  }

  const requestNotificationPermission = async () => {
    try {
      setPushStatus((prev) => ({ ...prev, loading: true, error: null }))

      // Check if OneSignal is available
      if (!window.OneSignal) {
        // Try to initialize OneSignal if not already done
        if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID) {
          const OneSignal = (await import("react-onesignal")).default
          await OneSignal.init({
            appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
            allowLocalhostAsSecureOrigin: true,
          })
        } else {
          throw new Error("OneSignal is not available or app ID is missing")
        }
      }

      // Request permission using browser API first
      const permission = await Notification.requestPermission()

      if (permission === "granted") {
        // Now try to get OneSignal subscription
        if (window.OneSignal) {
          try {
            await window.OneSignal.setSubscription(true)
            const userId = await window.OneSignal.getUserId()
            console.log("OneSignal User ID:", userId)
          } catch (onesignalError) {
            console.warn("OneSignal subscription failed, but browser permission granted:", onesignalError)
          }
        }

        setPushStatus((prev) => ({
          ...prev,
          permission: "granted",
          subscribed: true,
          loading: false,
        }))

        toast({
          title: "Push notifications enabled! 🎉",
          description: "You will now receive notifications on this device.",
        })
      } else {
        setPushStatus((prev) => ({
          ...prev,
          permission: permission,
          subscribed: false,
          loading: false,
        }))

        toast({
          title: "Permission denied",
          description: "Push notifications were not enabled. You can enable them in your browser settings.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      setPushStatus((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to request notification permission. Please try refreshing the page.",
      }))

      toast({
        title: "Error enabling notifications",
        description: "Please try refreshing the page and try again.",
        variant: "destructive",
      })
    }
  }

  const disableNotifications = async () => {
    try {
      setPushStatus((prev) => ({ ...prev, loading: true, error: null }))

      if (window.OneSignal) {
        await window.OneSignal.setSubscription(false)
      }

      setPushStatus((prev) => ({
        ...prev,
        subscribed: false,
        loading: false,
      }))

      toast({
        title: "Push notifications disabled",
        description: "You will no longer receive notifications on this device.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error disabling notifications:", error)
      setPushStatus((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to disable notifications",
      }))
    }
  }

  const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleEnableAll = () => {
    setPreferences((prev) =>
      Object.keys(prev).reduce(
        (acc, key) => ({
          ...acc,
          [key]: true,
        }),
        {} as NotificationPreferences,
      ),
    )
  }

  const handleDisableAll = () => {
    setPreferences((prev) => ({
      ...prev,
      // Keep security notifications enabled
      securityAlerts: true,
      loginNotifications: true,
      accountChanges: true,
      // Disable everything else
      platformUpdates: false,
      newFeatures: false,
      maintenanceAlerts: false,
      communityUpdates: false,
      newMembers: false,
      communityEvents: false,
      newContent: false,
      libraryUpdates: false,
      bookRecommendations: false,
      prayerRequests: false,
      spiritualContent: false,
      dailyDevotions: false,
      newsletters: false,
      eventInvitations: false,
      specialOffers: false,
    }))
  }

  const handleSavePreferences = async () => {
    setIsSaving(true)
    setSaveMessage("")

    try {
      // TODO: Implement API call to save preferences
      // await saveNotificationPreferences(user.id, preferences)

      // Set OneSignal tags based on preferences
      if (window.OneSignal) {
        const tags: Record<string, string> = {}

        // Convert boolean preferences to string tags
        Object.entries(preferences).forEach(([key, value]) => {
          tags[key] = value ? "true" : "false"
        })

        await window.OneSignal.sendTags(tags)
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSaveMessage("Push notification preferences saved successfully!")
      toast({
        title: "Preferences saved",
        description: "Your notification preferences have been updated.",
        variant: "success",
      })
    } catch (error) {
      setSaveMessage("Failed to save preferences. Please try again.")
      toast({
        title: "Error saving preferences",
        description: "Please try again later.",
        variant: "destructive",
      })
      console.error("Error saving preferences:", error)
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(""), 5000)
    }
  }

  const handleSendTestNotification = async () => {
    setIsSendingTest(true)

    try {
      // Check if notifications are enabled
      if (!pushStatus.subscribed && Notification.permission !== "granted") {
        throw new Error("Push notifications are not enabled")
      }

      toast({
        title: "Sending test notification...",
        description: "You should receive a notification shortly.",
      })

      // Send a simple browser notification first
      if (Notification.permission === "granted") {
        new Notification("Big Based Test Notification", {
          body: "This is a test notification from Big Based! 🎉",
          icon: "/favicon-32x32.png",
          badge: "/favicon-16x16.png",
        })
      }

      // Also try to send via server action if available
      try {
        const result = await sendTestNotification()
        if (result.success) {
          toast({
            title: "Test notification sent successfully! 🎉",
            description: "Check your notifications. If you don't see it, make sure your browser allows notifications.",
          })
        }
      } catch (serverError) {
        console.warn("Server notification failed, but browser notification sent:", serverError)
        toast({
          title: "Test notification sent! 🎉",
          description: "A browser notification was sent. Server notifications may not be configured yet.",
        })
      }
    } catch (error) {
      console.error("Error sending test notification:", error)
      toast({
        title: "Error sending test notification",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSendingTest(false)
    }
  }

  const getStatusIcon = () => {
    if (pushStatus.loading) {
      return <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
    }

    if (!pushStatus.supported) {
      return <XCircle className="h-5 w-5 text-red-500" />
    }

    if (pushStatus.subscribed) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    }

    if (pushStatus.permission === "denied") {
      return <XCircle className="h-5 w-5 text-red-500" />
    }

    return <AlertTriangle className="h-5 w-5 text-yellow-500" />
  }

  const getStatusText = () => {
    if (pushStatus.loading) return "Checking status..."
    if (!pushStatus.supported) return "Not supported"
    if (pushStatus.subscribed) return "Enabled"
    if (pushStatus.permission === "denied") return "Blocked"
    return "Disabled"
  }

  const getStatusBadgeVariant = () => {
    if (pushStatus.subscribed) return "default"
    if (pushStatus.permission === "denied" || !pushStatus.supported) return "destructive"
    return "secondary"
  }

  if (isLoading || !user) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
            <CardDescription>Please wait while we load your notification settings.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/profile?tab=notifications">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Profile</span>
            </Button>
          </Link>
          <ThemeToggle />
        </div>

        {/* Page Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Push Notifications</h1>
          <p className="text-muted-foreground">
            Manage your push notification preferences and get instant updates on your devices.
          </p>
        </div>

        {/* Push Notification Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5" />
              <span>Push Notification Status</span>
            </CardTitle>
            <CardDescription>Current status of push notifications for your browser and device.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon()}
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    {pushStatus.error || "Receive instant notifications on this device"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={getStatusBadgeVariant()}>{getStatusText()}</Badge>
                {!pushStatus.subscribed && pushStatus.supported && pushStatus.permission !== "denied" && (
                  <Button onClick={requestNotificationPermission} disabled={pushStatus.loading} size="sm">
                    {pushStatus.loading ? "Enabling..." : "Enable"}
                  </Button>
                )}
                {pushStatus.subscribed && (
                  <Button onClick={disableNotifications} disabled={pushStatus.loading} variant="outline" size="sm">
                    {pushStatus.loading ? "Disabling..." : "Disable"}
                  </Button>
                )}
                <Button onClick={checkPushNotificationStatus} disabled={pushStatus.loading} variant="ghost" size="sm">
                  <RefreshCw className={`h-4 w-4 ${pushStatus.loading ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </div>

            {pushStatus.permission === "denied" && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">Push notifications are blocked</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      To enable push notifications, you'll need to allow them in your browser settings. Look for the
                      notification icon in your address bar or check your browser's site settings.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!pushStatus.supported && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start space-x-2">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-200">Push notifications not supported</p>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      Your browser doesn't support push notifications. Try using a modern browser like Chrome, Firefox,
                      or Safari.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs for Preferences and Testing */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preferences" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notification Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="testing" className="flex items-center space-x-2">
              <Send className="h-4 w-4" />
              <span>Test Notifications</span>
            </TabsTrigger>
          </TabsList>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
                <CardDescription>Choose which types of push notifications you want to receive.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Actions */}
                <div className="flex items-center space-x-2">
                  <Button onClick={handleEnableAll} variant="outline" size="sm">
                    Enable All
                  </Button>
                  <Button onClick={handleDisableAll} variant="outline" size="sm">
                    <BellOff className="h-4 w-4 mr-2" />
                    Disable All (Keep Security)
                  </Button>
                </div>

                <Separator />

                {/* Security & Account Notifications */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Security & Account</h3>
                    <Badge variant="secondary">Recommended</Badge>
                  </div>

                  <div className="space-y-3 ml-7">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="securityAlerts" className="text-base">
                          Security Alerts
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Suspicious login attempts, password changes, and security breaches
                        </p>
                      </div>
                      <Switch
                        id="securityAlerts"
                        checked={preferences.securityAlerts}
                        onCheckedChange={(checked) => handlePreferenceChange("securityAlerts", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="loginNotifications" className="text-base">
                          Login Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">New device logins and session activity</p>
                      </div>
                      <Switch
                        id="loginNotifications"
                        checked={preferences.loginNotifications}
                        onCheckedChange={(checked) => handlePreferenceChange("loginNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="accountChanges" className="text-base">
                          Account Changes
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Profile updates, email changes, and account modifications
                        </p>
                      </div>
                      <Switch
                        id="accountChanges"
                        checked={preferences.accountChanges}
                        onCheckedChange={(checked) => handlePreferenceChange("accountChanges", checked)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Platform Updates */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold">Platform Updates</h3>
                  </div>

                  <div className="space-y-3 ml-7">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="platformUpdates" className="text-base">
                          Platform Updates
                        </Label>
                        <p className="text-sm text-muted-foreground">Major platform changes and improvements</p>
                      </div>
                      <Switch
                        id="platformUpdates"
                        checked={preferences.platformUpdates}
                        onCheckedChange={(checked) => handlePreferenceChange("platformUpdates", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="newFeatures" className="text-base">
                          New Features
                        </Label>
                        <p className="text-sm text-muted-foreground">Announcements about new tools and capabilities</p>
                      </div>
                      <Switch
                        id="newFeatures"
                        checked={preferences.newFeatures}
                        onCheckedChange={(checked) => handlePreferenceChange("newFeatures", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="maintenanceAlerts" className="text-base">
                          Maintenance Alerts
                        </Label>
                        <p className="text-sm text-muted-foreground">Scheduled maintenance and service interruptions</p>
                      </div>
                      <Switch
                        id="maintenanceAlerts"
                        checked={preferences.maintenanceAlerts}
                        onCheckedChange={(checked) => handlePreferenceChange("maintenanceAlerts", checked)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Community */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-semibold">Community</h3>
                  </div>

                  <div className="space-y-3 ml-7">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="communityUpdates" className="text-base">
                          Community Updates
                        </Label>
                        <p className="text-sm text-muted-foreground">Important community announcements and changes</p>
                      </div>
                      <Switch
                        id="communityUpdates"
                        checked={preferences.communityUpdates}
                        onCheckedChange={(checked) => handlePreferenceChange("communityUpdates", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="newMembers" className="text-base">
                          New Members
                        </Label>
                        <p className="text-sm text-muted-foreground">Welcome notifications for new community members</p>
                      </div>
                      <Switch
                        id="newMembers"
                        checked={preferences.newMembers}
                        onCheckedChange={(checked) => handlePreferenceChange("newMembers", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="communityEvents" className="text-base">
                          Community Events
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Live streams, discussions, and community gatherings
                        </p>
                      </div>
                      <Switch
                        id="communityEvents"
                        checked={preferences.communityEvents}
                        onCheckedChange={(checked) => handlePreferenceChange("communityEvents", checked)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Content & Library */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-orange-600" />
                    <h3 className="text-lg font-semibold">Content & Library</h3>
                  </div>

                  <div className="space-y-3 ml-7">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="newContent" className="text-base">
                          New Content
                        </Label>
                        <p className="text-sm text-muted-foreground">New articles, videos, and educational materials</p>
                      </div>
                      <Switch
                        id="newContent"
                        checked={preferences.newContent}
                        onCheckedChange={(checked) => handlePreferenceChange("newContent", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="libraryUpdates" className="text-base">
                          Library Updates
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          New books, documents, and resources added to the library
                        </p>
                      </div>
                      <Switch
                        id="libraryUpdates"
                        checked={preferences.libraryUpdates}
                        onCheckedChange={(checked) => handlePreferenceChange("libraryUpdates", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="bookRecommendations" className="text-base">
                          Book Recommendations
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Personalized book suggestions based on your interests
                        </p>
                      </div>
                      <Switch
                        id="bookRecommendations"
                        checked={preferences.bookRecommendations}
                        onCheckedChange={(checked) => handlePreferenceChange("bookRecommendations", checked)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Prayer & Spiritual */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-red-600" />
                    <h3 className="text-lg font-semibold">Prayer & Spiritual</h3>
                  </div>

                  <div className="space-y-3 ml-7">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="prayerRequests" className="text-base">
                          Prayer Requests
                        </Label>
                        <p className="text-sm text-muted-foreground">New prayer requests from the community</p>
                      </div>
                      <Switch
                        id="prayerRequests"
                        checked={preferences.prayerRequests}
                        onCheckedChange={(checked) => handlePreferenceChange("prayerRequests", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="spiritualContent" className="text-base">
                          Spiritual Content
                        </Label>
                        <p className="text-sm text-muted-foreground">Inspirational messages and spiritual guidance</p>
                      </div>
                      <Switch
                        id="spiritualContent"
                        checked={preferences.spiritualContent}
                        onCheckedChange={(checked) => handlePreferenceChange("spiritualContent", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="dailyDevotions" className="text-base">
                          Daily Devotions
                        </Label>
                        <p className="text-sm text-muted-foreground">Daily spiritual reflections and Bible verses</p>
                      </div>
                      <Switch
                        id="dailyDevotions"
                        checked={preferences.dailyDevotions}
                        onCheckedChange={(checked) => handlePreferenceChange("dailyDevotions", checked)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Marketing & Events */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Megaphone className="h-5 w-5 text-indigo-600" />
                    <h3 className="text-lg font-semibold">Marketing & Events</h3>
                  </div>

                  <div className="space-y-3 ml-7">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="newsletters" className="text-base">
                          Newsletters
                        </Label>
                        <p className="text-sm text-muted-foreground">Weekly and monthly newsletter updates</p>
                      </div>
                      <Switch
                        id="newsletters"
                        checked={preferences.newsletters}
                        onCheckedChange={(checked) => handlePreferenceChange("newsletters", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="eventInvitations" className="text-base">
                          Event Invitations
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Invitations to webinars, conferences, and special events
                        </p>
                      </div>
                      <Switch
                        id="eventInvitations"
                        checked={preferences.eventInvitations}
                        onCheckedChange={(checked) => handlePreferenceChange("eventInvitations", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="specialOffers" className="text-base">
                          Special Offers
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Exclusive deals, discounts, and promotional content
                        </p>
                      </div>
                      <Switch
                        id="specialOffers"
                        checked={preferences.specialOffers}
                        onCheckedChange={(checked) => handlePreferenceChange("specialOffers", checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      {saveMessage && (
                        <p className={`text-sm ${saveMessage.includes("Failed") ? "text-red-600" : "text-green-600"}`}>
                          {saveMessage}
                        </p>
                      )}
                    </div>
                    <Button onClick={handleSavePreferences} disabled={isSaving || !pushStatus.subscribed}>
                      {isSaving ? "Saving..." : "Save Preferences"}
                    </Button>
                  </div>
                  {!pushStatus.subscribed && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Enable push notifications above to save your preferences.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testing Tab */}
          <TabsContent value="testing">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Send className="h-5 w-5" />
                  <span>Test Notifications</span>
                </CardTitle>
                <CardDescription>
                  Send yourself a test notification to verify your settings are working correctly.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800 dark:text-blue-200">How testing works</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Clicking the button below will send a test notification to this device. Make sure push
                        notifications are enabled and your browser is not in focus when the notification arrives.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <Button
                    onClick={handleSendTestNotification}
                    disabled={isSendingTest || !pushStatus.subscribed}
                    size="lg"
                    className="w-full max-w-xs"
                  >
                    {isSendingTest ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Test Notification
                      </>
                    )}
                  </Button>

                  {!pushStatus.subscribed && (
                    <p className="text-sm text-muted-foreground text-center max-w-md">
                      You need to enable push notifications before you can send a test notification.
                    </p>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <span>Quiet Hours</span>
                    <Badge variant="outline">Coming Soon</Badge>
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Soon you'll be able to set quiet hours when you don't want to receive notifications. We'll hold your
                    notifications and deliver them when your quiet hours end.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
