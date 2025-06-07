import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Database,
  Download,
  Upload,
  Settings,
  Activity,
  AlertTriangle,
  Zap,
  FileText,
  Globe,
  Users,
} from "lucide-react"

export default function CMSToolsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/cms" className="text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to CMS
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Advanced CMS Tools</h1>
          <p className="text-muted-foreground">System administration and advanced features</p>
        </div>
      </div>

      {/* System Tools */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Migration Tools
            </CardTitle>
            <CardDescription>Import, export, and migrate content between environments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/admin/cms/tools/migration">
                <Database className="h-4 w-4 mr-2" />
                Migration Center
              </Link>
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/cms/tools/export">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/cms/tools/import">
                  <Upload className="h-4 w-4 mr-1" />
                  Import
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Monitoring
            </CardTitle>
            <CardDescription>Monitor system performance and error tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/tools/monitoring">
                <Activity className="h-4 w-4 mr-2" />
                System Monitor
              </Link>
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/cms/tools/errors">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Errors
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/cms/tools/performance">
                  <Zap className="h-4 w-4 mr-1" />
                  Performance
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Cache Management
            </CardTitle>
            <CardDescription>Manage content caching and performance optimization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/tools/cache">
                <Settings className="h-4 w-4 mr-2" />
                Cache Control
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Clear cache, preload content</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content Tree
            </CardTitle>
            <CardDescription>Manage hierarchical content structure and organization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/tools/content-tree">
                <FileText className="h-4 w-4 mr-2" />
                Content Hierarchy
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Nested documents, folders</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              API Management
            </CardTitle>
            <CardDescription>Manage API keys and headless CMS access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/tools/api">
                <Globe className="h-4 w-4 mr-2" />
                API Console
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Keys, rate limits, usage</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Access Control
            </CardTitle>
            <CardDescription>Manage user roles, permissions, and access control</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/tools/access">
                <Users className="h-4 w-4 mr-2" />
                Permissions
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Roles, permissions, audit</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick System Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <Button variant="outline">
              <Database className="h-4 w-4 mr-2" />
              Clear All Cache
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Backup Content
            </Button>
            <Button variant="outline">
              <Activity className="h-4 w-4 mr-2" />
              System Health
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Rebuild Indexes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Status</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Healthy</div>
            <p className="text-xs text-muted-foreground">Cache hit ratio: 94%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Status</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Online</div>
            <p className="text-xs text-muted-foreground">Response time: 45ms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">0.02%</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
