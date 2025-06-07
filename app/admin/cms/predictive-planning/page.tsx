import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, TrendingUp, Calendar, Target, Eye, BarChart3, Lightbulb } from "lucide-react"

export default function PredictiveContentPlanningPage() {
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
          <h1 className="text-3xl font-bold text-foreground">Predictive Content Planning</h1>
          <p className="text-muted-foreground">AI-powered insights for strategic content planning and optimization</p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Prediction
            </CardTitle>
            <CardDescription>Predict how your content will perform before publishing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/admin/cms/predictive-planning/predictions">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Predictions
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Engagement, traffic, conversion forecasts</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Content Gap Analysis
            </CardTitle>
            <CardDescription>Identify content opportunities in your market</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/predictive-planning/gaps">
                <Target className="h-4 w-4 mr-2" />
                Find Gaps
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Keyword opportunities, topic gaps</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Seasonal Trends
            </CardTitle>
            <CardDescription>Plan content around seasonal patterns and trends</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/predictive-planning/seasonal">
                <Calendar className="h-4 w-4 mr-2" />
                View Trends
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Seasonal content opportunities</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Competitive Intelligence
            </CardTitle>
            <CardDescription>Monitor and analyze competitor content strategies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/predictive-planning/competitive">
                <Eye className="h-4 w-4 mr-2" />
                Competitor Analysis
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Track competitor content performance</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Content Calendar
            </CardTitle>
            <CardDescription>AI-optimized content planning calendar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/predictive-planning/calendar">
                <BarChart3 className="h-4 w-4 mr-2" />
                Planning Calendar
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Optimized publishing schedule</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Content Recommendations
            </CardTitle>
            <CardDescription>Get AI-powered content suggestions and ideas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/predictive-planning/recommendations">
                <Lightbulb className="h-4 w-4 mr-2" />
                Get Recommendations
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Topic ideas, content formats</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Content Performance Forecast</CardTitle>
            <CardDescription>Predicted performance for upcoming content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Enterprise CMS Security Guide</h3>
                    <p className="text-sm text-muted-foreground">Scheduled for next week</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">High Potential</div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Engagement</p>
                    <p className="font-medium">85%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Traffic</p>
                    <p className="font-medium">+340%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Conversion</p>
                    <p className="font-medium">12.3%</p>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">AI Content Marketing Trends</h3>
                    <p className="text-sm text-muted-foreground">In draft</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">Medium Potential</div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Engagement</p>
                    <p className="font-medium">72%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Traffic</p>
                    <p className="font-medium">+180%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Conversion</p>
                    <p className="font-medium">8.7%</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Content Opportunities</CardTitle>
            <CardDescription>High-priority content gaps to address</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-medium">Enterprise API Security</h3>
                <p className="text-sm text-muted-foreground">High search volume, low competition</p>
                <div className="flex gap-2 mt-2">
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Urgent</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">8.9K searches/mo</span>
                </div>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-medium">Headless Commerce ROI</h3>
                <p className="text-sm text-muted-foreground">Growing trend, competitor gap</p>
                <div className="flex gap-2 mt-2">
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">High</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">5.6K searches/mo</span>
                </div>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-medium">Multi-tenant Architecture</h3>
                <p className="text-sm text-muted-foreground">Technical audience, high value</p>
                <div className="flex gap-2 mt-2">
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Medium</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">3.4K searches/mo</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
