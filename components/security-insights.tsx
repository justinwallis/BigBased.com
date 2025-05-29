"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Globe,
  Clock,
  TrendingUp,
  MapPin,
  Smartphone,
  Monitor,
  Tablet,
} from "lucide-react"

interface SecurityInsightsProps {
  sessions: any[]
}

export function SecurityInsights({ sessions }: SecurityInsightsProps) {
  // Calculate security metrics
  const totalSessions = sessions.length
  const activeSessions = sessions.filter((s) => {
    const now = new Date()
    const lastActive = new Date(s.last_activity)
    const diffInHours = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60))
    return diffInHours < 24
  }).length

  const uniqueLocations = new Set(sessions.map((s) => s.location).filter(Boolean)).size
  const uniqueDeviceTypes = new Set(sessions.map((s) => s.device_type)).size
  const uniqueIPs = new Set(sessions.map((s) => s.ip_address)).size

  // Security score calculation (0-100)
  let securityScore = 100
  if (totalSessions > 3) securityScore -= 10 // Too many sessions
  if (uniqueIPs > 2) securityScore -= 15 // Multiple IPs
  if (uniqueLocations > 2) securityScore -= 20 // Multiple locations
  if (sessions.some((s) => s.location === "Unknown Location")) securityScore -= 5

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreStatus = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    return "Needs Attention"
  }

  // Device type distribution
  const deviceStats = sessions.reduce(
    (acc, session) => {
      acc[session.device_type] = (acc[session.device_type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "mobile":
        return <Smartphone className="h-4 w-4" />
      case "tablet":
        return <Tablet className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Security Score */}
      <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Score
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-3xl font-bold ${getScoreColor(securityScore)}`}>{securityScore}/100</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{getScoreStatus(securityScore)}</p>
            </div>
            <div className="text-right">
              {securityScore >= 80 ? (
                <CheckCircle className="h-8 w-8 text-green-500" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              )}
            </div>
          </div>
          <Progress value={securityScore} className="h-2" />

          <div className="space-y-2 text-sm">
            {totalSessions <= 3 && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-3 w-3" />
                <span>Reasonable number of active sessions</span>
              </div>
            )}
            {uniqueIPs <= 2 && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-3 w-3" />
                <span>Limited IP addresses</span>
              </div>
            )}
            {uniqueLocations <= 2 && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-3 w-3" />
                <span>Consistent geographic locations</span>
              </div>
            )}

            {totalSessions > 3 && (
              <div className="flex items-center gap-2 text-yellow-600">
                <AlertTriangle className="h-3 w-3" />
                <span>Many active sessions ({totalSessions})</span>
              </div>
            )}
            {uniqueIPs > 2 && (
              <div className="flex items-center gap-2 text-yellow-600">
                <AlertTriangle className="h-3 w-3" />
                <span>Multiple IP addresses ({uniqueIPs})</span>
              </div>
            )}
            {uniqueLocations > 2 && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-3 w-3" />
                <span>Multiple locations ({uniqueLocations})</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Session Analytics */}
      <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Session Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalSessions}</div>
              <div className="text-xs text-blue-600">Total Sessions</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{activeSessions}</div>
              <div className="text-xs text-green-600">Active (24h)</div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{uniqueLocations}</div>
              <div className="text-xs text-purple-600">Locations</div>
            </div>
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{uniqueDeviceTypes}</div>
              <div className="text-xs text-orange-600">Device Types</div>
            </div>
          </div>

          {/* Device Distribution */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Device Distribution</h4>
            {Object.entries(deviceStats).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getDeviceIcon(type)}
                  <span className="text-sm capitalize">{type}</span>
                </div>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sessions
              .sort((a, b) => new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime())
              .slice(0, 5)
              .map((session, index) => {
                const timeDiff = Math.floor(
                  (new Date().getTime() - new Date(session.last_activity).getTime()) / (1000 * 60),
                )
                const timeText =
                  timeDiff < 1 ? "Just now" : timeDiff < 60 ? `${timeDiff}m ago` : `${Math.floor(timeDiff / 60)}h ago`

                return (
                  <div
                    key={session.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(session.device_type)}
                      <div
                        className={`h-2 w-2 rounded-full ${session.is_current ? "bg-green-500" : "bg-gray-400"}`}
                      ></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {session.browser} on {session.os}
                        </span>
                        {session.is_current && (
                          <Badge variant="secondary" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {session.ip_address}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {session.location || "Unknown"}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">{timeText}</div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
