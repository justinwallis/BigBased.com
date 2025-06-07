import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  FileText,
  ImageIcon,
  Settings,
  BarChart3,
  Plus,
  Folder,
  ShapesIcon as Form,
  ArrowRight,
  Users,
  Globe,
} from "lucide-react"
import { getContentTypes, getContentItems } from "@/app/actions/cms-actions"

export default async function CMSPage() {
  const contentTypesResult = await getContentTypes()
  const contentItemsResult = await getContentItems()

  const contentTypes = contentTypesResult.success ? contentTypesResult.data : []
  const contentItems = contentItemsResult.success ? contentItemsResult.data : []

  const stats = {
    totalTypes: contentTypes.length,
    totalItems: contentItems.length,
    publishedItems: contentItems.filter((item) => item.status === "published").length,
    draftItems: contentItems.filter((item) => item.status === "draft").length,
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
          <h1 className="text-3xl font-bold text-foreground">Content Management System</h1>
          <p className="text-muted-foreground">Manage your content, media, and forms</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Types</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTypes}</div>
            <p className="text-xs text-muted-foreground">Configured types</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">All content items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publishedItems}</div>
            <p className="text-xs text-muted-foreground">Live content</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draftItems}</div>
            <p className="text-xs text-muted-foreground">Work in progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Main CMS Sections */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content Management
            </CardTitle>
            <CardDescription>Create and manage your content items with full versioning support</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/admin/cms/content">
                <Plus className="h-4 w-4 mr-2" />
                Manage Content
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>
                {stats.totalItems} items • {stats.publishedItems} published
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Content Types
            </CardTitle>
            <CardDescription>Define and configure your content structure and fields</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/content-types">
                <Settings className="h-4 w-4 mr-2" />
                Manage Types
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>{stats.totalTypes} types configured</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Media Library
            </CardTitle>
            <CardDescription>Upload and organize your images, documents, and other files</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/media">
                <Folder className="h-4 w-4 mr-2" />
                Media Library
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Organized file management</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Form className="h-5 w-5" />
              Form Builder
            </CardTitle>
            <CardDescription>Create custom forms with drag-and-drop interface</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/forms">
                <Form className="h-4 w-4 mr-2" />
                Build Forms
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Visual form designer</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Redirects
            </CardTitle>
            <CardDescription>Manage URL redirects and track their performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/redirects">
                <ArrowRight className="h-4 w-4 mr-2" />
                Manage Redirects
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>URL redirect management</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              SEO Management
            </CardTitle>
            <CardDescription>Optimize your content for search engines and social media</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/seo">
                <BarChart3 className="h-4 w-4 mr-2" />
                SEO Settings
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Global SEO configuration</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Workflows
            </CardTitle>
            <CardDescription>Content approval workflows and collaboration tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/workflows">
                <Users className="h-4 w-4 mr-2" />
                Manage Workflows
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Content approval system</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Localization
            </CardTitle>
            <CardDescription>Multi-language content management and translation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/localization">
                <Globe className="h-4 w-4 mr-2" />
                Manage Languages
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Multi-language support</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Advanced Tools
            </CardTitle>
            <CardDescription>Jobs queue, query presets, hooks, and system monitoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/tools">
                <Settings className="h-4 w-4 mr-2" />
                System Tools
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Advanced CMS features</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Button asChild>
              <Link href="/admin/cms/content/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Content
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/cms/media/upload">
                <ImageIcon className="h-4 w-4 mr-2" />
                Upload Media
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/cms/content-types/new">
                <Settings className="h-4 w-4 mr-2" />
                New Content Type
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {contentItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Content</CardTitle>
            <CardDescription>Latest content updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contentItems.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.content_types?.name} • {item.status} • {new Date(item.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/cms/content/${item.id}`}>Edit</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
