"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  MapPin,
  Clock,
  Shield,
  LogOut,
  Trash2,
  RefreshCw,
  Home,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { getUserSessions, revokeSession, revokeAllOtherSessions } from "@/app/actions/session-actions"
import Link from "next/link"
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

export default function SessionsClientPage() {
  const { user, isLoading, signOut } = useAuth()
  const router = useRouter()
  const [sessions, setSessions] = useState([])
  const [isLoadingSessions, setIsLoadingSessions] = useState(true)
  const [error, setError] = useState("")
  const [revokingSessionId, setRevokingSessionId] = useState(null)
  const [revokingAll, setRevokingAll] = useState(false)
  const [neonDebug, setNeonDebug] = useState({
    connectionStatus: "checking",
    databaseUrl: "",
    tableExists: false,
    error: null,
    sessionCount: 0,
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/sign-in?redirect=/profile/security/sessions")
    }
  }, [isLoading, user, router])

  useEffect(() => {
    if (user) {
      loadSessions()
      // Auto-refresh every 30 seconds
      const interval = setInterval(loadSessions, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  useEffect(() => {
    testNeonConnection()
  }, [])

  const loadSessions = async () => {
    try {
      setError("")
      setIsLoadingSessions(true)
      const result = await getUserSessions()
      if (result.success && result.sessions) {
        setSessions(result.sessions)
      } else {
        setError(result.error || "Failed to load sessions")
      }
    } catch (err) {
      setError("An error occurred while loading sessions")
      console.error("Error loading sessions:", err)
    } finally {
      setIsLoadingSessions(false)
    }
  }

  const handleRevokeSession = async (sessionId) => {
    setRevokingSessionId(sessionId)
    try {
      const result = await revokeSession(sessionId)
      if (result.success) {
        await loadSessions() // Refresh the list
      } else {
        setError(result.error || "Failed to revoke session")
      }
    } catch (err) {
      setError("An error occurred while revoking the session")
      console.error("Error revoking session:", err)
    } finally {
      setRevokingSessionId(null)
    }
  }

  const handleRevokeAllOtherSessions = async () => {
    setRevokingAll(true)
    try {
      const result = await revokeAllOtherSessions()
      if (result.success) {
        await loadSessions() // Refresh the list
      } else {
        setError(result.error || "Failed to revoke all sessions")
      }
    } catch (err) {
      setError("An error occurred while revoking all sessions")
      console.error("Error revoking all sessions:", err)
    } finally {
      setRevokingAll(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const getDeviceIcon = (session) => {
    if (session.device_type === "mobile") {
      return <Smartphone className="h-5 w-5" />
    }
    if (session.device_type === "tablet") {
      return <Tablet className="h-5 w-5" />
    }
    return <Monitor className="h-5 w-5" />
  }

  const getBrowserEmoji = (browser) => {
    if (browser?.toLowerCase().includes("chrome")) return "🌐"
    if (browser?.toLowerCase().includes("firefox")) return "🦊"
    if (browser?.toLowerCase().includes("safari")) return "🧭"
    if (browser?.toLowerCase().includes("edge")) return "🔷"
    return "🌍"
  }

  const getStatusColor = (session) => {
    if (session.is_current) return "bg-green-500"

    const now = new Date()
    const lastActive = new Date(session.last_activity)
    const diffInMinutes = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60))

    if (diffInMinutes < 30) return "bg-green-500" // Active in last 30 min
    if (diffInMinutes < 60 * 24) return "bg-yellow-500" // Active in last 24 hours
    return "bg-gray-500" // Inactive for more than 24 hours
  }

  const getStatusText = (session) => {
    if (session.is_current) return "Current"

    const now = new Date()
    const lastActive = new Date(session.last_activity)
    const diffInMinutes = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60))

    if (diffInMinutes < 5) return "Active"
    if (diffInMinutes < 30) return "Recent"
    if (diffInMinutes < 60) return "Active < 1h ago"
    if (diffInMinutes < 60 * 24) return "Active today"
    return "Inactive"
  }

  const formatRelativeTime = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    return time.toLocaleDateString()
  }

  const getDeviceInfo = (session) => {
    return `${session.browser || "Unknown"} on ${session.os || "Unknown Device"}`
  }

  const testNeonConnection = async () => {
    try {
      setNeonDebug((prev) => ({ ...prev, connectionStatus: "testing" }))

      // Test basic connection and get debug info
      const response = await fetch("/api/debug/neon-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      const debugInfo = await response.json()
      setNeonDebug(debugInfo)
    } catch (error) {
      setNeonDebug((prev) => ({
        ...prev,
        connectionStatus: "error",
        error: error.message,
      }))
    }
  }

  const createSessionsTable = async () => {
    try {
      const response = await fetch("/api/debug/create-sessions-table", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      const result = await response.json()

      if (result.success) {
        // Refresh the debug info
        await testNeonConnection()
        // Refresh sessions
        await loadSessions()
      } else {
        setError(`Failed to create table: ${result.error}`)
      }
    } catch (error) {
      setError(`Error creating table: ${error.message}`)
    }
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto py-10">
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Loading Sessions...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                <span>Loading your session information...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const activeSessions = sessions.filter((s) => {
    const now = new Date()
    const lastActive = new Date(s.last_activity)
    const diffInHours = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60))
    return diffInHours < 24 // Consider sessions active if used in last 24 hours
  })

  const inactiveSessions = sessions.filter((s) => {
    const now = new Date()
    const lastActive = new Date(s.last_activity)
    const diffInHours = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60))
    return diffInHours >= 24 // Consider sessions inactive if not used in last 24 hours
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/profile/security">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Security</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Active Sessions
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your login sessions across all devices</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle
              variant="button"
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
            />
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sessions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{sessions.length}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Sessions</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeSessions.length}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Globe className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inactive Sessions</p>
                  <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{inactiveSessions.length}</p>
                </div>
                <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Neon Debug Section */}
        <Card className="border-0 shadow-lg bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <RefreshCw className="h-5 w-5" />
              Neon Database Debug
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Connection Status:</strong>
                <span
                  className={`ml-2 px-2 py-1 rounded text-xs ${
                    neonDebug.connectionStatus === "connected"
                      ? "bg-green-100 text-green-800"
                      : neonDebug.connectionStatus === "error"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {neonDebug.connectionStatus}
                </span>
              </div>
              <div>
                <strong>Database URL:</strong>
                <span className="ml-2 font-mono text-xs">
                  {neonDebug.databaseUrl ? `${neonDebug.databaseUrl.substring(0, 30)}...` : "Not found"}
                </span>
              </div>
              <div>
                <strong>user_sessions Table:</strong>
                <span
                  className={`ml-2 px-2 py-1 rounded text-xs ${
                    neonDebug.tableExists ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {neonDebug.tableExists ? "Exists" : "Missing"}
                </span>
              </div>
              <div>
                <strong>Session Count:</strong>
                <span className="ml-2 font-semibold">{neonDebug.sessionCount}</span>
              </div>
            </div>
            {neonDebug.error && (
              <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                <strong className="text-red-800 dark:text-red-200">Error:</strong>
                <pre className="text-xs mt-1 text-red-700 dark:text-red-300 whitespace-pre-wrap">{neonDebug.error}</pre>
              </div>
            )}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={testNeonConnection}
                className="text-yellow-700 border-yellow-300"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retest Connection
              </Button>
              {!neonDebug.tableExists && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={createSessionsTable}
                  className="text-blue-700 border-blue-300"
                >
                  Create Sessions Table
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <CardContent className="p-4">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Sessions List */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Shield className="h-5 w-5" />
                  Session Management
                </CardTitle>
                <CardDescription className="mt-1">
                  Monitor and control access to your account across all devices
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadSessions}
                  disabled={isLoadingSessions}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingSessions ? "animate-spin" : ""}`} />
                  Refresh
                </Button>

                {sessions.length > 1 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={revokingAll}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 text-red-600"
                      >
                        {revokingAll ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            <span>Revoking...</span>
                          </>
                        ) : (
                          <>
                            <LogOut className="h-4 w-4 mr-2" />
                            <span>Revoke All Other Sessions</span>
                          </>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Revoke All Other Sessions?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will sign out all your other devices. You will remain signed in on this device only. This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRevokeAllOtherSessions}>
                          Revoke All Other Sessions
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingSessions ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                <span className="text-gray-600 dark:text-gray-400">Loading sessions...</span>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No sessions found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Active Sessions */}
                {activeSessions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      Active Sessions ({activeSessions.length})
                    </h3>
                    <div className="space-y-3">
                      {activeSessions.map((session) => (
                        <div
                          key={session.id}
                          className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                              <div className="flex items-center space-x-2">
                                {getDeviceIcon(session)}
                                <span className="text-lg">{getBrowserEmoji(session.browser)}</span>
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                    {getDeviceInfo(session)}
                                  </h4>
                                  {session.is_current && (
                                    <Badge
                                      variant="secondary"
                                      className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                    >
                                      Current Session
                                    </Badge>
                                  )}
                                  <div className="flex items-center space-x-1">
                                    <div className={`h-2 w-2 rounded-full ${getStatusColor(session)}`}></div>
                                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                      {getStatusText(session)}
                                    </span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400">
                                  <div className="flex items-center space-x-1">
                                    <Globe className="h-3 w-3" />
                                    <span className="truncate">{session.ip_address}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="h-3 w-3" />
                                    <span className="truncate">{session.location || "Unknown Location"}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-3 w-3" />
                                    <span>Last active {formatRelativeTime(session.last_activity)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 ml-4">
                              {!session.is_current && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      disabled={revokingSessionId === session.id}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
                                    >
                                      {revokingSessionId === session.id ? (
                                        <RefreshCw className="h-3 w-3 animate-spin" />
                                      ) : (
                                        <Trash2 className="h-3 w-3" />
                                      )}
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Revoke Session?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will sign out this device immediately. The user will need to sign in again
                                        to access their account from this device.
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
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inactive Sessions */}
                {inactiveSessions.length > 0 && (
                  <>
                    {activeSessions.length > 0 && <Separator className="my-6" />}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                        Inactive Sessions ({inactiveSessions.length})
                      </h3>
                      <div className="space-y-3">
                        {inactiveSessions.map((session) => (
                          <div
                            key={session.id}
                            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-75"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4 flex-1">
                                <div className="flex items-center space-x-2">
                                  {getDeviceIcon(session)}
                                  <span className="text-lg grayscale">{getBrowserEmoji(session.browser)}</span>
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <h4 className="font-medium text-gray-700 dark:text-gray-300 truncate">
                                      {getDeviceInfo(session)}
                                    </h4>
                                    <div className="flex items-center space-x-1">
                                      <div className={`h-2 w-2 rounded-full ${getStatusColor(session)}`}></div>
                                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {getStatusText(session)}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-500 dark:text-gray-500">
                                    <div className="flex items-center space-x-1">
                                      <Globe className="h-3 w-3" />
                                      <span className="truncate">{session.ip_address}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <MapPin className="h-3 w-3" />
                                      <span className="truncate">{session.location || "Unknown Location"}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Clock className="h-3 w-3" />
                                      <span>Last active {formatRelativeTime(session.last_activity)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2 ml-4">
                                {!session.is_current && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={revokingSessionId === session.id}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
                                      >
                                        {revokingSessionId === session.id ? (
                                          <RefreshCw className="h-3 w-3 animate-spin" />
                                        ) : (
                                          <Trash2 className="h-3 w-3" />
                                        )}
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Revoke Session?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This will sign out this device immediately. The user will need to sign in
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
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Tips */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <Shield className="h-5 w-5" />
              Security Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start space-x-2">
                <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-blue-800 dark:text-blue-200">
                  Regularly review your active sessions and revoke any you don't recognize
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-blue-800 dark:text-blue-200">Always sign out from public or shared computers</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-blue-800 dark:text-blue-200">
                  Enable two-factor authentication for enhanced security
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-blue-800 dark:text-blue-200">Use strong, unique passwords for your account</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
