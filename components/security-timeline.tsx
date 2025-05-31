"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Shield, AlertTriangle, Globe, Smartphone, Key, LogIn, LogOut, Settings } from "lucide-react"

interface SecurityEvent {
  id: string
  type: string
  timestamp: string
  description: string
  location?: string
  device?: string
  severity: "low" | "medium" | "high"
  status: "success" | "warning" | "error"
}

export function SecurityTimeline() {
  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    // Mock security events - in real app, fetch from API
    const mockEvents: SecurityEvent[] = [
      {
        id: "1",
        type: "login",
        timestamp: new Date().toISOString(),
        description: "Successful login",
        location: "New York, NY",
        device: "Chrome on Windows",
        severity: "low",
        status: "success",
      },
      {
        id: "2",
        type: "mfa_setup",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        description: "Two-factor authentication enabled",
        severity: "low",
        status: "success",
      },
      {
        id: "3",
        type: "failed_login",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        description: "Failed login attempt",
        location: "Unknown Location",
        device: "Unknown Device",
        severity: "medium",
        status: "warning",
      },
      {
        id: "4",
        type: "password_change",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        description: "Password changed successfully",
        severity: "low",
        status: "success",
      },
      {
        id: "5",
        type: "suspicious_login",
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        description: "Login from new location",
        location: "London, UK",
        device: "Safari on iPhone",
        severity: "high",
        status: "warning",
      },
    ]

    setEvents(mockEvents)
  }, [])

  const getEventIcon = (type: string) => {
    switch (type) {
      case "login":
        return <LogIn className="h-4 w-4" />
      case "logout":
        return <LogOut className="h-4 w-4" />
      case "mfa_setup":
        return <Key className="h-4 w-4" />
      case "password_change":
        return <Settings className="h-4 w-4" />
      case "failed_login":
        return <AlertTriangle className="h-4 w-4" />
      case "suspicious_login":
        return <Globe className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const getEventColor = (status: string, severity: string) => {
    if (status === "error" || severity === "high") return "text-red-600 bg-red-100 dark:bg-red-900/20"
    if (status === "warning" || severity === "medium") return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
    return "text-green-600 bg-green-100 dark:bg-green-900/20"
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const filteredEvents = filter === "all" ? events : events.filter((event) => event.severity === filter)

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Security Timeline
            </CardTitle>
            <CardDescription>Recent security events and activities</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All
            </Button>
            <Button variant={filter === "high" ? "default" : "outline"} size="sm" onClick={() => setFilter("high")}>
              High
            </Button>
            <Button variant={filter === "medium" ? "default" : "outline"} size="sm" onClick={() => setFilter("medium")}>
              Medium
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredEvents.map((event, index) => (
            <div key={event.id} className="flex items-start gap-4">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div className={`p-2 rounded-full ${getEventColor(event.status, event.severity)}`}>
                  {getEventIcon(event.type)}
                </div>
                {index < filteredEvents.length - 1 && <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mt-2" />}
              </div>

              {/* Event details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{event.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`${getEventColor(event.status, event.severity)} border-current`}
                    >
                      {event.severity}
                    </Badge>
                    <span className="text-sm text-gray-500">{formatTimestamp(event.timestamp)}</span>
                  </div>
                </div>

                {(event.location || event.device) && (
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {event.location}
                      </div>
                    )}
                    {event.device && (
                      <div className="flex items-center gap-1">
                        <Smartphone className="h-3 w-3" />
                        {event.device}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
