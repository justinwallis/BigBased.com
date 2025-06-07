import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Brain, Lightbulb, BarChart3, Target, LineChart, Zap } from "lucide-react"

export default function ContentIntelligencePage() {
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
          <h1 className="text-3xl font-bold text-foreground">Content Intelligence</h1>
          <p className="text-muted-foreground">AI-powered insights and optimization for your content</p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Content Analysis
            </CardTitle>
            <CardDescription>Get AI-powered insights on your content quality and performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/admin/cms/intelligence/analyze">
                <Brain className="h-4 w-4 mr-2" />
                Analyze Content
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Readability, SEO, tone analysis</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Content Suggestions
            </CardTitle>
            <CardDescription>Get AI-generated content ideas based on your audience and goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/intelligence/suggestions">
                <Lightbulb className="h-4 w-4 mr-2" />
                Get Suggestions
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Topic ideas, headline suggestions</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Competitive Analysis
            </CardTitle>
            <CardDescription>See how your content compares to competitors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/intelligence/competitive">
                <BarChart3 className="h-4 w-4 mr-2" />
                Compare Content
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Benchmark against competitors</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Audience Insights
            </CardTitle>
            <CardDescription>Understand how your content resonates with different audience segments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/intelligence/audience">
                <Target className="h-4 w-4 mr-2" />
                Audience Match
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Segment analysis, content fit</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Performance Prediction
            </CardTitle>
            <CardDescription>Predict how your content will perform before publishing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/intelligence/predict">
                <LineChart className="h-4 w-4 mr-2" />
                Predict Performance
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Engagement, conversion forecasts</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Content Optimization
            </CardTitle>
            <CardDescription>Get AI-powered recommendations to improve your content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/intelligence/optimize">
                <Zap className="h-4 w-4 mr-2" />
                Optimize Content
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>SEO, readability, conversion</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Content Analysis</CardTitle>
          <CardDescription>Latest AI insights on your content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">How to Choose the Right CMS for Your Business</h3>
                  <p className="text-sm text-muted-foreground">Analyzed 2 hours ago</p>
                </div>
                <div className="flex gap-2">
                  <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">SEO: 92%</div>
                  <div className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">Readability: 78%</div>
                </div>
              </div>
              <div className="mt-3 text-sm">
                <p>
                  <strong>Strengths:</strong> Comprehensive coverage, clear examples, strong SEO
                </p>
                <p>
                  <strong>Suggestions:</strong> Add more visuals, simplify some technical explanations
                </p>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">10 Enterprise CMS Features You Can't Live Without</h3>
                  <p className="text-sm text-muted-foreground">Analyzed 1 day ago</p>
                </div>
                <div className="flex gap-2">
                  <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">SEO: 88%</div>
                  <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Readability: 85%</div>
                </div>
              </div>
              <div className="mt-3 text-sm">
                <p>
                  <strong>Strengths:</strong> Engaging format, actionable advice, good keyword usage
                </p>
                <p>
                  <strong>Suggestions:</strong> Add case studies, expand conclusion with next steps
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
