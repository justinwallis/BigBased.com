"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Globe, Clock, X, Shield } from "lucide-react"

interface SessionAlertsProps {
  sessions: any[]
}

export function SessionAlerts({ sessions }: SessionAlertsProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([])

  // Generate security alerts
  const alerts = []

  // Check for suspicious locations
  const locations = sessions.map((s) => s.location).filter(Boolean)
  const uniqueLocations = new Set(locations)
  if (uniqueLocations.size > 2) {
    alerts.push({
      id: "multiple-locations",
      type: "warning",
      title: "Multiple Geographic Locations",
      description: `Sessions detected from ${uniqueLocations.size} different locations`,
      icon: <MapPin className="h-4 w-4" />,
      details: Array.from(uniqueLocations).slice(0, 3).join(", "),
    })
  }

  // Check for multiple IPs
  const ips = new Set(sessions.map((s) => s.ip_address))
  if (ips.size > 2) {
    alerts.push({
      id: "multiple-ips",
      type: "warning",
      title: "Multiple IP Addresses",
      description: `Sessions from ${ips.size} different IP addresses`,
      icon: <Globe className="h-4 w-4" />,
      details: `Consider reviewing if all sessions are yours`,
    })
  }

  // Check for old sessions
  const oldSessions = sessions.filter((s) => {
    const daysSinceActive = Math.floor(
      (new Date().getTime() - new Date(s.last_activity).getTime()) / (1000 * 60 * 60 * 24),
    )
    return daysSinceActive > 7
  })

  if (oldSessions.length > 0) {
    alerts.push({
      id: "old-sessions",
      type: "info",
      title: "Inactive Sessions Found",
      description: `${oldSessions.length} sessions haven't been used in over a week`,
      icon: <Clock className="h-4 w-4" />,
      details: "Consider revoking unused sessions for better security",
    })
  }

  // Check for unknown locations
  const unknownLocationSessions = sessions.filter((s) => s.location === "Unknown Location" || !s.location)
  if (unknownLocationSessions.length > 0) {
    alerts.push({
      id: "unknown-locations",
      type: "info",
      title: "Sessions with Unknown Locations",
      description: `${unknownLocationSessions.length} sessions couldn't determine location`,
      icon: <MapPin className="h-4 w-4" />,
      details: "This may be normal for VPN or proxy connections",
    })
  }

  // Filter out dismissed alerts
  const activeAlerts = alerts.filter((alert) => !dismissedAlerts.includes(alert.id))

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts((prev) => [...prev, alertId])
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "warning":
        return "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20"
      case "error":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
      default:
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
    }
  }

  const getAlertTextColor = (type: string) => {
    switch (type) {
      case "warning":
        return "text-yellow-800 dark:text-yellow-200"
      case "error":
        return "text-red-800 dark:text-red-200"
      default:
        return "text-blue-800 dark:text-blue-200"
    }
  }

  if (activeAlerts.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="font-medium text-green-800 dark:text-green-200">All Clear!</h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                No security concerns detected with your current sessions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {activeAlerts.map((alert) => (
        <Card key={alert.id} className={`border-0 shadow-lg ${getAlertColor(alert.type)}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={getAlertTextColor(alert.type)}>{alert.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-medium ${getAlertTextColor(alert.type)}`}>{alert.title}</h4>
                    <Badge variant={alert.type === "warning" ? "destructive" : "secondary"} className="text-xs">
                      {alert.type}
                    </Badge>
                  </div>
                  <p className={`text-sm ${getAlertTextColor(alert.type)} mb-1`}>{alert.description}</p>
                  <p className={`text-xs ${getAlertTextColor(alert.type)} opacity-80`}>{alert.details}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissAlert(alert.id)}
                className={`${getAlertTextColor(alert.type)} hover:bg-black/5 dark:hover:bg-white/5`}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
