"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  ArrowLeft,
  Database,
  Code,
} from "lucide-react"
import { getUserSessions, revokeSession, revokeAllOtherSessions } from "@/app/actions/session-actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"

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
  switch (deviceType?.toLowerCase()) {
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

  // Simple date formatting without external library
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  }
  return time.toLocaleDateString("en-US", options)
}

export default function SessionsClientPage() {
  const router = useRouter()
  const { user, session, isLoading: authLoading } = useAuth()

  const [sessions, setSessions] = useState<SessionData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tableExists, setTableExists] = useState<boolean | null>(null)
  const [revoking, setRevoking] = useState<string | null>(null)
  const [revokingAll, setRevokingAll] = useState(false)
  const [showRevokeDialog, setShowRevokeDialog] = useState<string | null>(null)
  const [showRevokeAllDialog, setShowRevokeAllDialog] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("sessions")

  // Fetch sessions
  const fetchSessions = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getUserSessions()

      if (result.success) {
        setSessions(result.data || [])
        setTableExists(true)
      } else {
        // Check for specific error messages
        if (
          result.error?.includes("table doesn't exist") ||
          result.error?.includes("user_sessions") ||
          result.error?.includes("relation") ||
          result.error?.includes("42P01")
        ) {
          setTableExists(false)
          setError("The sessions table doesn't exist yet. Please create it first.")
        } else if (result.error?.includes("Not authenticated")) {
          setError("You need to be logged in to view sessions.")
        } else {
          setError(result.error || "Failed to fetch sessions")
        }
      }
    } catch (error) {
      console.error("Error fetching sessions:", error)
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Only fetch sessions when user is authenticated and not loading
  useEffect(() => {
    if (!authLoading && user && session) {
      fetchSessions()
    } else if (!authLoading && !user) {
      setLoading(false)
    }
  }, [authLoading, user, session])

  // Handle session revocation
  const handleRevokeSession = async (sessionId: string) => {
    setRevoking(sessionId)

    try {
      const result = await revokeSession(sessionId)

      if (result.success) {
        // Remove the session from the list
        setSessions((prev) => prev.filter((session) => session.id !== sessionId))
        setShowRevokeDialog(null)
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
        setShowRevokeAllDialog(false)
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

  const createTableSQL = `-- Create user_sessions table for tracking active sessions
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  location TEXT,
  device_type TEXT DEFAULT 'desktop',
  browser TEXT DEFAULT 'unknown',
  os TEXT DEFAULT 'unknown',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  UNIQUE(session_token)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_activity ON user_sessions(last_activity);

-- Enable RLS
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can view their own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can insert their own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can update their own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can delete their own sessions" ON user_sessions;

CREATE POLICY "Users can view their own sessions" ON user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions" ON user_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON user_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" ON user_sessions
  FOR DELETE USING (auth.uid() = user_id);`

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/profile?tab=security")}
                    className="p-0 h-auto"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Security
                  </Button>
                </div>
                <h1 className="text-2xl font-bold">Active Sessions</h1>
                <p className="text-muted-foreground">
                  Manage your active login sessions and revoke access from devices you don't recognize
                </p>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading authentication...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Show authentication error if not logged in
  if (!user || !session) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/profile?tab=security")}
                    className="p-0 h-auto"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Security
                  </Button>
                </div>
                <h1 className="text-2xl font-bold">Active Sessions</h1>
                <p className="text-muted-foreground">
                  Manage your active login sessions and revoke access from devices you don't recognize
                </p>
              </div>
            </div>

            <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <span>Authentication Required</span>
                </CardTitle>
                <CardDescription>You need to be logged in to view your sessions.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-amber-800 dark:text-amber-300">
                  Please sign in to your account to view and manage your active sessions.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.push("/profile?tab=security")}>
                  Go Back
                </Button>
                <Button onClick={() => router.push("/auth/sign-in")}>Sign In</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/profile?tab=security")}
                  className="p-0 h-auto"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Security
                </Button>
              </div>
              <h1 className="text-2xl font-bold">Active Sessions</h1>
              <p className="text-muted-foreground">
                Manage your active login sessions and revoke access from devices you don't recognize
              </p>
            </div>
            <Button variant="outline" onClick={fetchSessions} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {/* Table Doesn't Exist Error */}
          {tableExists === false && (
            <Tabs defaultValue="info" className="w-full" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Information</TabsTrigger>
                <TabsTrigger value="sql">SQL Setup</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Database className="h-5 w-5 text-amber-500" />
                      <span>Database Setup Required</span>
                    </CardTitle>
                    <CardDescription>
                      The sessions table doesn't exist in your database. You need to create it first.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p>
                        To use the sessions feature, you need to create the{" "}
                        <code className="bg-muted px-1 py-0.5 rounded">user_sessions</code> table in your Supabase
                        database. This table will store information about active login sessions.
                      </p>
                      <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-md border border-amber-200 dark:border-amber-800">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                          <div className="text-amber-800 dark:text-amber-300 text-sm">
                            <p className="font-medium">You need to run the SQL script to create the table</p>
                            <p className="mt-1">
                              Go to the SQL tab above and copy the SQL script. Then run it in your Supabase SQL editor.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => router.push("/profile?tab=security")}>
                      Go Back
                    </Button>
                    <Button onClick={() => setActiveTab("sql")}>View SQL Script</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="sql">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Code className="h-5 w-5 text-blue-500" />
                      <span>SQL Setup Script</span>
                    </CardTitle>
                    <CardDescription>
                      Run this SQL script in your Supabase SQL editor to create the sessions table
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-x-auto text-xs sm:text-sm max-h-96 overflow-y-auto">
                        <code>{createTableSQL}</code>
                      </pre>
                      <Button
                        className="absolute top-2 right-2"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(createTableSQL)
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                    <div className="mt-4 space-y-4">
                      <h3 className="text-lg font-medium">How to run this script:</h3>
                      <ol className="list-decimal pl-5 space-y-2 text-sm">
                        <li>Go to your Supabase dashboard</li>
                        <li>Click on "SQL Editor" in the left sidebar</li>
                        <li>Create a "New Query"</li>
                        <li>Paste the SQL script above</li>
                        <li>Click "Run" to execute the script</li>
                        <li>Come back here and click "Refresh" below</li>
                      </ol>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("info")}>
                      Back to Info
                    </Button>
                    <Button onClick={fetchSessions}>
                      <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                      Refresh
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {/* Error Message */}
          {tableExists === true && error && (
            <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-red-800 dark:text-red-200">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {tableExists === true && loading && (
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
          {tableExists === true && !loading && (
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
                      <Badge variant="success">Active</Badge>
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
                      <Button variant="outline" disabled={revokingAll} onClick={() => setShowRevokeAllDialog(true)}>
                        <LogOut className="h-4 w-4 mr-2" />
                        {revokingAll ? "Revoking..." : "Revoke All"}
                      </Button>
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
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={revoking === session.id}
                              onClick={() => setShowRevokeDialog(session.id)}
                            >
                              <LogOut className="h-4 w-4 mr-2" />
                              {revoking === session.id ? "Revoking..." : "Revoke"}
                            </Button>
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
          {tableExists === true && (
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Security Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700 dark:text-blue-300">
                <ul className="space-y-2 text-sm">
                  <li>• Regularly review your active sessions and revoke any you don't recognize</li>
                  <li>• If you see suspicious activity, revoke all sessions and change your password immediately</li>
                  <li>• Always sign out from public or shared computers</li>
                  <li>• Enable two-factor authentication for additional security</li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Revoke Single Session Dialog */}
        <Dialog open={!!showRevokeDialog} onOpenChange={() => setShowRevokeDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Revoke Session?</DialogTitle>
              <DialogDescription>
                This will sign out this device and end the session. The user will need to sign in again to access their
                account from this device.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRevokeDialog(null)}>
                Cancel
              </Button>
              <Button onClick={() => showRevokeDialog && handleRevokeSession(showRevokeDialog)} disabled={!!revoking}>
                Revoke Session
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Revoke All Sessions Dialog */}
        <Dialog open={showRevokeAllDialog} onOpenChange={setShowRevokeAllDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Revoke All Other Sessions?</DialogTitle>
              <DialogDescription>
                This will sign out all other devices and sessions. You will remain signed in on this device. This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRevokeAllDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleRevokeAllOtherSessions} disabled={revokingAll}>
                Revoke All Sessions
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
