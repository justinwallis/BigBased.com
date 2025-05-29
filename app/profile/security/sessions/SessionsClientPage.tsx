"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
  Clock,
  Shield,
  Trash2,
  RefreshCw,
  Bug,
  Database,
  Settings,
  Zap,
  TestTube,
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

  const loadSessions = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getUserSessions()

      if (result.success && result.data) {
        setSessions(result.data)
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
  }, [])

  const handleRevokeSession = async (sessionId: string) => {
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
    }
  }

  const handleRevokeAllOther = async () => {
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
        return <Smartphone className="h-4 w-4" />
      case "tablet":
        return <Tablet className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (tableExists === false) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Active Sessions</h1>
          <p className="text-muted-foreground">Manage your active sessions across different devices</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Setup Required
            </CardTitle>
            <CardDescription>
              The sessions table needs to be created in your Neon database (not Supabase).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">Database Configuration:</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Your app uses <strong>Neon</strong> for the main database and <strong>Supabase</strong> for
                authentication. The sessions table needs to be created in Neon, not Supabase.
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button onClick={handleCreateNeonTable} disabled={loading}>
                <Zap className="h-4 w-4 mr-2" />
                Create Table in Neon
              </Button>
              <Button variant="outline" onClick={handleNeonDebug}>
                <Database className="h-4 w-4 mr-2" />
                Debug Neon
              </Button>
              <Button variant="outline" onClick={handleTestNeonOperations}>
                <TestTube className="h-4 w-4 mr-2" />
                Test Neon Operations
              </Button>
              <Button variant="outline" onClick={handleEnvDebug}>
                <Settings className="h-4 w-4 mr-2" />
                Check Environment
              </Button>
            </div>

            {debugInfo && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Debug Information ({debugInfo.type}):</h3>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-96">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            )}

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Manual Setup (Neon SQL Editor):</h3>
              <p className="text-sm text-muted-foreground mb-2">
                If automatic creation fails, run this in your Neon SQL editor:
              </p>
              <pre className="text-xs bg-background p-2 rounded border overflow-auto">
                {`CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_token TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  location TEXT,
  device_type TEXT DEFAULT 'desktop',
  browser TEXT DEFAULT 'unknown',
  os TEXT DEFAULT 'unknown',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_token ON public.user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_activity ON public.user_sessions(last_activity);`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Active Sessions</h1>
          <p className="text-muted-foreground">Manage your active sessions across different devices</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleNeonDebug}>
            <Bug className="h-4 w-4 mr-2" />
            Debug
          </Button>
          <Button variant="outline" onClick={loadSessions} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <Shield className="h-4 w-4" />
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {debugInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Debug Information ({debugInfo.type})</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-96">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Loading sessions...</span>
            </div>
          </CardContent>
        </Card>
      ) : sessions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Monitor className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Active Sessions</h3>
              <p className="text-muted-foreground">
                You don't have any tracked sessions yet. Sessions will appear here when you sign in.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {sessions.length} active session{sessions.length !== 1 ? "s" : ""}
            </p>
            {sessions.length > 1 && (
              <Button variant="outline" size="sm" onClick={handleRevokeAllOther}>
                <Trash2 className="h-4 w-4 mr-2" />
                Revoke All Other Sessions
              </Button>
            )}
          </div>

          <div className="grid gap-4">
            {sessions.map((session) => (
              <Card key={session.id} className={session.is_current ? "ring-2 ring-primary" : ""}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getDeviceIcon(session.device_type)}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {session.browser} on {session.os}
                          </span>
                          {session.is_current && <Badge variant="secondary">Current Session</Badge>}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {session.ip_address && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{session.ip_address}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Last active: {formatDate(session.last_activity)}</span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">Created: {formatDate(session.created_at)}</div>
                      </div>
                    </div>
                    {!session.is_current && (
                      <Button variant="outline" size="sm" onClick={() => handleRevokeSession(session.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Revoke
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
