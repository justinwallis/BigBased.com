import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Globe,
  FileText,
  Shield,
  Network,
  TrendingUp,
  Scale,
  Zap,
  Users,
  BarChart3,
  Settings,
  Database,
  Lock,
  Workflow,
} from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b pb-6">
        <h1 className="text-4xl font-bold text-foreground">Enterprise Admin Dashboard</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Manage your enterprise-grade content management and business operations
        </p>
        <div className="flex gap-2 mt-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            All 7 Enterprise Features Active
          </Badge>
          <Badge variant="outline">Multi-Tenant Ready</Badge>
          <Badge variant="outline">AI-Powered</Badge>
        </div>
      </div>

      {/* Core Enterprise Features */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-6 w-6 text-blue-500" />
          Core Enterprise Features
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1: Multi-tenant Domain Management */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                Domain Management
                <Badge className="bg-blue-100 text-blue-800 text-xs">Feature 1</Badge>
              </CardTitle>
              <CardDescription>Multi-tenant domain configuration and analytics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Active Domains</p>
                  <p className="font-semibold">247</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Visits</p>
                  <p className="font-semibold">1.2M</p>
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href="/admin/domains">
                  <Globe className="h-4 w-4 mr-2" />
                  Manage Domains
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Feature 2: Advanced CMS */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-500" />
                Advanced CMS
                <Badge className="bg-green-100 text-green-800 text-xs">Feature 2</Badge>
              </CardTitle>
              <CardDescription>Nested documents, workflows, and content management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Content Items</p>
                  <p className="font-semibold">1,847</p>
                </div>
                <div>
                  <p className="text-muted-foreground">In Review</p>
                  <p className="font-semibold">23</p>
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href="/admin/cms">
                  <FileText className="h-4 w-4 mr-2" />
                  Manage Content
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Feature 3: Digital Asset Rights */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-500" />
                Digital Assets & Rights
                <Badge className="bg-purple-100 text-purple-800 text-xs">Feature 3</Badge>
              </CardTitle>
              <CardDescription>Asset management, rights tracking, personalization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Digital Assets</p>
                  <p className="font-semibold">5,234</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Rights Tracked</p>
                  <p className="font-semibold">892</p>
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href="/admin/cms/digital-assets">
                  <Shield className="h-4 w-4 mr-2" />
                  Manage Assets
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Feature 4: Knowledge Graph */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-orange-500" />
                Knowledge Graph
                <Badge className="bg-orange-100 text-orange-800 text-xs">Feature 4</Badge>
              </CardTitle>
              <CardDescription>AI-powered content relationships and entity mapping</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Entities</p>
                  <p className="font-semibold">1,247</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Relationships</p>
                  <p className="font-semibold">3,891</p>
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href="/admin/cms/knowledge-graph">
                  <Network className="h-4 w-4 mr-2" />
                  Explore Graph
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Feature 5: Predictive Planning */}
          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-red-500" />
                Predictive Planning
                <Badge className="bg-red-100 text-red-800 text-xs">Feature 5</Badge>
              </CardTitle>
              <CardDescription>AI content forecasting and strategic planning</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Predictions</p>
                  <p className="font-semibold">156</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Accuracy</p>
                  <p className="font-semibold">87.3%</p>
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href="/admin/cms/predictive-planning">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Insights
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Feature 6: Compliance Automation */}
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-yellow-600" />
                Compliance Automation
                <Badge className="bg-yellow-100 text-yellow-800 text-xs">Feature 6</Badge>
              </CardTitle>
              <CardDescription>Automated regulatory compliance and risk management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Compliance Score</p>
                  <p className="font-semibold">94.2%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Open Issues</p>
                  <p className="font-semibold">7</p>
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href="/admin/cms/compliance">
                  <Scale className="h-4 w-4 mr-2" />
                  View Compliance
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Feature 7: Enterprise Integration */}
          <Card className="border-l-4 border-l-indigo-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5 text-indigo-500" />
                Enterprise Integration
                <Badge className="bg-indigo-100 text-indigo-800 text-xs">Feature 7</Badge>
              </CardTitle>
              <CardDescription>API gateway, workflows, and system integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Integrations</p>
                  <p className="font-semibold">12</p>
                </div>
                <div>
                  <p className="text-muted-foreground">API Calls/day</p>
                  <p className="font-semibold">45.2K</p>
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href="/admin/cms/integrations">
                  <Workflow className="h-4 w-4 mr-2" />
                  Manage Integrations
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Settings className="h-6 w-6 text-gray-500" />
          Quick Actions
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button asChild variant="outline" className="h-auto p-4">
            <Link href="/admin/users" className="flex flex-col items-center gap-2">
              <Users className="h-6 w-6" />
              <span>User Management</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto p-4">
            <Link href="/admin/analytics" className="flex flex-col items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              <span>Analytics</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto p-4">
            <Link href="/admin/cms/media" className="flex flex-col items-center gap-2">
              <Database className="h-6 w-6" />
              <span>Media Library</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto p-4">
            <Link href="/profile/security" className="flex flex-col items-center gap-2">
              <Lock className="h-6 w-6" />
              <span>Security</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* System Status */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">System Status</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Database Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">All systems operational</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">API Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Response time: 120ms</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Storage Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">67% of 1TB used</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
