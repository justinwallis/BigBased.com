"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  MapPin,
  Clock,
  Shield,
  LogOut,
  RefreshCw,
  AlertTriangle,
} from "lucide-react"
import { getUserSessions, revokeSession, revokeAllOtherSessions } from "@/app/actions/session-actions"
import { format } from "date-fns"

interface SessionData {
  id: string
  user_id: string
  session_token: string
  ip_address: string
  user_agent: string
  location?: string
  device_type: string
  browser: string
  os: string
  is_current: boolean
  created_at: string
  last_activity: string
  expires_at?: string
}

// Helper function to get device icon
function getDeviceIcon(deviceType: string) {
  switch (deviceType.toLowerCase()) {
    case "mobile":
      return <Smartphone className="h-4 w-4" />
    case "tablet":
      return <Tablet className="h-4 w-4" />
    default:
      return <Monitor className="h-4 w-4" />
  }
}

// Helper function to format time ago
function formatTimeAgo(timestamp: string) {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return "Just now"
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`

  return format(time, "MMM d, yyyy")
}

export default function SessionsClientPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [sessions, setSessions] = useState<SessionData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [revoking, setRevoking] = useState<string | null>(null)
  const [revokingAll, setRevokingAll] = useState(false)

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.push("/auth/sign-in")
      }
    }

    checkAuth()
  }, [router, supabase])

  // Fetch sessions
  const fetchSessions = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getUserSessions()

      if (result.success) {
        setSessions(result.data || [])
      } else {
        setError(result.error || "Failed to fetch sessions")
      }
    } catch (error) {
      console.error("Error fetching sessions:", error)
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  // Handle session revocation
  const handleRevokeSession = async (sessionId: string) => {
    setRevoking(sessionId)

    try {
      const result = await revokeSession(sessionId)

      if (result.success) {
        // Remove the session from the list
        setSessions((prev) => prev.filter((session) => session.id !== sessionId))
      } else {
        setError(result.error || "Failed to revoke session")
      }
    } catch (error) {
      console.error("Error revoking session:", error)
      setError("An unexpected error occurred")
    } finally {
      setRevoking(null)
    }
  }

  // Handle revoking all other sessions
  const handleRevokeAllOtherSessions = async () => {
    setRevokingAll(true)

    try {
      const result = await revokeAllOtherSessions()

      if (result.success) {
        // Keep only the current session
        setSessions((prev) => prev.filter((session) => session.is_current))
      } else {
        setError(result.error || "Failed to revoke sessions")
      }
    } catch (error) {
      console.error("Error revoking all sessions:", error)
      setError("An unexpected error occurred")
    } finally {
      setRevokingAll(false)
    }
  }

  const currentSession = sessions.find((session) => session.is_current)
  const otherSessions = sessions.filter((session) => !session.is_current)

  return (
    <div className="container max-w-4xl py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Active Sessions</h1>
            <p className="text-muted-foreground">
              Manage your active login sessions and revoke access from devices you don't recognize
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={fetchSessions} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={() => router.push("/profile?tab=security")}>
              Back to Security
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-red-800">
                <AlertTriangle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading sessions...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sessions Content */}
        {!loading && (
          <>
            {/* Current Session */}
            {currentSession && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-green-500" />
                        <span>Current Session</span>
                      </CardTitle>
                      <CardDescription>This is your current active session</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        {getDeviceIcon(currentSession.device_type)}
                        <span className="font-medium">
                          {currentSession.browser} on {currentSession.os}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Globe className="h-4 w-4" />
                        <span>{currentSession.ip_address}</span>
                        {currentSession.location && (
                          <>
                            <MapPin className="h-4 w-4 ml-2" />
                            <span>{currentSession.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Started {formatTimeAgo(currentSession.created_at)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Last activity {formatTimeAgo(currentSession.last_activity)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Other Sessions */}
            {otherSessions.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Other Sessions</CardTitle>
                      <CardDescription>
                        {otherSessions.length} other active session{otherSessions.length !== 1 ? "s" : ""}
                      </CardDescription>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" disabled={revokingAll}>
                          <LogOut className="h-4 w-4 mr-2" />
                          {revokingAll ? "Revoking..." : "Revoke All"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Revoke All Other Sessions?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will sign out all other devices and sessions. You will remain signed in on this device.
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleRevokeAllOtherSessions}>
                            Revoke All Sessions
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {otherSessions.map((session, index) => (
                      <div key={session.id}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              {getDeviceIcon(session.device_type)}
                              <span className="font-medium">
                                {session.browser} on {session.os}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-2">
                                <Globe className="h-4 w-4" />
                                <span>{session.ip_address}</span>
                                {session.location && (
                                  <>
                                    <MapPin className="h-4 w-4 ml-2" />
                                    <span>{session.location}</span>
                                  </>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4" />
                                <span>Last activity {formatTimeAgo(session.last_activity)}</span>
                              </div>
                            </div>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" disabled={revoking === session.id}>
                                <LogOut className="h-4 w-4 mr-2" />
                                {revoking === session.id ? "Revoking..." : "Revoke"}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Revoke Session?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will sign out this device and end the session. The user will need to sign in
                                  again to access their account from this device.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleRevokeSession(session.id)}>
                                  Revoke Session
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                        {index < otherSessions.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* No Other Sessions */}
            {otherSessions.length === 0 && currentSession && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <h3 className="text-lg font-medium mb-2">No Other Active Sessions</h3>
                    <p className="text-muted-foreground">
                      You're only signed in on this device. This is good for security!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* No Sessions at All */}
            {sessions.length === 0 && !loading && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                    <h3 className="text-lg font-medium mb-2">No Active Sessions Found</h3>
                    <p className="text-muted-foreground">
                      We couldn't find any active sessions. This might indicate a technical issue.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Security Tips */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <ul className="space-y-2 text-sm">
              <li>• Regularly review your active sessions and revoke any you don't recognize</li>
              <li>• If you see suspicious activity, revoke all sessions and change your password immediately</li>
              <li>• Always sign out from public or shared computers</li>
              <li>• Enable two-factor authentication for additional security</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
