"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react"

interface PerformanceMetric {
  name: string
  value: number
  unit: string
  threshold: {
    good: number
    needsImprovement: number
  }
  description: string
}

export default function PerformanceDebugger() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would measure these metrics
    // This is just sample data
    setTimeout(() => {
      setMetrics([
        {
          name: "First Contentful Paint",
          value: 1.2,
          unit: "s",
          threshold: {
            good: 1.8,
            needsImprovement: 3.0,
          },
          description: "Time until the first text or image is painted",
        },
        {
          name: "Largest Contentful Paint",
          value: 2.5,
          unit: "s",
          threshold: {
            good: 2.5,
            needsImprovement: 4.0,
          },
          description: "Time until largest content element is visible",
        },
        {
          name: "Cumulative Layout Shift",
          value: 0.05,
          unit: "",
          threshold: {
            good: 0.1,
            needsImprovement: 0.25,
          },
          description: "Measures visual stability",
        },
        {
          name: "First Input Delay",
          value: 75,
          unit: "ms",
          threshold: {
            good: 100,
            needsImprovement: 300,
          },
          description: "Time from user interaction to browser response",
        },
        {
          name: "Time to Interactive",
          value: 3.8,
          unit: "s",
          threshold: {
            good: 3.8,
            needsImprovement: 7.3,
          },
          description: "Time until page is fully interactive",
        },
        {
          name: "Total Blocking Time",
          value: 150,
          unit: "ms",
          threshold: {
            good: 200,
            needsImprovement: 600,
          },
          description: "Sum of time where main thread was blocked",
        },
        {
          name: "Speed Index",
          value: 3.2,
          unit: "s",
          threshold: {
            good: 3.4,
            needsImprovement: 5.8,
          },
          description: "How quickly content is visually displayed",
        },
        {
          name: "Server Response Time",
          value: 180,
          unit: "ms",
          threshold: {
            good: 200,
            needsImprovement: 500,
          },
          description: "Time taken for server to respond with main document",
        },
      ])
      setIsLoading(false)
    }, 1500)
  }, [])

  const getMetricStatus = (metric: PerformanceMetric) => {
    const { value, threshold, unit } = metric

    // For metrics where lower is better (most cases)
    if (unit === "ms" || unit === "s" || unit === "") {
      if (value <= threshold.good) return "good"
      if (value <= threshold.needsImprovement) return "needs-improvement"
      return "poor"
    }

    // For metrics where higher is better
    if (value >= threshold.good) return "good"
    if (value >= threshold.needsImprovement) return "needs-improvement"
    return "poor"
  }

  const getMetricColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-500"
      case "needs-improvement":
        return "bg-yellow-500"
      case "poor":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getMetricIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle className="text-green-500" size={20} />
      case "needs-improvement":
        return <AlertCircle className="text-yellow-500" size={20} />
      case "poor":
        return <AlertCircle className="text-red-500" size={20} />
      default:
        return null
    }
  }

  const getMetricProgressValue = (metric: PerformanceMetric) => {
    const { value, threshold, unit } = metric

    // For metrics where lower is better (most cases)
    if (unit === "ms" || unit === "s" || unit === "") {
      if (value <= threshold.good) return 100
      if (value <= threshold.needsImprovement) {
        const range = threshold.needsImprovement - threshold.good
        const position = threshold.needsImprovement - value
        return Math.round((position / range) * 50) + 50
      }
      return Math.min(Math.round((threshold.needsImprovement / value) * 50), 49)
    }

    // For metrics where higher is better
    if (value >= threshold.good) return 100
    if (value >= threshold.needsImprovement) {
      const range = threshold.good - threshold.needsImprovement
      const position = value - threshold.needsImprovement
      return Math.round((position / range) * 50) + 50
    }
    return Math.min(Math.round((value / threshold.needsImprovement) * 50), 49)
  }

  const refreshMetrics = () => {
    setIsLoading(true)
    // In a real app, you would re-measure the metrics
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Core Web Vitals</h2>
        <Button onClick={refreshMetrics} disabled={isLoading}>
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Metrics
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="metrics">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
          <TabsTrigger value="resources">Resource Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics">
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
                        <div className="h-2 bg-gray-200 rounded w-full"></div>
                      </CardContent>
                    </Card>
                  ))
              : metrics.map((metric) => {
                  const status = getMetricStatus(metric)
                  const progressValue = getMetricProgressValue(metric)
                  const progressColor = getMetricColor(status)

                  return (
                    <Card key={metric.name}>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center justify-between">
                          <span>{metric.name}</span>
                          <div className="flex items-center">
                            <span className="font-mono mr-2">
                              {metric.value}
                              {metric.unit}
                            </span>
                            {getMetricIcon(status)}
                          </div>
                        </CardTitle>
                        <CardDescription>{metric.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Progress value={progressValue} className="h-2" indicatorClassName={progressColor} />
                        <div className="flex justify-between text-xs mt-1">
                          <span className="text-green-600">
                            Good: {metric.threshold.good}
                            {metric.unit}
                          </span>
                          <span className="text-yellow-600">
                            Needs Improvement: {metric.threshold.needsImprovement}
                            {metric.unit}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
          </div>
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Resource Breakdown</CardTitle>
              <CardDescription>Analysis of resources loaded by the page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Resource Count by Type</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-gray-50 rounded-md">
                      <div className="text-sm text-gray-500">JavaScript</div>
                      <div className="font-medium">12 files (856 KB)</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-md">
                      <div className="text-sm text-gray-500">CSS</div>
                      <div className="font-medium">3 files (124 KB)</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-md">
                      <div className="text-sm text-gray-500">Images</div>
                      <div className="font-medium">24 files (1.2 MB)</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-md">
                      <div className="text-sm text-gray-500">Fonts</div>
                      <div className="font-medium">4 files (256 KB)</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Largest Resources</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            File
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Size
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Load Time
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">/BgroundTech.png</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">420 KB</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Image</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">320 ms</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">/_next/static/chunks/main.js</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">356 KB</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">JavaScript</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">180 ms</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">/revolution-background.png</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">280 KB</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Image</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">240 ms</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">/fonts/inter-var.woff2</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">120 KB</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Font</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">90 ms</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>Performance Recommendations</CardTitle>
              <CardDescription>Suggestions to improve site performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <h3 className="font-medium text-yellow-800">Optimize Images</h3>
                  <p className="text-yellow-700 mt-1">
                    Several images could be further compressed or served in next-gen formats like WebP or AVIF. This
                    could save approximately 400KB of data transfer.
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <h3 className="font-medium text-yellow-800">Reduce JavaScript Bundle Size</h3>
                  <p className="text-yellow-700 mt-1">
                    Consider code splitting and lazy loading non-critical JavaScript. This could improve Time to
                    Interactive by up to 1.2 seconds.
                  </p>
                </div>

                <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
                  <h3 className="font-medium text-green-800">Good: Efficient Cache Policy</h3>
                  <p className="text-green-700 mt-1">
                    Static assets are served with appropriate cache headers. This helps returning visitors experience
                    faster page loads.
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <h3 className="font-medium text-yellow-800">Preconnect to Required Origins</h3>
                  <p className="text-yellow-700 mt-1">
                    Add preconnect hints for external domains like font providers and analytics. This could save
                    300-500ms on initial connection setup.
                  </p>
                </div>

                <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
                  <h3 className="font-medium text-green-800">Good: Text Compression</h3>
                  <p className="text-green-700 mt-1">
                    Text-based resources are properly compressed with gzip or brotli.
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
