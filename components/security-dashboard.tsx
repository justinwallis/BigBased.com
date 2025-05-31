"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Shield, AlertTriangle, CheckCircle, Smartphone, Key, MapPin, Zap, Brain } from "lucide-react"

interface SecurityDashboardProps {
  user: any
  sessions: any[]
  mfaEnabled: boolean
}

export function SecurityDashboard({ user, sessions, mfaEnabled }: SecurityDashboardProps) {
  const [securityScore, setSecurityScore] = useState(0)
  const [threats, setThreats] = useState([])
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    calculateSecurityScore()
    detectThreats()
    generateRecommendations()
  }, [sessions, mfaEnabled])

  const calculateSecurityScore = () => {
    let score = 0

    // Base score
    score += 20

    // MFA enabled
    if (mfaEnabled) score += 30

    // Recent password change (mock)
    score += 15

    // Number of active sessions (fewer is better)
    if (sessions.length <= 2) score += 20
    else if (sessions.length <= 4) score += 10

    // No suspicious locations
    const locations = [...new Set(sessions.map((s) => s.location))]
    if (locations.length <= 2) score += 15

    setSecurityScore(Math.min(score, 100))
  }

  const detectThreats = () => {
    const detectedThreats = []

    // Check for multiple locations
    const locations = [...new Set(sessions.map((s) => s.location))]
    if (locations.length > 3) {
      detectedThreats.push({
        type: "multiple_locations",
        severity: "medium",
        message: "Login attempts from multiple geographic locations",
        count: locations.length,
      })
    }

    // Check for old sessions
    const oldSessions = sessions.filter((s) => {
      const lastActive = new Date(s.last_activity)
      const daysSince = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
      return daysSince > 30
    })

    if (oldSessions.length > 0) {
      detectedThreats.push({
        type: "stale_sessions",
        severity: "low",
        message: "Old inactive sessions detected",
        count: oldSessions.length,
      })
    }

    setThreats(detectedThreats)
  }

  const generateRecommendations = () => {
    const recs = []

    if (!mfaEnabled) {
      recs.push({
        type: "enable_mfa",
        priority: "high",
        message: "Enable two-factor authentication",
        action: "Setup MFA",
      })
    }

    if (sessions.length > 5) {
      recs.push({
        type: "too_many_sessions",
        priority: "medium",
        message: "You have many active sessions",
        action: "Review Sessions",
      })
    }

    setRecommendations(recs)
  }

  const getScoreColor = () => {
    if (securityScore >= 80) return "text-green-600"
    if (securityScore >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = () => {
    if (securityScore >= 80) return "Excellent"
    if (securityScore >= 60) return "Good"
    return "Needs Improvement"
  }

  return (
    <div className="space-y-6">
      {/* Security Score */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className={`text-3xl font-bold ${getScoreColor()}`}>{securityScore}/100</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{getScoreLabel()}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">Last updated: Just now</div>
            </div>
          </div>
          <Progress value={securityScore} className="h-2" />
        </CardContent>
      </Card>

      {/* Threat Detection */}
      {threats.length > 0 && (
        <Card className="border-orange-200 dark:border-orange-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
              <AlertTriangle className="h-5 w-5" />
              Security Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {threats.map((threat, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <div>
                    <p className="font-medium text-orange-800 dark:text-orange-200">{threat.message}</p>
                    <p className="text-sm text-orange-600 dark:text-orange-300">Count: {threat.count}</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-orange-300 text-orange-700">
                  {threat.severity}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Security Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800 dark:text-blue-200">{rec.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-blue-300 text-blue-700">
                    {rec.priority}
                  </Badge>
                  <Button size="sm" variant="outline">
                    {rec.action}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Security Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Two-Factor Auth</p>
                <p className="text-lg font-bold">{mfaEnabled ? "Enabled" : "Disabled"}</p>
              </div>
              <div
                className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                  mfaEnabled ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
                }`}
              >
                {mfaEnabled ? (
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                ) : (
                  <Key className="h-6 w-6 text-red-600 dark:text-red-400" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Sessions</p>
                <p className="text-lg font-bold">{sessions.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Login Locations</p>
                <p className="text-lg font-bold">{[...new Set(sessions.map((s) => s.location))].length}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
