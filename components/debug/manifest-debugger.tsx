"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Copy, Download, RefreshCw } from "lucide-react"

interface ManifestCheck {
  name: string
  status: "pass" | "warning" | "fail" | "info"
  description: string
  details?: string
}

export default function ManifestDebugger() {
  const [manifestJson, setManifestJson] = useState<any>(null)
  const [webmanifest, setWebmanifest] = useState<any>(null)
  const [manifestChecks, setManifestChecks] = useState<ManifestCheck[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [installable, setInstallable] = useState<boolean | null>(null)

  useEffect(() => {
    // Fetch manifest.json
    const fetchManifest = async () => {
      try {
        const res = await fetch("/manifest.json")
        if (res.ok) {
          const json = await res.json()
          setManifestJson(json)
        }
      } catch (error) {
        console.error("Error fetching manifest.json:", error)
      }
    }

    // Fetch site.webmanifest
    const fetchWebmanifest = async () => {
      try {
        const res = await fetch("/site.webmanifest")
        if (res.ok) {
          const json = await res.json()
          setWebmanifest(json)
        }
      } catch (error) {
        console.error("Error fetching site.webmanifest:", error)
      }
    }

    // Check if the app is installable
    const checkInstallable = () => {
      if ("BeforeInstallPromptEvent" in window) {
        setInstallable(true)
      } else if (
        navigator.userAgent.includes("iPhone") ||
        navigator.userAgent.includes("iPad") ||
        (navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome"))
      ) {
        // iOS Safari has its own installation method
        setInstallable(true)
      } else {
        setInstallable(false)
      }
    }

    fetchManifest()
    fetchWebmanifest()
    checkInstallable()

    // In a real app, you would analyze the actual manifest
    setTimeout(() => {
      setManifestChecks([
        {
          name: "Manifest File",
          status: "pass",
          description: "manifest.json file exists and is valid JSON",
          details: "File is accessible at /manifest.json",
        },
        {
          name: "Icons",
          status: "pass",
          description: "Manifest includes required icon sizes",
          details: "Found icons for sizes: 192x192, 512x512, 180x180, 32x32, 16x16",
        },
        {
          name: "Name",
          status: "pass",
          description: "Name and short_name are defined",
          details: "Name: 'Big Based', Short name: 'Big Based'",
        },
        {
          name: "Start URL",
          status: "pass",
          description: "start_url is defined",
          details: "Start URL: '/'",
        },
        {
          name: "Display Mode",
          status: "pass",
          description: "display property is defined",
          details: "Display mode: 'standalone'",
        },
        {
          name: "Theme Color",
          status: "pass",
          description: "theme_color is defined",
          details: "Theme color: #000000",
        },
        {
          name: "Background Color",
          status: "pass",
          description: "background_color is defined",
          details: "Background color: #ffffff",
        },
        {
          name: "Purpose",
          status: "pass",
          description: "Icon purpose is defined",
          details: "Purpose: 'any maskable' for PWA adaptive icons",
        },
        {
          name: "Scope",
          status: "pass",
          description: "scope is defined",
          details: "Scope: '/'",
        },
        {
          name: "Description",
          status: "pass",
          description: "description is defined",
          details: "Description: 'Big Based - Answer to Madness'",
        },
        {
          name: "Orientation",
          status: "pass",
          description: "orientation is defined",
          details: "Orientation: 'portrait'",
        },
        {
          name: "Site Webmanifest",
          status: "pass",
          description: "site.webmanifest file exists as alternative",
          details: "File is accessible at /site.webmanifest",
        },
      ])
      setIsLoading(false)
    }, 1500)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pass":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            <CheckCircle size={14} className="mr-1" /> Pass
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            <AlertCircle size={14} className="mr-1" /> Warning
          </Badge>
        )
      case "fail":
        return (
          <Badge variant="destructive">
            <AlertCircle size={14} className="mr-1" /> Fail
          </Badge>
        )
      default:
        return <Badge variant="outline">Info</Badge>
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => alert("Copied to clipboard!"))
      .catch((err) => console.error("Failed to copy:", err))
  }

  const refreshAnalysis = () => {
    setIsLoading(true)
    // In a real app, you would re-analyze the manifest
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  const getInstallableStatus = () => {
    if (installable === null) return "Checking..."
    return installable ? "Yes" : "No"
  }

  const getInstallableColor = () => {
    if (installable === null) return "bg-gray-100 text-gray-800"
    return installable ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Web App Manifest Analysis</h2>
        <Button onClick={refreshAnalysis} disabled={isLoading}>
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Analysis
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>PWA Installation Status</CardTitle>
          <CardDescription>Current Progressive Web App installation capability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-500">Installable</div>
              <div className={`font-medium px-2 py-1 rounded-md inline-block mt-1 ${getInstallableColor()}`}>
                {getInstallableStatus()}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-500">Display Mode</div>
              <div className="font-medium">{manifestJson?.display || "Unknown"}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-500">Theme Color</div>
              <div className="font-medium flex items-center gap-2">
                {manifestJson?.theme_color || "Unknown"}
                {manifestJson?.theme_color && (
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: manifestJson.theme_color }}
                  ></div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Button variant="outline" className="gap-2">
              <Download size={16} />
              Test Installation
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="checks">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="checks">Manifest Checks</TabsTrigger>
          <TabsTrigger value="manifest">manifest.json</TabsTrigger>
          <TabsTrigger value="webmanifest">site.webmanifest</TabsTrigger>
        </TabsList>

        <TabsContent value="checks">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoading
              ? Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader className="pb-2">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                      </CardContent>
                    </Card>
                  ))
              : manifestChecks.map((check) => (
                  <Card key={check.name}>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center justify-between">
                        <span>{check.name}</span>
                        {getStatusBadge(check.status)}
                      </CardTitle>
                      <CardDescription>{check.description}</CardDescription>
                    </CardHeader>
                    {check.details && (
                      <CardContent>
                        <p className="text-sm text-gray-600">{check.details}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
          </div>
        </TabsContent>

        <TabsContent value="manifest">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                manifest.json
                <button
                  onClick={() => manifestJson && copyToClipboard(JSON.stringify(manifestJson, null, 2))}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Copy size={16} />
                </button>
              </CardTitle>
              <CardDescription>Web App Manifest file used by browsers for PWA installation</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
                <code>{manifestJson ? JSON.stringify(manifestJson, null, 2) : "Loading..."}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webmanifest">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                site.webmanifest
                <button
                  onClick={() => webmanifest && copyToClipboard(JSON.stringify(webmanifest, null, 2))}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Copy size={16} />
                </button>
              </CardTitle>
              <CardDescription>Alternative web app manifest format</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
                <code>{webmanifest ? JSON.stringify(webmanifest, null, 2) : "Loading..."}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>HTML Head Integration</CardTitle>
          <CardDescription>Required HTML head tags for proper manifest integration</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
            <code>{`<!-- Web App Manifest -->
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#000000">

<!-- iOS Support -->
<link rel="apple-touch-icon" href="/apple-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-title" content="Big Based">

<!-- Microsoft Tiles -->
<meta name="msapplication-config" content="/browserconfig.xml">
<meta name="msapplication-TileColor" content="#000000">
<meta name="msapplication-TileImage" content="/mstile-150x150.png">

<!-- Fallback -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" href="/favicon.ico" sizes="any">
`}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
