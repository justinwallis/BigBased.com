import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MessageSquare, Users, Shield, BarChart3, Settings, Flag, AlertTriangle } from "lucide-react"
import { getCommunityCategories, getTrendingTopics, getRecentTopics } from "@/app/actions/community-actions"

export default async function CommunityAdminPage() {
  const categories = await getCommunityCategories()
  const trendingTopics = await getTrendingTopics()
  const recentTopics = await getRecentTopics()

  const stats = {
    totalCategories: categories.length,
    totalTopics: trendingTopics.length + recentTopics.length, // Simplified for demo
    activeUsers: 156, // This would come from analytics
    pendingModeration: 3, // This would come from moderation queue
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin" className="text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Community Management</h1>
          <p className="text-muted-foreground">Moderate forums and manage community engagement</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground">Forum categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Topics</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTopics}</div>
            <p className="text-xs text-muted-foreground">Discussion topics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingModeration}</div>
            <p className="text-xs text-muted-foreground">Needs moderation</p>
          </CardContent>
        </Card>
      </div>

      {/* Management Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Moderation Tools
            </CardTitle>
            <CardDescription>Review flagged content and manage community standards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/admin/community/moderation">
                <Flag className="h-4 w-4 mr-2" />
                Moderation Queue
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/community/reports">
                <AlertTriangle className="h-4 w-4 mr-2" />
                User Reports
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Forum Management
            </CardTitle>
            <CardDescription>Configure categories, permissions, and forum settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/community/categories">
                <Settings className="h-4 w-4 mr-2" />
                Manage Categories
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/community/permissions">
                <Shield className="h-4 w-4 mr-2" />
                User Permissions
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Community Analytics
            </CardTitle>
            <CardDescription>Track engagement, growth, and community health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/community/analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/community">
                <MessageSquare className="h-4 w-4 mr-2" />
                View Live Forum
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Trending Topics</CardTitle>
            <CardDescription>Most active discussions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trendingTopics.slice(0, 5).map((topic) => (
                <div key={topic.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{topic.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {topic.category?.name} • {topic.view_count} views
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/community/${topic.category?.slug}/${topic.slug}`}>View</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/community/topics/${topic.id}/moderate`}>Moderate</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Topics</CardTitle>
            <CardDescription>Latest community discussions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTopics.slice(0, 5).map((topic) => (
                <div key={topic.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{topic.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {topic.category?.name} • {new Date(topic.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/community/${topic.category?.slug}/${topic.slug}`}>View</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/community/topics/${topic.id}/moderate`}>Moderate</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common community management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <Button asChild>
              <Link href="/admin/community/moderation">Review Reports</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/community/categories/new">Add Category</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/community/announcements">Post Announcement</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/community/settings">Forum Settings</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
