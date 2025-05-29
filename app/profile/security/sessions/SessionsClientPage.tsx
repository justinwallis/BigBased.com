"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
  Clock,
  Trash2,
  RefreshCw,
  Bug,
  Database,
  Settings,
  Zap,
  TestTube,
  CheckCircle,
  AlertTriangle,
  Globe,
  Wifi,
  Activity,
  LogOut,
} from "lucide-react"
import { getUserSessions, revokeSession, revokeAllOtherSessions } from "@/app/actions/session-actions"
import { debugDatabaseConnection, checkEnvironmentVariables } from "@/app/actions/database-connection-debug"
import {
  createUserSessionsTableInNeon,
  debugNeonConnection,
  testNeonSessionOperations,
} from "@/app/actions/neon-database-setup"
import { useAuth } from "@/contexts/auth-context"

interface UserSession {
  id: string
  user_id: string
  session_token: string
  ip_address?: string
  user_agent?: string
  location?: string
  device_type?: string
  browser?: string
  os?: string
  created_at: string
  last_activity: string
  expires_at?: string
  is_current?: boolean
}

export default function SessionsClientPage() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<UserSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tableExists, setTableExists] = useState<boolean | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [showDebug, setShowDebug] = useState(false)
  const [revoking, setRevoking] = useState<string | null>(null)
  const [revokingAll, setRevokingAll] = useState(false)

  const loadSessions = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getUserSessions()

      if (result.success && result.data) {
        // Filter out expired sessions and clean them up
        const now = new Date()
        const validSessions = result.data.filter((session) => {
          if (session.expires_at) {
            const expiresAt = new Date(session.expires_at)
            return expiresAt > now
          }
          return true
        })

        setSessions(validSessions)
        setTableExists(true)
      } else {
        setError(result.error || "Failed to load sessions")
        setTableExists(result.tableExists ?? false)
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error("Error loading sessions:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSessions()

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadSessions, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleRevokeSession = async (sessionId: string) => {
    setRevoking(sessionId)
    try {
      const result = await revokeSession(sessionId)
      if (result.success) {
        await loadSessions() // Reload sessions
      } else {
        setError(result.error || "Failed to revoke session")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error("Error revoking session:", err)
    } finally {
      setRevoking(null)
    }
  }

  const handleRevokeAllOther = async () => {
    setRevokingAll(true)
    try {
      const result = await revokeAllOtherSessions()
      if (result.success) {
        await loadSessions() // Reload sessions
      } else {
        setError(result.error || "Failed to revoke sessions")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error("Error revoking all sessions:", err)
    } finally {
      setRevokingAll(false)
    }
  }

  const handleDatabaseDebug = async () => {
    try {
      const result = await debugDatabaseConnection()
      setDebugInfo({ type: "supabase-database", ...result })
      console.log("Supabase database debug result:", result)
    } catch (err) {
      console.error("Database debug error:", err)
    }
  }

  const handleNeonDebug = async () => {
    try {
      const result = await debugNeonConnection()
      setDebugInfo({ type: "neon-database", ...result })
      console.log("Neon database debug result:", result)
    } catch (err) {
      console.error("Neon debug error:", err)
    }
  }

  const handleEnvDebug = async () => {
    try {
      const result = await checkEnvironmentVariables()
      setDebugInfo({ type: "environment", ...result })
      console.log("Environment debug result:", result)
    } catch (err) {
      console.error("Environment debug error:", err)
    }
  }

  const handleCreateNeonTable = async () => {
    try {
      setLoading(true)
      const result = await createUserSessionsTableInNeon()
      setDebugInfo({ type: "neon-create-table", ...result })
      console.log("Neon create table result:", result)

      if (result.success) {
        setTableExists(true)
        await loadSessions()
      } else {
        setError(result.error || "Failed to create table in Neon")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error("Create Neon table error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleTestNeonOperations = async () => {
    if (!user?.id) {
      setError("User not authenticated")
      return
    }

    try {
      const result = await testNeonSessionOperations(user.id)
      setDebugInfo({ type: "neon-operations", ...result })
      console.log("Neon operations test result:", result)
    } catch (err) {
      console.error("Neon operations test error:", err)
    }
  }

  const getDeviceIcon = (deviceType?: string) => {
    switch (deviceType?.toLowerCase()) {
      case "mobile":
        return <Smartphone className="h-5 w-5 text-blue-500 dark:text-blue-400" />
      case "tablet":
        return <Tablet className="h-5 w-5 text-purple-500 dark:text-purple-400" />
      default:
        return <Monitor className="h-5 w-5 text-green-500 dark:text-green-400" />
    }
  }

  const getBrowserIcon = (browser?: string) => {
    switch (browser?.toLowerCase()) {
      case "chrome":
        return "🌐"
      case "firefox":
        return "🦊"
      case "safari":
        return "🧭"
      case "edge":
        return "🔷"
      default:
        return "🌍"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const getSessionStatus = (session: UserSession) => {
    const lastActivity = new Date(session.last_activity)
    const now = new Date()
    const diffMins = Math.floor((now.getTime() - lastActivity.getTime()) / 60000)

    if (session.is_current)
      return { status: "current", color: "bg-green-500 dark:bg-green-500", text: "Current Session" }
    if (diffMins < 5) return { status: "active", color: "bg-blue-500 dark:bg-blue-500", text: "Active" }
    if (diffMins < 60) return { status: "recent", color: "bg-yellow-500 dark:bg-yellow-500", text: "Recent" }
    return { status: "idle", color: "bg-gray-500 dark:bg-gray-400", text: "Idle" }
  }

  if (tableExists === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950/90 p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
              <Database className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Session Management
            </h1>
            <p className="text-xl text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto">
              Track and manage your active sessions across all devices
            </p>
          </div>

          <Card className="border-2 border-dashed border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-3 text-blue-800 dark:text-blue-300">
                <Settings className="h-6 w-6" />
                Database Setup Required
              </CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-400">
                The sessions table needs to be created in your Neon database to start tracking sessions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-950/30">
                <Database className="h-4 w-4 text-blue-700 dark:text-blue-400" />
                <AlertDescription className="text-blue-800 dark:text-blue-300">
                  <strong>Architecture:</strong> Your app uses <strong>Neon</strong> for the main database and{" "}
                  <strong>Supabase</strong> for authentication. The sessions table will be created in Neon.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={handleCreateNeonTable} disabled={loading} size="lg" className="h-12">
                  <Zap className="h-5 w-5 mr-2" />
                  {loading ? "Creating..." : "Create Sessions Table"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNeonDebug}
                  size="lg"
                  className="h-12 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  <Database className="h-5 w-5 mr-2" />
                  Test Neon Connection
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={handleTestNeonOperations}
                  className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  Test Operations
                </Button>
                <Button
                  variant="outline"
                  onClick={handleEnvDebug}
                  className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Check Environment
                </Button>
              </div>

              {debugInfo && (
                <Card className="bg-muted/50 dark:bg-gray-900/50 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-sm dark:text-gray-300">Debug Information ({debugInfo.type})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs overflow-auto max-h-64 p-4 bg-background dark:bg-gray-950 rounded border dark:border-gray-800">
                      {JSON.stringify(debugInfo, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950/90 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Active Sessions
            </h1>
            <p className="text-muted-foreground dark:text-gray-400">
              Monitor and manage your sessions across all devices and locations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDebug(!showDebug)}
              size="sm"
              className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <Bug className="h-4 w-4 mr-2" />
              Debug
            </Button>
            <Button
              variant="outline"
              onClick={loadSessions}
              disabled={loading}
              size="sm"
              className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="border-red-200 dark:border-red-800/50 dark:bg-red-950/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="font-medium dark:text-red-300">{error}</AlertDescription>
          </Alert>
        )}

        {/* Debug Panel */}
        {showDebug && debugInfo && (
          <Card className="border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle className="text-amber-800 dark:text-amber-300">Debug Information ({debugInfo.type})</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto max-h-64 p-4 bg-background dark:bg-gray-950 rounded border dark:border-gray-800">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && !sessions.length ? (
          <Card className="border-2 border-dashed dark:border-gray-800 dark:bg-gray-900/50">
            <CardContent className="pt-12 pb-12">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-muted dark:border-gray-700 rounded-full"></div>
                  <div className="w-12 h-12 border-4 border-primary dark:border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                </div>
                <p className="text-muted-foreground dark:text-gray-400">Loading your sessions...</p>
              </div>
            </CardContent>
          </Card>
        ) : sessions.length === 0 ? (
          /* Empty State */
          <Card className="border-2 border-dashed dark:border-gray-800 dark:bg-gray-900/50">
            <CardContent className="pt-12 pb-12">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted dark:bg-gray-800">
                  <Activity className="h-8 w-8 text-muted-foreground dark:text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold dark:text-white">No Active Sessions</h3>
                <p className="text-muted-foreground dark:text-gray-400 max-w-md mx-auto">
                  You don't have any tracked sessions yet. Sessions will appear here when you sign in from different
                  devices or browsers.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Sessions List */
          <>
            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="dark:bg-gray-900 dark:border-gray-800">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                    <div>
                      <p className="text-2xl font-bold dark:text-white">{sessions.length}</p>
                      <p className="text-sm text-muted-foreground dark:text-gray-400">Total Sessions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="dark:bg-gray-900 dark:border-gray-800">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                    <div>
                      <p className="text-2xl font-bold dark:text-white">
                        {sessions.filter((s) => s.is_current).length}
                      </p>
                      <p className="text-sm text-muted-foreground dark:text-gray-400">Current Session</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="dark:bg-gray-900 dark:border-gray-800">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    <div>
                      <p className="text-2xl font-bold dark:text-white">
                        {new Set(sessions.map((s) => s.ip_address)).size}
                      </p>
                      <p className="text-sm text-muted-foreground dark:text-gray-400">Unique Locations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                {sessions.length} active session{sessions.length !== 1 ? "s" : ""} found
              </p>
              {sessions.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRevokeAllOther}
                  disabled={revokingAll}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20 dark:border-red-900/50"
                >
                  {revokingAll ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4 mr-2" />
                  )}
                  {revokingAll ? "Revoking..." : "Sign Out All Other Devices"}
                </Button>
              )}
            </div>

            {/* Sessions Grid */}
            <div className="grid gap-4">
              {sessions.map((session) => {
                const sessionStatus = getSessionStatus(session)
                return (
                  <Card
                    key={session.id}
                    className={`transition-all duration-200 hover:shadow-lg dark:hover:shadow-none ${
                      session.is_current
                        ? "ring-2 ring-green-500 bg-green-50/50 dark:bg-green-950/10 border-green-200 dark:border-green-800/50"
                        : "hover:border-primary/50 dark:bg-gray-900 dark:border-gray-800 dark:hover:border-blue-800/50"
                    }`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="flex-shrink-0">{getDeviceIcon(session.device_type)}</div>
                          <div className="space-y-3 flex-1">
                            {/* Main Info */}
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="font-semibold text-lg dark:text-white">
                                {getBrowserIcon(session.browser)} {session.browser} on {session.os}
                              </span>
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${sessionStatus.color}`}></div>
                                <Badge
                                  variant={session.is_current ? "default" : "secondary"}
                                  className={
                                    session.is_current
                                      ? "bg-green-500 hover:bg-green-600 text-white"
                                      : "dark:bg-gray-800 dark:text-gray-300"
                                  }
                                >
                                  {sessionStatus.text}
                                </Badge>
                              </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              {session.ip_address && (
                                <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                                  <MapPin className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                  <span className="font-mono">{session.ip_address}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                                <Clock className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                                <span>Active {formatDate(session.last_activity)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                                <Wifi className="h-4 w-4 text-green-500 dark:text-green-400" />
                                <span>Since {formatDate(session.created_at)}</span>
                              </div>
                            </div>

                            {/* Device Type Badge */}
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="text-xs dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                              >
                                {session.device_type?.charAt(0).toUpperCase() + session.device_type?.slice(1)}
                              </Badge>
                              {session.expires_at && (
                                <Badge
                                  variant="outline"
                                  className="text-xs dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                                >
                                  Expires {formatDate(session.expires_at)}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        {!session.is_current && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRevokeSession(session.id)}
                            disabled={revoking === session.id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20 dark:border-red-900/50 dark:bg-gray-800 ml-4"
                          >
                            {revoking === session.id ? (
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            {revoking === session.id ? "Revoking..." : "Sign Out"}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
