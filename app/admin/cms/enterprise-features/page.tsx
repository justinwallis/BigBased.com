import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, FileText, Shield, Network, TrendingUp, Scale, Workflow, Users, ArrowLeft } from "lucide-react"

export default function EnterpriseFeatures() {
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
          <h1 className="text-3xl font-bold">Enterprise Features</h1>
          <p className="text-muted-foreground">All 7 enterprise features are active and ready to use</p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Feature 1: Multi-tenant Domain Management */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              Multi-tenant Domain Management
              <Badge className="bg-blue-100 text-blue-800 text-xs">Feature 1</Badge>
            </CardTitle>
            <CardDescription>Configure and manage multiple domains with custom branding</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <p className="text-sm text-muted-foreground">
              The multi-tenant domain system allows you to manage multiple branded experiences from a single
              installation. Each domain can have custom themes, content, and user experiences.
            </p>
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
              Advanced CMS with Nested Documents
              <Badge className="bg-green-100 text-green-800 text-xs">Feature 2</Badge>
            </CardTitle>
            <CardDescription>Hierarchical content management with versioning and workflows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <p className="text-sm text-muted-foreground">
              The advanced CMS supports nested documents, content relationships, and complex workflows. Content can be
              organized hierarchically with parent-child relationships and full versioning.
            </p>
            <Button asChild className="w-full">
              <Link href="/admin/cms/tools">
                <FileText className="h-4 w-4 mr-2" />
                CMS Tools
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Feature 3: Digital Asset Rights */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-500" />
              Digital Asset Rights Management
              <Badge className="bg-purple-100 text-purple-800 text-xs">Feature 3</Badge>
            </CardTitle>
            <CardDescription>Track licensing, usage rights, and personalization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <p className="text-sm text-muted-foreground">
              The digital asset rights management system tracks licensing, usage rights, and expiration dates for all
              media. It also enables personalized content delivery based on user segments.
            </p>
            <Button asChild className="w-full">
              <Link href="/admin/cms/digital-assets">
                <Shield className="h-4 w-4 mr-2" />
                Manage Digital Assets
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Feature 4: Knowledge Graph */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5 text-orange-500" />
              Enterprise Knowledge Graph
              <Badge className="bg-orange-100 text-orange-800 text-xs">Feature 4</Badge>
            </CardTitle>
            <CardDescription>AI-powered content relationships and entity mapping</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <p className="text-sm text-muted-foreground">
              The knowledge graph automatically identifies entities and relationships in your content, creating a
              semantic network that powers recommendations, search, and content discovery.
            </p>
            <Button asChild className="w-full">
              <Link href="/admin/cms/knowledge-graph">
                <Network className="h-4 w-4 mr-2" />
                Explore Knowledge Graph
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Feature 5: Predictive Planning */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-red-500" />
              Predictive Content Planning
              <Badge className="bg-red-100 text-red-800 text-xs">Feature 5</Badge>
            </CardTitle>
            <CardDescription>AI-powered content forecasting and strategic planning</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <p className="text-sm text-muted-foreground">
              The predictive planning system uses AI to forecast content performance, identify trends, and recommend
              optimal publishing strategies based on historical data and audience behavior.
            </p>
            <Button asChild className="w-full">
              <Link href="/admin/cms/predictive-planning">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Predictions
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Feature 6: Compliance Automation */}
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-yellow-600" />
              Compliance Automation Framework
              <Badge className="bg-yellow-100 text-yellow-800 text-xs">Feature 6</Badge>
            </CardTitle>
            <CardDescription>Automated regulatory compliance and risk management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <p className="text-sm text-muted-foreground">
              The compliance automation framework monitors content for regulatory compliance across GDPR, CCPA, ADA, and
              industry-specific regulations, with automated remediation suggestions.
            </p>
            <Button asChild className="w-full">
              <Link href="/admin/cms/compliance">
                <Scale className="h-4 w-4 mr-2" />
                Compliance Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Feature 7: Enterprise Integration */}
        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5 text-indigo-500" />
              Enterprise Integration Framework
              <Badge className="bg-indigo-100 text-indigo-800 text-xs">Feature 7</Badge>
            </CardTitle>
            <CardDescription>API gateway, workflows, and system integrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <p className="text-sm text-muted-foreground">
              The enterprise integration framework connects your content platform with CRM, marketing automation,
              analytics, and other business systems through a unified API gateway and workflow engine.
            </p>
            <Button asChild className="w-full">
              <Link href="/admin/cms/integrations">
                <Workflow className="h-4 w-4 mr-2" />
                Manage Integrations
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Feature 8: Personalization */}
        <Card className="border-l-4 border-l-cyan-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-cyan-500" />
              Personalization Engine
              <Badge className="bg-cyan-100 text-cyan-800 text-xs">Bonus Feature</Badge>
            </CardTitle>
            <CardDescription>Dynamic content personalization and user segmentation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">User Segments</p>
                <p className="font-semibold">28</p>
              </div>
              <div>
                <p className="text-muted-foreground">Personalized Views</p>
                <p className="font-semibold">124K</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              The personalization engine delivers tailored content experiences based on user behavior, preferences, and
              segment membership, with A/B testing capabilities and conversion optimization.
            </p>
            <Button asChild className="w-full">
              <Link href="/admin/cms/personalization">
                <Users className="h-4 w-4 mr-2" />
                Personalization Settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
