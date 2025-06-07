import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Workflow, Zap, Database, Globe, BarChart3, Plus } from "lucide-react"

export default function EnterpriseIntegrationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/cms" className="text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to CMS
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Enterprise Integration Hub</h1>
          <p className="text-muted-foreground">Connect and automate workflows across your enterprise systems</p>
        </div>
        <Button asChild>
          <Link href="/admin/cms/integrations/new">
            <Plus className="h-4 w-4 mr-2" />
            New Integration
          </Link>
        </Button>
      </div>

      {/* Integration Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Workflow className="h-5 w-5 text-blue-500" />
              Active Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">12</div>
            <p className="text-sm text-muted-foreground">Connected systems</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-500" />
              API Calls Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">45.2K</div>
            <p className="text-sm text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-500" />
              Data Synced
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">2.1M</div>
            <p className="text-sm text-muted-foreground">Records this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-500" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">99.7%</div>
            <p className="text-sm text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5" />
              Integration Connectors
            </CardTitle>
            <CardDescription>Manage system connections and configurations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/admin/cms/integrations/connectors">
                <Workflow className="h-4 w-4 mr-2" />
                Manage Connectors
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>CRM, ERP, Marketing, Analytics systems</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Workflow Automation
            </CardTitle>
            <CardDescription>Create and manage automated workflows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/integrations/workflows">
                <Zap className="h-4 w-4 mr-2" />
                Automation Hub
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Event-driven process automation</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              API Gateway
            </CardTitle>
            <CardDescription>Monitor and manage API traffic</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/integrations/api-gateway">
                <Globe className="h-4 w-4 mr-2" />
                API Dashboard
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Rate limiting, authentication, monitoring</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Integrations */}
      <Card>
        <CardHeader>
          <CardTitle>Active Integrations</CardTitle>
          <CardDescription>Currently connected enterprise systems</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Database className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Salesforce CRM</h3>
                    <p className="text-sm text-muted-foreground">Customer relationship management</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                  <Badge variant="outline">Bidirectional</Badge>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Last Sync</p>
                  <p className="font-medium">2 minutes ago</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Records Synced</p>
                  <p className="font-medium">15,247</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium text-green-600">Healthy</p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Google Analytics</h3>
                    <p className="text-sm text-muted-foreground">Web analytics and reporting</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                  <Badge variant="outline">Inbound</Badge>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Last Sync</p>
                  <p className="font-medium">1 hour ago</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Events Today</p>
                  <p className="font-medium">8,934</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium text-green-600">Healthy</p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Globe className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">HubSpot Marketing</h3>
                    <p className="text-sm text-muted-foreground">Marketing automation platform</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-yellow-100 text-yellow-800">Syncing</Badge>
                  <Badge variant="outline">Outbound</Badge>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Last Sync</p>
                  <p className="font-medium">5 minutes ago</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Contacts Synced</p>
                  <p className="font-medium">3,456</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium text-yellow-600">Syncing</p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Database className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">SAP ERP</h3>
                    <p className="text-sm text-muted-foreground">Enterprise resource planning</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="destructive">Error</Badge>
                  <Badge variant="outline">Bidirectional</Badge>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Last Sync</p>
                  <p className="font-medium">2 hours ago</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Error Count</p>
                  <p className="font-medium text-red-600">3</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium text-red-600">Connection Error</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm">Retry Connection</Button>
                <Button size="sm" variant="outline">
                  View Logs
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Integration Activity</CardTitle>
          <CardDescription>Latest events and sync operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-2 border-green-500 pl-4">
              <p className="text-sm font-medium">Salesforce sync completed successfully</p>
              <p className="text-xs text-muted-foreground">2 minutes ago • 247 records updated</p>
            </div>
            <div className="border-l-2 border-blue-500 pl-4">
              <p className="text-sm font-medium">New workflow automation created</p>
              <p className="text-xs text-muted-foreground">15 minutes ago • Lead scoring automation</p>
            </div>
            <div className="border-l-2 border-red-500 pl-4">
              <p className="text-sm font-medium">SAP ERP connection failed</p>
              <p className="text-xs text-muted-foreground">2 hours ago • Authentication timeout</p>
            </div>
            <div className="border-l-2 border-purple-500 pl-4">
              <p className="text-sm font-medium">Google Analytics data imported</p>
              <p className="text-xs text-muted-foreground">1 hour ago • 8,934 events processed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
