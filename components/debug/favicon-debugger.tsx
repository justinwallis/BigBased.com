"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, Copy, ExternalLink } from "lucide-react"

interface IconInfo {
  name: string
  path: string
  size: string
  type: string
  purpose?: string
  exists?: boolean
}

export default function FaviconDebugger() {
  const [icons, setIcons] = useState<IconInfo[]>([
    { name: "Favicon", path: "/favicon.ico", size: "16x16/32x32", type: "image/x-icon" },
    { name: "Favicon 16x16", path: "/favicon-16x16.png", size: "16x16", type: "image/png" },
    { name: "Favicon 32x32", path: "/favicon-32x32.png", size: "32x32", type: "image/png" },
    { name: "Apple Touch Icon", path: "/apple-touch-icon.png", size: "180x180", type: "image/png" },
    { name: "Apple Icon", path: "/apple-icon.png", size: "180x180", type: "image/png" },
    { name: "Icon SVG", path: "/icon0.svg", size: "Scalable", type: "image/svg+xml" },
    { name: "Icon PNG", path: "/icon1.png", size: "192x192", type: "image/png" },
    {
      name: "Web App Manifest 192",
      path: "/web-app-manifest-192x192.png",
      size: "192x192",
      type: "image/png",
      purpose: "maskable",
    },
    {
      name: "Web App Manifest 512",
      path: "/web-app-manifest-512x512.png",
      size: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
    { name: "Android Chrome 192", path: "/android-chrome-192x192.png", size: "192x192", type: "image/png" },
    { name: "Android Chrome 512", path: "/android-chrome-512x512.png", size: "512x512", type: "image/png" },
    { name: "Safari Pinned Tab", path: "/safari-pinned-tab.png", size: "16x16", type: "image/png" },
    { name: "MS Tile", path: "/mstile-150x150.png", size: "150x150", type: "image/png" },
  ])

  const [manifestJson, setManifestJson] = useState<string | null>(null)
  const [webmanifest, setWebmanifest] = useState<string | null>(null)
  const [browserconfig, setBrowserconfig] = useState<string | null>(null)

  useEffect(() => {
    // Check if each icon exists
    const checkIcons = async () => {
      const updatedIcons = await Promise.all(
        icons.map(async (icon) => {
          try {
            const res = await fetch(icon.path, { method: "HEAD" })
            return { ...icon, exists: res.ok }
          } catch (error) {
            return { ...icon, exists: false }
          }
        }),
      )
      setIcons(updatedIcons)
    }

    // Fetch manifest.json
    const fetchManifest = async () => {
      try {
        const res = await fetch("/manifest.json")
        if (res.ok) {
          const json = await res.json()
          setManifestJson(JSON.stringify(json, null, 2))
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
          setWebmanifest(JSON.stringify(json, null, 2))
        }
      } catch (error) {
        console.error("Error fetching site.webmanifest:", error)
      }
    }

    // Fetch browserconfig.xml
    const fetchBrowserconfig = async () => {
      try {
        const res = await fetch("/browserconfig.xml")
        if (res.ok) {
          const text = await res.text()
          setBrowserconfig(text)
        }
      } catch (error) {
        console.error("Error fetching browserconfig.xml:", error)
      }
    }

    checkIcons()
    fetchManifest()
    fetchWebmanifest()
    fetchBrowserconfig()
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => alert("Copied to clipboard!"))
      .catch((err) => console.error("Failed to copy:", err))
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Icon Status Overview</CardTitle>
          <CardDescription>Status of all favicon and app icons used by Big Based</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Path</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Preview</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {icons.map((icon) => (
                <TableRow key={icon.path}>
                  <TableCell className="font-medium">{icon.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {icon.path}
                      <a
                        href={icon.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>{icon.size}</TableCell>
                  <TableCell>{icon.type}</TableCell>
                  <TableCell>{icon.purpose || "-"}</TableCell>
                  <TableCell>
                    {icon.exists === undefined ? (
                      <Badge variant="outline">Checking...</Badge>
                    ) : icon.exists ? (
                      <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-200">
                        <CheckCircle size={14} className="mr-1" /> Exists
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <AlertCircle size={14} className="mr-1" /> Missing
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {icon.exists && (
                      <div className="relative h-10 w-10 border border-gray-200 rounded">
                        {icon.type === "image/svg+xml" ? (
                          <object
                            data={icon.path}
                            type="image/svg+xml"
                            className="h-full w-full"
                            aria-label={`Preview of ${icon.name}`}
                          />
                        ) : (
                          <img
                            src={icon.path || "/placeholder.svg"}
                            alt={`Preview of ${icon.name}`}
                            className="h-full w-full object-contain"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).style.display = "none"
                            }}
                          />
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Tabs defaultValue="manifest">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manifest">manifest.json</TabsTrigger>
          <TabsTrigger value="webmanifest">site.webmanifest</TabsTrigger>
          <TabsTrigger value="browserconfig">browserconfig.xml</TabsTrigger>
        </TabsList>

        <TabsContent value="manifest">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                manifest.json
                <button
                  onClick={() => manifestJson && copyToClipboard(manifestJson)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Copy size={16} />
                </button>
              </CardTitle>
              <CardDescription>Used by Progressive Web Apps (PWA) and Chrome</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
                <code>{manifestJson || "Loading..."}</code>
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
                  onClick={() => webmanifest && copyToClipboard(webmanifest)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Copy size={16} />
                </button>
              </CardTitle>
              <CardDescription>Alternative web app manifest format</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
                <code>{webmanifest || "Loading..."}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="browserconfig">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                browserconfig.xml
                <button
                  onClick={() => browserconfig && copyToClipboard(browserconfig)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Copy size={16} />
                </button>
              </CardTitle>
              <CardDescription>Used by Microsoft browsers for tile icons</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
                <code>{browserconfig || "Loading..."}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>HTML Head Tags</CardTitle>
          <CardDescription>Recommended favicon tags for the HTML head section</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
            <code>{`<!-- Basic Favicons -->
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">

<!-- Apple Touch Icons -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="mask-icon" href="/safari-pinned-tab.png" color="#000000">

<!-- Microsoft Tiles -->
<meta name="msapplication-TileColor" content="#000000">
<meta name="msapplication-config" content="/browserconfig.xml">

<!-- Web App Manifest -->
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#000000">

<!-- Vector and Alternative Icons -->
<link rel="icon" type="image/svg+xml" href="/icon0.svg">
`}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
