"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Database,
  FileText,
  ImageIcon,
  Info,
  Layout,
  LinkIcon,
  List,
  Server,
  Settings,
  Shield,
  Smartphone,
  Zap,
} from "lucide-react"

interface SystemInfo {
  nextVersion?: string
  nodeVersion?: string
  environment?: string
  buildTime?: string
  deploymentId?: string
}

interface DebugSection {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  path: string
  status?: "ok" | "warning" | "error" | "unknown"
}

export default function MasterDebugger() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({})
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // In a real app, you might fetch this from an API endpoint
    setSystemInfo({
      nextVersion: "14.0.0",
      nodeVersion: process.env.NODE_VERSION || "Unknown",
      environment: process.env.NODE_ENV,
      buildTime: "2023-05-17T12:00:00Z", // This would be set at build time
      deploymentId: "v1.2.3", // This would be set at deployment
    })
  }, [])

  const debugSections: DebugSection[] = [
    {
      id: "favicon",
      title: "Favicon Debugger",
      description: "Check all favicon and app icons",
      icon: <ImageIcon size={24} />,
      path: "/debug/favicon",
      status: "ok",
    },
    {
      id: "performance",
      title: "Performance Monitor",
      description: "Analyze site performance metrics",
      icon: <Activity size={24} />,
      path: "/debug/performance",
      status: "warning",
    },
    {
      id: "seo",
      title: "SEO Analyzer",
      description: "Check SEO optimization status",
      icon: <LinkIcon size={24} />,
      path: "/debug/seo",
      status: "ok",
    },
    {
      id: "accessibility",
      title: "Accessibility Checker",
      description: "Verify site accessibility compliance",
      icon: <Smartphone size={24} />,
      path: "/debug/accessibility",
      status: "unknown",
    },
    {
      id: "api",
      title: "API Tester",
      description: "Test API endpoints and responses",
      icon: <Server size={24} />,
      path: "/debug/api",
      status: "ok",
    },
    {
      id: "database",
      title: "Database Inspector",
      description: "Inspect database connections and queries",
      icon: <Database size={24} />,
      path: "/debug/database",
      status: "ok",
    },
    {
      id: "auth",
      title: "Auth Debugger",
      description: "Debug authentication flows",
      icon: <Shield size={24} />,
      path: "/debug/auth",
      status: "ok",
    },
    {
      id: "logs",
      title: "Log Viewer",
      description: "View application logs",
      icon: <FileText size={24} />,
      path: "/debug/logs",
      status: "ok",
    },
    {
      id: "routes",
      title: "Route Explorer",
      description: "Explore all application routes",
      icon: <Layout size={24} />,
      path: "/debug/routes",
      status: "ok",
    },
    {
      id: "components",
      title: "Component Library",
      description: "View all UI components",
      icon: <List size={24} />,
      path: "/debug/components",
      status: "ok",
    },
    {
      id: "config",
      title: "Configuration Viewer",
      description: "View application configuration",
      icon: <Settings size={24} />,
      path: "/debug/config",
      status: "ok",
    },
    {
      id: "tools",
      title: "Developer Tools",
      description: "Additional developer utilities",
      icon: <Zap size={24} />,
      path: "/debug/tools",
      status: "ok",
    },
  ]

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "ok":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            <CheckCircle size={14} className="mr-1" /> OK
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            <AlertCircle size={14} className="mr-1" /> Warning
          </Badge>
        )
      case "error":
        return (
          <Badge variant="destructive">
            <AlertCircle size={14} className="mr-1" /> Error
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <Info size={14} className="mr-1" /> Unknown
          </Badge>
        )
    }
  }

  const runDiagnostics = () => {
    alert("Running diagnostics... This would trigger a comprehensive site check in a real implementation.")
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Current environment and build information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-500">Next.js Version</div>
              <div className="font-medium">{systemInfo.nextVersion || "Unknown"}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-500">Node Version</div>
              <div className="font-medium">{systemInfo.nodeVersion || "Unknown"}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-500">Environment</div>
              <div className="font-medium">{systemInfo.environment || "Unknown"}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-500">Build Time</div>
              <div className="font-medium">{systemInfo.buildTime || "Unknown"}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-500">Deployment ID</div>
              <div className="font-medium">{systemInfo.deploymentId || "Unknown"}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-500">Rendering</div>
              <div className="font-medium">{isClient ? "Client-side" : "Server-side"}</div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={runDiagnostics}>Run Diagnostics</Button>
        </CardFooter>
      </Card>

      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Tools</TabsTrigger>
          <TabsTrigger value="frontend">Frontend</TabsTrigger>
          <TabsTrigger value="backend">Backend</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {debugSections.map((section) => (
              <Link href={section.path} key={section.id}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-gray-100 rounded-md">{section.icon}</div>
                        <span>{section.title}</span>
                      </div>
                      {getStatusBadge(section.status)}
                    </CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="frontend">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {debugSections
              .filter((s) => ["favicon", "performance", "seo", "accessibility", "components"].includes(s.id))
              .map((section) => (
                <Link href={section.path} key={section.id}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-gray-100 rounded-md">{section.icon}</div>
                          <span>{section.title}</span>
                        </div>
                        {getStatusBadge(section.status)}
                      </CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="backend">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {debugSections
              .filter((s) => ["api", "database", "auth", "logs"].includes(s.id))
              .map((section) => (
                <Link href={section.path} key={section.id}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-gray-100 rounded-md">{section.icon}</div>
                          <span>{section.title}</span>
                        </div>
                        {getStatusBadge(section.status)}
                      </CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="system">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {debugSections
              .filter((s) => ["routes", "config", "tools"].includes(s.id))
              .map((section) => (
                <Link href={section.path} key={section.id}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-gray-100 rounded-md">{section.icon}</div>
                          <span>{section.title}</span>
                        </div>
                        {getStatusBadge(section.status)}
                      </CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common debugging actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Clear Cache
            </Button>
            <Button variant="outline" size="sm">
              Reset Local Storage
            </Button>
            <Button variant="outline" size="sm">
              Test API Connection
            </Button>
            <Button variant="outline" size="sm">
              Check Auth Status
            </Button>
            <Button variant="outline" size="sm">
              Verify Assets
            </Button>
            <Button variant="outline" size="sm">
              Test PWA Install
            </Button>
            <Button variant="outline" size="sm">
              Check SEO
            </Button>
            <Button variant="outline" size="sm">
              Validate HTML
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
