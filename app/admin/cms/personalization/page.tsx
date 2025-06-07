import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Users, Layers, TestTube, Target, BarChart3, Settings } from "lucide-react"

export default function PersonalizationPage() {
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
          <h1 className="text-3xl font-bold text-foreground">Personalization Engine</h1>
          <p className="text-muted-foreground">
            Create personalized content experiences for different audience segments
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Segments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Audience segments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Variants</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Personalized variants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tests</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">A/B tests running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Lift</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+24%</div>
            <p className="text-xs text-muted-foreground">From personalization</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Sections */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Audience Segments
            </CardTitle>
            <CardDescription>Create and manage audience segments for targeting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/admin/cms/personalization/segments">
                <Users className="h-4 w-4 mr-2" />
                Manage Segments
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Define audience targeting rules</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Content Variants
            </CardTitle>
            <CardDescription>Create personalized content versions for different segments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/personalization/variants">
                <Layers className="h-4 w-4 mr-2" />
                Content Variants
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Personalize content by segment</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              A/B Testing
            </CardTitle>
            <CardDescription>Create and manage A/B tests to optimize content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/personalization/tests">
                <TestTube className="h-4 w-4 mr-2" />
                Manage Tests
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Test different content variations</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Targeting Rules
            </CardTitle>
            <CardDescription>Define rules for when and how content is personalized</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/personalization/rules">
                <Target className="h-4 w-4 mr-2" />
                Manage Rules
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Configure personalization logic</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics
            </CardTitle>
            <CardDescription>Measure the impact of your personalization efforts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/personalization/analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Performance metrics and insights</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </CardTitle>
            <CardDescription>Configure personalization engine settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/personalization/settings">
                <Settings className="h-4 w-4 mr-2" />
                Configure Settings
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Global personalization settings</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Tests */}
      <Card>
        <CardHeader>
          <CardTitle>Active A/B Tests</CardTitle>
          <CardDescription>Currently running content experiments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Homepage Hero Test</h3>
                  <p className="text-sm text-muted-foreground">Testing 2 variants • Started 5 days ago</p>
                </div>
                <div className="flex gap-2">
                  <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Running</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Variant A (Control)</span>
                    <span className="font-medium">3.2% conversion</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                </div>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Variant B</span>
                    <span className="font-medium text-green-600">4.1% conversion</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "55%" }}></div>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Pricing Page Layout Test</h3>
                  <p className="text-sm text-muted-foreground">Testing 3 variants • Started 2 days ago</p>
                </div>
                <div className="flex gap-2">
                  <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Running</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Variant A (Control)</span>
                    <span className="font-medium">2.8% conversion</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "28%" }}></div>
                  </div>
                </div>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Variant B</span>
                    <span className="font-medium">2.5% conversion</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "25%" }}></div>
                  </div>
                </div>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Variant C</span>
                    <span className="font-medium text-green-600">4.7% conversion</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "47%" }}></div>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
