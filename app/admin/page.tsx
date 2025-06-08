import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Globe,
  Users,
  BarChart3,
  Settings,
  FileText,
  ImageIcon,
  Shield,
  Network,
  TrendingUp,
  Scale,
  Workflow,
  Zap,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Force dynamic rendering
export const dynamic = "force-dynamic"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your multi-tenant platform and content</p>
      </div>

      {/* ORIGINAL ADMIN CARDS - PRESERVED */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content Management
            </CardTitle>
            <CardDescription>Create, edit, and manage your website content with our powerful CMS</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/cms">Manage Content</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Domain Management
            </CardTitle>
            <CardDescription>Configure domains, branding, and features for your multi-tenant setup</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/domains">Manage Domains</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics
            </CardTitle>
            <CardDescription>View traffic, usage statistics, and performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/analytics">View Analytics</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/users">Manage Users</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Media Library
            </CardTitle>
            <CardDescription>Upload and organize images, documents, and other media files</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/media">Media Library</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Settings
            </CardTitle>
            <CardDescription>Configure system-wide settings and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/settings">System Settings</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documentation Management
            </CardTitle>
            <CardDescription>Manage technical documentation, articles, and knowledge base content</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/documentation">Manage Docs</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Community Management
            </CardTitle>
            <CardDescription>Moderate forums, manage topics, and oversee community engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/community">Manage Community</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Affiliate System
              <Badge className="bg-blue-100 text-blue-800">Enterprise</Badge>
            </CardTitle>
            <CardDescription>
              Complete affiliate management with MLM, tracking, payouts, and fraud detection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/affiliate">Manage Affiliates</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Shop Management
              <Badge className="bg-green-100 text-green-800">E-commerce</Badge>
            </CardTitle>
            <CardDescription>
              Multi-vendor e-commerce platform with advanced inventory and order management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/shops">Manage Shops</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Debug & Monitoring
              <Badge className="bg-red-100 text-red-800">System</Badge>
            </CardTitle>
            <CardDescription>System debugging, Sentry integration, and performance monitoring tools</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/debug">Debug Tools</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monitoring & Analytics
              <Badge className="bg-purple-100 text-purple-800">Control Center</Badge>
            </CardTitle>
            <CardDescription>
              Control Sentry error tracking, analytics bot protection, and performance monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/monitoring">Monitoring Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ORIGINAL QUICK ACTIONS - PRESERVED */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Button asChild>
              <Link href="/admin/cms/content/new">Create Content</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/cms/media/upload">Upload Media</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/analytics">View Reports</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/documentation/articles/new">Create Documentation</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/community/moderate">Moderate Community</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/affiliate/programs/new">Create Affiliate Program</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/shops/new">Create New Shop</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/sentry-debug">Test Sentry Integration</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/monitoring">Configure Monitoring</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* NEW ENTERPRISE FEATURES SECTION */}
      <div className="mt-8 border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Zap className="h-6 w-6 text-blue-500" />
            Enterprise Features
          </h2>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            All 9 Features Active
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button asChild variant="outline" className="h-auto p-4 justify-start">
            <Link href="/admin/domains" className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              <div className="text-left">
                <div className="font-medium">Multi-tenant</div>
                <div className="text-xs text-muted-foreground">Domain Management</div>
              </div>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-4 justify-start">
            <Link href="/admin/cms/tools" className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-500" />
              <div className="text-left">
                <div className="font-medium">Advanced CMS</div>
                <div className="text-xs text-muted-foreground">Nested Documents</div>
              </div>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-4 justify-start">
            <Link href="/admin/cms/digital-assets" className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-500" />
              <div className="text-left">
                <div className="font-medium">Digital Rights</div>
                <div className="text-xs text-muted-foreground">Asset Management</div>
              </div>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-4 justify-start">
            <Link href="/admin/cms/knowledge-graph" className="flex items-center gap-2">
              <Network className="h-5 w-5 text-orange-500" />
              <div className="text-left">
                <div className="font-medium">Knowledge Graph</div>
                <div className="text-xs text-muted-foreground">Content Relationships</div>
              </div>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-4 justify-start">
            <Link href="/admin/cms/predictive-planning" className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-red-500" />
              <div className="text-left">
                <div className="font-medium">Predictive Planning</div>
                <div className="text-xs text-muted-foreground">Content Forecasting</div>
              </div>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-4 justify-start">
            <Link href="/admin/cms/compliance" className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-yellow-600" />
              <div className="text-left">
                <div className="font-medium">Compliance</div>
                <div className="text-xs text-muted-foreground">Regulatory Automation</div>
              </div>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-4 justify-start">
            <Link href="/admin/cms/integrations" className="flex items-center gap-2">
              <Workflow className="h-5 w-5 text-indigo-500" />
              <div className="text-left">
                <div className="font-medium">Integration Hub</div>
                <div className="text-xs text-muted-foreground">Enterprise Connections</div>
              </div>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-4 justify-start">
            <Link href="/admin/cms/personalization" className="flex items-center gap-2">
              <Users className="h-5 w-5 text-cyan-500" />
              <div className="text-left">
                <div className="font-medium">Personalization</div>
                <div className="text-xs text-muted-foreground">User Experience</div>
              </div>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-4 justify-start">
            <Link href="/admin/affiliate" className="flex items-center gap-2">
              <Users className="h-5 w-5 text-pink-500" />
              <div className="text-left">
                <div className="font-medium">Affiliate System</div>
                <div className="text-xs text-muted-foreground">MLM & Tracking</div>
              </div>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-4 justify-start">
            <Link href="/admin/shops" className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-emerald-500" />
              <div className="text-left">
                <div className="font-medium">Shop System</div>
                <div className="text-xs text-muted-foreground">Multi-vendor E-commerce</div>
              </div>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-4 justify-start">
            <Link href="/admin/monitoring" className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <div className="text-left">
                <div className="font-medium">Monitoring Hub</div>
                <div className="text-xs text-muted-foreground">Error Tracking & Analytics</div>
              </div>
            </Link>
          </Button>
        </div>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current health and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Database: Operational</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">API: 120ms response</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">Storage: 67% used</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
