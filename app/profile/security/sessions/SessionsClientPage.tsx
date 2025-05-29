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
  TestTube,
} from "lucide-react"
import { getUserSessions, revokeSession, revokeAllOtherSessions } from "@/app/actions/session-actions"
import { createTableAction } from "@/app/actions/create-table-action"
import { comprehensiveDebugAction, testTableAccess } from "@/app/actions/comprehensive-debug-action"
import { testSessionAccess } from "@/app/actions/simple-session-test"

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

  const handleCreateTable = async () => {
    try {
      setLoading(true)
      const result = await createTableAction()
      if (result.success) {
        setTableExists(true)
        await loadSessions()
      } else {
        setError(result.error || "Failed to create table")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error("Error creating table:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDebug = async () => {
    try {
      const result = await comprehensiveDebugAction()
      setDebugInfo(result)
      console.log("Debug result:", result)
    } catch (err) {
      console.error("Debug error:", err)
    }
  }

  const handleTestAccess = async () => {
    try {
      const result = await testTableAccess()
      setDebugInfo(result)
      console.log("Test access result:", result)
    } catch (err) {
      console.error("Test access error:", err)
    }
  }

  const handleSimpleTest = async () => {
    try {
      const result = await testSessionAccess()
      setDebugInfo(result)
      console.log("Simple test result:", result)

      // If the test was successful, try to reload sessions
      if (result.success) {
        await loadSessions()
      }
    } catch (err) {
      console.error("Simple test error:", err)
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
              Setup Required
            </CardTitle>
            <CardDescription>
              The sessions table needs to be created before you can manage your sessions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button onClick={handleCreateTable} disabled={loading}>
                <Database className="h-4 w-4 mr-2" />
                Create Table Automatically
              </Button>
              <Button variant="outline" onClick={handleDebug}>
                <Bug className="h-4 w-4 mr-2" />
                Full Debug
              </Button>
              <Button variant="outline" onClick={handleTestAccess}>
                <TestTube className="h-4 w-4 mr-2" />
                Test Access
              </Button>
              <Button variant="outline" onClick={handleSimpleTest}>
                <TestTube className="h-4 w-4 mr-2" />
                Simple Test
              </Button>
            </div>

            {debugInfo && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Debug Information:</h3>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-96">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            )}

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Manual Setup (SQL):</h3>
              <p className="text-sm text-muted-foreground mb-2">
                If automatic creation fails, you can run this SQL in your Supabase dashboard:
              </p>
              <pre className="text-xs bg-background p-2 rounded border overflow-auto">
                {`-- Create user_sessions table
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  expires_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own sessions" ON public.user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions" ON public.user_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON public.user_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" ON public.user_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
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
          <Button variant="outline" onClick={handleSimpleTest}>
            <TestTube className="h-4 w-4 mr-2" />
            Test
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
            <CardTitle>Debug Information</CardTitle>
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
