import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Users,
  DollarSign,
  TrendingUp,
  Shield,
  Globe,
  Zap,
  Target,
  Award,
  BarChart3,
  Settings,
  Plus,
} from "lucide-react"
import { getAffiliateDashboardStats } from "@/app/actions/affiliate-actions"

export default async function AffiliateAdminPage() {
  const statsResult = await getAffiliateDashboardStats()
  const stats = statsResult.success ? statsResult.data : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin" className="text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-500" />
            Enterprise Affiliate System
            <Badge className="bg-blue-100 text-blue-800">Feature 8</Badge>
          </h1>
          <p className="text-muted-foreground">
            Complete affiliate management with MLM, tracking, payouts, and fraud detection
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active_programs}</div>
              <p className="text-xs text-muted-foreground">Running affiliate programs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Affiliates</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active_affiliates}</div>
              <p className="text-xs text-muted-foreground">Verified partners</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Conversions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.monthly_conversions}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Commissions</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.monthly_commissions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Earned this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.pending_payouts.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Awaiting payment</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Feature Sections */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Program Management */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              Program Management
            </CardTitle>
            <CardDescription>Create and manage affiliate programs with custom commission structures</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-1">
              <p>• Multi-tier commission structures</p>
              <p>• Geographic restrictions</p>
              <p>• Custom cookie durations</p>
              <p>• White-label branding</p>
            </div>
            <Button asChild className="w-full">
              <Link href="/admin/affiliate/programs">
                <Globe className="h-4 w-4 mr-2" />
                Manage Programs
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Affiliate Management */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              Affiliate Management
            </CardTitle>
            <CardDescription>Recruit, verify, and manage your affiliate network</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-1">
              <p>• Affiliate verification system</p>
              <p>• Performance tier management</p>
              <p>• MLM/Network structure</p>
              <p>• Custom onboarding flows</p>
            </div>
            <Button asChild className="w-full">
              <Link href="/admin/affiliate/affiliates">
                <Users className="h-4 w-4 mr-2" />
                Manage Affiliates
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Tracking & Analytics */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              Tracking & Analytics
            </CardTitle>
            <CardDescription>Real-time tracking with advanced attribution models</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-1">
              <p>• Real-time click tracking</p>
              <p>• Multi-touch attribution</p>
              <p>• Conversion analytics</p>
              <p>• Performance dashboards</p>
            </div>
            <Button asChild className="w-full">
              <Link href="/admin/affiliate/analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Commission & Payouts */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-orange-500" />
              Commission & Payouts
            </CardTitle>
            <CardDescription>Automated commission calculation and payout processing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-1">
              <p>• Flexible commission structures</p>
              <p>• Automated payout processing</p>
              <p>• Multiple payment methods</p>
              <p>• Tax document generation</p>
            </div>
            <Button asChild className="w-full">
              <Link href="/admin/affiliate/payouts">
                <DollarSign className="h-4 w-4 mr-2" />
                Manage Payouts
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Marketing Materials */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-red-500" />
              Marketing Materials
            </CardTitle>
            <CardDescription>Provide affiliates with high-converting marketing assets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-1">
              <p>• Banner and text ads</p>
              <p>• Email templates</p>
              <p>• Landing page builders</p>
              <p>• A/B testing tools</p>
            </div>
            <Button asChild className="w-full">
              <Link href="/admin/affiliate/materials">
                <Target className="h-4 w-4 mr-2" />
                Manage Materials
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Fraud Detection */}
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-yellow-600" />
              Fraud Detection
            </CardTitle>
            <CardDescription>Advanced fraud prevention and risk management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-1">
              <p>• Real-time fraud detection</p>
              <p>• Behavioral analysis</p>
              <p>• Risk scoring algorithms</p>
              <p>• Automated blocking rules</p>
            </div>
            <Button asChild className="w-full">
              <Link href="/admin/affiliate/fraud">
                <Shield className="h-4 w-4 mr-2" />
                Fraud Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Gamification */}
        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-500" />
              Gamification & Incentives
            </CardTitle>
            <CardDescription>Motivate affiliates with achievements and rewards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-1">
              <p>• Achievement systems</p>
              <p>• Performance leaderboards</p>
              <p>• Bonus campaigns</p>
              <p>• Recognition programs</p>
            </div>
            <Button asChild className="w-full">
              <Link href="/admin/affiliate/gamification">
                <Award className="h-4 w-4 mr-2" />
                Manage Incentives
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Communication Hub */}
        <Card className="border-l-4 border-l-cyan-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-cyan-500" />
              Communication Hub
            </CardTitle>
            <CardDescription>Automated communications and affiliate support</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-1">
              <p>• Automated email sequences</p>
              <p>• Performance notifications</p>
              <p>• Training materials</p>
              <p>• Support ticketing</p>
            </div>
            <Button asChild className="w-full">
              <Link href="/admin/affiliate/communications">
                <Zap className="h-4 w-4 mr-2" />
                Communications
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* API & Integrations */}
        <Card className="border-l-4 border-l-pink-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-pink-500" />
              API & Integrations
            </CardTitle>
            <CardDescription>Connect with external systems and platforms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-1">
              <p>• RESTful API access</p>
              <p>• Webhook integrations</p>
              <p>• CRM synchronization</p>
              <p>• Custom integrations</p>
            </div>
            <Button asChild className="w-full">
              <Link href="/admin/affiliate/integrations">
                <Settings className="h-4 w-4 mr-2" />
                API Settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common affiliate management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <Button asChild>
              <Link href="/admin/affiliate/programs/new">
                <Plus className="h-4 w-4 mr-2" />
                New Program
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/affiliate/affiliates/pending">
                <Users className="h-4 w-4 mr-2" />
                Review Pending
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/affiliate/payouts/process">
                <DollarSign className="h-4 w-4 mr-2" />
                Process Payouts
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/affiliate/materials/new">
                <Target className="h-4 w-4 mr-2" />
                Add Material
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feature Highlights */}
      <Card>
        <CardHeader>
          <CardTitle>Enterprise Affiliate Features</CardTitle>
          <CardDescription>Complete feature set for enterprise affiliate management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Multi-Level Marketing (MLM)</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Unlimited tier depth</li>
                <li>• Override commissions</li>
                <li>• Team performance tracking</li>
                <li>• Genealogy visualization</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Advanced Attribution</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• First-click attribution</li>
                <li>• Last-click attribution</li>
                <li>• Linear attribution</li>
                <li>• Time-decay models</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Payment Processing</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Bank transfers</li>
                <li>• PayPal integration</li>
                <li>• Stripe payouts</li>
                <li>• Cryptocurrency support</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Compliance & Legal</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Tax document generation</li>
                <li>• GDPR compliance</li>
                <li>• Terms & conditions</li>
                <li>• Regulatory reporting</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">White-Label Solutions</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Custom affiliate portals</li>
                <li>• Branded materials</li>
                <li>• Custom domains</li>
                <li>• API customization</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Enterprise Security</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Real-time fraud detection</li>
                <li>• IP blocking</li>
                <li>• Behavioral analysis</li>
                <li>• Risk scoring</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
