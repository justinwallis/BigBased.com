import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText, Plus, BarChart3, Settings, Eye, Edit, TrendingUp, MessageSquare } from "lucide-react"
import {
  getDocumentationCategories,
  getFeaturedArticles,
  getPopularArticles,
} from "@/app/actions/documentation-actions"

export default async function DocumentationAdminPage() {
  const categories = await getDocumentationCategories()
  const featuredArticles = await getFeaturedArticles()
  const popularArticles = await getPopularArticles()

  const stats = {
    totalCategories: categories.length,
    totalArticles: featuredArticles.length + popularArticles.length, // Simplified for demo
    featuredArticles: featuredArticles.length,
    popularArticles: popularArticles.length,
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
          <h1 className="text-3xl font-bold text-foreground">Documentation Management</h1>
          <p className="text-muted-foreground">Manage technical documentation and knowledge base</p>
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
            <p className="text-xs text-muted-foreground">Documentation categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArticles}</div>
            <p className="text-xs text-muted-foreground">Published articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.featuredArticles}</div>
            <p className="text-xs text-muted-foreground">Featured content</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Popular</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.popularArticles}</div>
            <p className="text-xs text-muted-foreground">High-traffic articles</p>
          </CardContent>
        </Card>
      </div>

      {/* Management Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create Content
            </CardTitle>
            <CardDescription>Add new documentation articles and organize content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/admin/documentation/articles/new">
                <Plus className="h-4 w-4 mr-2" />
                New Article
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/documentation/categories">
                <Settings className="h-4 w-4 mr-2" />
                Manage Categories
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content Management
            </CardTitle>
            <CardDescription>Edit existing articles and manage content lifecycle</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/documentation/articles">
                <Edit className="h-4 w-4 mr-2" />
                Edit Articles
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/docs">
                <Eye className="h-4 w-4 mr-2" />
                View Live Docs
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics & Insights
            </CardTitle>
            <CardDescription>Track documentation usage and user engagement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/documentation/analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/documentation/feedback">
                <MessageSquare className="h-4 w-4 mr-2" />
                User Feedback
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Featured Articles</CardTitle>
            <CardDescription>Currently featured documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {featuredArticles.slice(0, 5).map((article) => (
                <div key={article.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{article.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {article.category?.name} • {article.view_count} views
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/docs/${article.category?.slug}/${article.slug}`}>View</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/documentation/articles/${article.id}/edit`}>Edit</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Articles</CardTitle>
            <CardDescription>Most viewed documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {popularArticles.slice(0, 5).map((article) => (
                <div key={article.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{article.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {article.category?.name} • {article.view_count} views
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/docs/${article.category?.slug}/${article.slug}`}>View</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/documentation/articles/${article.id}/edit`}>Edit</Link>
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
          <CardDescription>Common documentation management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <Button asChild>
              <Link href="/admin/documentation/articles/new">Create Article</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/documentation/categories/new">Add Category</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/documentation/import">Import Content</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/documentation/export">Export Docs</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
