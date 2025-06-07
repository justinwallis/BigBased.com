"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

// Mock job data
const mockJobs = [
  {
    id: "1",
    name: "Image Optimization",
    type: "media_processing",
    status: "completed",
    progress: 100,
    created_at: "2024-01-22T10:30:00Z",
    completed_at: "2024-01-22T10:32:15Z",
    duration: "2m 15s",
    details: "Optimized 15 images for web delivery",
  },
  {
    id: "2",
    name: "Content Export",
    type: "data_export",
    status: "running",
    progress: 65,
    created_at: "2024-01-22T11:00:00Z",
    details: "Exporting content to CSV format",
  },
  {
    id: "3",
    name: "SEO Analysis",
    type: "seo_audit",
    status: "pending",
    progress: 0,
    created_at: "2024-01-22T11:15:00Z",
    details: "Analyzing SEO metrics for all published content",
  },
  {
    id: "4",
    name: "Backup Creation",
    type: "backup",
    status: "failed",
    progress: 0,
    created_at: "2024-01-22T09:00:00Z",
    failed_at: "2024-01-22T09:05:30Z",
    error: "Insufficient storage space",
    details: "Creating full database backup",
  },
]

export default function JobsQueueClient() {
  const [jobs] = useState(mockJobs)
  const [activeTab, setActiveTab] = useState("all")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "running":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      running: "secondary",
      pending: "outline",
      failed: "destructive",
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>{status}</Badge>
  }

  const filteredJobs = jobs.filter((job) => {
    if (activeTab === "all") return true
    return job.status === activeTab
  })

  const jobCounts = {
    all: jobs.length,
    running: jobs.filter((j) => j.status === "running").length,
    pending: jobs.filter((j) => j.status === "pending").length,
    completed: jobs.filter((j) => j.status === "completed").length,
    failed: jobs.filter((j) => j.status === "failed").length,
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Running</p>
                <p className="text-2xl font-bold">{jobCounts.running}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <div>
                <p className="text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold">{jobCounts.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold">{jobCounts.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">Failed</p>
                <p className="text-2xl font-bold">{jobCounts.failed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Job Queue</CardTitle>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All ({jobCounts.all})</TabsTrigger>
              <TabsTrigger value="running">Running ({jobCounts.running})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({jobCounts.pending})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({jobCounts.completed})</TabsTrigger>
              <TabsTrigger value="failed">Failed ({jobCounts.failed})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <Card key={job.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(job.status)}
                            <h3 className="font-medium">{job.name}</h3>
                            {getStatusBadge(job.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">{job.details}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Type: {job.type}</span>
                            <span>•</span>
                            <span>Created: {new Date(job.created_at).toLocaleString()}</span>
                            {job.duration && (
                              <>
                                <span>•</span>
                                <span>Duration: {job.duration}</span>
                              </>
                            )}
                          </div>
                          {job.error && <p className="text-sm text-red-600 mt-1">Error: {job.error}</p>}
                        </div>
                        <div className="text-right">
                          {job.status === "running" && (
                            <div className="space-y-1">
                              <div className="text-sm font-medium">{job.progress}%</div>
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 transition-all duration-300"
                                  style={{ width: `${job.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredJobs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">No jobs found for the selected filter.</div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
