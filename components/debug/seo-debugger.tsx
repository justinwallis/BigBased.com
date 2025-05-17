"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Copy, ExternalLink, RefreshCw } from "lucide-react"

interface SeoCheck {
  name: string
  status: "pass" | "warning" | "fail" | "info"
  description: string
  details?: string
}

export default function SeoDebugger() {
  const [metaTags, setMetaTags] = useState<{ [key: string]: string }>({})
  const [seoChecks, setSeoChecks] = useState<SeoCheck[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would analyze the actual page
    setTimeout(() => {
      setMetaTags({
        title: "Big Based - Answer to Madness",
        description:
          "Big Based isn't just a platform, it's a cultural revolution. At its core lies a living library of truth, faith, and insight, 10,000+ meticulously researched pages designed to educate, inspire, and transform.",
        "og:title": "Big Based - Answer to Madness",
        "og:description":
          "Big Based isn't just a platform, it's a cultural revolution. At its core lies a living library of truth, faith, and insight, 10,000+ meticulously researched pages designed to educate, inspire, and transform.",
        "og:type": "website",
        "og:url": "https://bigbased.com",
        "og:image": "https://bigbased.com/BigBasedPreview.png",
        "og:image:width": "1200",
        "og:image:height": "630",
        "og:site_name": "Big Based",
        "twitter:card": "summary_large_image",
        "twitter:site": "@bigbased",
        "twitter:title": "Big Based - Answer to Madness",
        "twitter:description":
          "Big Based isn't just a platform, it's a cultural revolution. At its core lies a living library of truth, faith, and insight, 10,000+ meticulously researched pages designed to educate, inspire, and transform.",
        "twitter:image": "https://bigbased.com/BigBasedPreview.png",
        canonical: "https://bigbased.com",
        robots: "index, follow",
        viewport: "width=device-width, initial-scale=1",
        "theme-color": "#000000",
      })

      setSeoChecks([
        {
          name: "Title Tag",
          status: "pass",
          description: "Title tag is present and has optimal length (60 characters or less)",
          details: "Current title: 'Big Based - Answer to Madness' (26 characters)",
        },
        {
          name: "Meta Description",
          status: "warning",
          description: "Meta description is present but exceeds recommended length",
          details: "Current description is 215 characters. Recommended: 155 characters or less.",
        },
        {
          name: "Heading Structure",
          status: "pass",
          description: "Page has proper heading structure with H1, H2, etc.",
          details: "Found 1 H1 tag, 6 H2 tags, and 12 H3 tags in proper hierarchy",
        },
        {
          name: "Image Alt Text",
          status: "warning",
          description: "Some images are missing alt text",
          details: "Found 24 images, 18 have alt text, 6 are missing alt text",
        },
        {
          name: "Mobile Friendliness",
          status: "pass",
          description: "Page is mobile-friendly",
          details: "Viewport meta tag is set correctly and layout is responsive",
        },
        {
          name: "HTTPS",
          status: "pass",
          description: "Site is served over HTTPS",
          details: "SSL certificate is valid and properly configured",
        },
        {
          name: "Canonical URL",
          status: "pass",
          description: "Canonical URL is properly set",
          details: "Canonical URL: https://bigbased.com",
        },
        {
          name: "Social Media Tags",
          status: "pass",
          description: "Open Graph and Twitter Card tags are present",
          details: "Found 9 Open Graph tags and 5 Twitter Card tags",
        },
        {
          name: "Structured Data",
          status: "pass",
          description: "Structured data is present and valid",
          details: "Found Organization and WebSite schema types",
        },
        {
          name: "Page Speed",
          status: "warning",
          description: "Page speed could be improved",
          details: "Mobile speed score: 75/100, Desktop speed score: 88/100",
        },
        {
          name: "Internal Links",
          status: "pass",
          description: "Internal linking structure is good",
          details: "Found 32 internal links with descriptive anchor text",
        },
        {
          name: "External Links",
          status: "info",
          description: "External links are properly configured",
          details: "Found 8 external links, all using rel='noopener' for security",
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
        return (
          <Badge variant="outline">
            <ExternalLink size={14} className="mr-1" /> Info
          </Badge>
        )
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
    // In a real app, you would re-analyze the page
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">SEO Analysis</h2>
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

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="meta-tags">Meta Tags</TabsTrigger>
          <TabsTrigger value="structured-data">Structured Data</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
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
              : seoChecks.map((check) => (
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

        <TabsContent value="meta-tags">
          <Card>
            <CardHeader>
              <CardTitle>Meta Tags</CardTitle>
              <CardDescription>All meta tags found on the page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name/Property
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Content
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(metaTags).map(([name, content]) => (
                      <tr key={name}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">{content}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => copyToClipboard(content)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Copy size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structured-data">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Structured Data
                <button
                  onClick={() =>
                    copyToClipboard(
                      JSON.stringify(
                        {
                          "@context": "https://schema.org",
                          "@graph": [
                            {
                              "@type": "Organization",
                              name: "Big Based",
                              url: "https://bigbased.com",
                              logo: "https://bigbased.com/bb-logo.png",
                              sameAs: ["https://twitter.com/bigbased", "https://facebook.com/bigbased"],
                            },
                            {
                              "@type": "WebSite",
                              name: "Big Based",
                              url: "https://bigbased.com",
                              potentialAction: {
                                "@type": "SearchAction",
                                target: "https://bigbased.com/search?q={search_term_string}",
                                "query-input": "required name=search_term_string",
                              },
                            },
                          ],
                        },
                        null,
                        2,
                      ),
                    )
                  }
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Copy size={16} />
                </button>
              </CardTitle>
              <CardDescription>Structured data found on the page</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
                <code>
                  {JSON.stringify(
                    {
                      "@context": "https://schema.org",
                      "@graph": [
                        {
                          "@type": "Organization",
                          name: "Big Based",
                          url: "https://bigbased.com",
                          logo: "https://bigbased.com/bb-logo.png",
                          sameAs: ["https://twitter.com/bigbased", "https://facebook.com/bigbased"],
                        },
                        {
                          "@type": "WebSite",
                          name: "Big Based",
                          url: "https://bigbased.com",
                          potentialAction: {
                            "@type": "SearchAction",
                            target: "https://bigbased.com/search?q={search_term_string}",
                            "query-input": "required name=search_term_string",
                          },
                        },
                      ],
                    },
                    null,
                    2,
                  )}
                </code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>SEO Recommendations</CardTitle>
              <CardDescription>Suggestions to improve search engine optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <h3 className="font-medium text-yellow-800">Shorten Meta Description</h3>
                  <p className="text-yellow-700 mt-1">
                    Current meta description is 215 characters. Consider shortening it to 155 characters or less for
                    optimal display in search results.
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <h3 className="font-medium text-yellow-800">Add Alt Text to All Images</h3>
                  <p className="text-yellow-700 mt-1">
                    6 images are missing alt text. Add descriptive alt text to all images for better accessibility and
                    SEO.
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <h3 className="font-medium text-yellow-800">Improve Page Speed</h3>
                  <p className="text-yellow-700 mt-1">
                    Mobile speed score is 75/100. Optimize images and reduce JavaScript bundle size to improve page
                    loading speed.
                  </p>
                </div>

                <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
                  <h3 className="font-medium text-green-800">Good: Structured Data Implementation</h3>
                  <p className="text-green-700 mt-1">
                    Structured data is properly implemented with Organization and WebSite schema types.
                  </p>
                </div>

                <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
                  <h3 className="font-medium text-green-800">Good: Social Media Integration</h3>
                  <p className="text-green-700 mt-1">
                    Open Graph and Twitter Card tags are properly implemented for social media sharing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
