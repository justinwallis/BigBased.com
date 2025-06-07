import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Network, Search, Brain, Lightbulb, BarChart3, Zap } from "lucide-react"

export default function KnowledgeGraphPage() {
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
          <h1 className="text-3xl font-bold text-foreground">Enterprise Knowledge Graph</h1>
          <p className="text-muted-foreground">
            Visualize and explore relationships between your content, concepts, and entities
          </p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Graph Explorer
            </CardTitle>
            <CardDescription>Interactive visualization of your knowledge graph</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/admin/cms/knowledge-graph/explorer">
                <Network className="h-4 w-4 mr-2" />
                Explore Graph
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Visual network of content relationships</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Entity Search
            </CardTitle>
            <CardDescription>Find and explore entities across your content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/knowledge-graph/search">
                <Search className="h-4 w-4 mr-2" />
                Search Entities
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Semantic search across all content</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Concept Management
            </CardTitle>
            <CardDescription>Manage concepts and topic hierarchies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/knowledge-graph/concepts">
                <Brain className="h-4 w-4 mr-2" />
                Manage Concepts
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Topic taxonomy and relationships</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Content Connections
            </CardTitle>
            <CardDescription>Discover hidden relationships in your content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/knowledge-graph/connections">
                <Lightbulb className="h-4 w-4 mr-2" />
                Find Connections
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>AI-powered relationship discovery</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Graph Analytics
            </CardTitle>
            <CardDescription>Analyze your knowledge graph structure and performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/knowledge-graph/analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Graph metrics and insights</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Auto-Generation
            </CardTitle>
            <CardDescription>Automatically extract entities and relationships</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/knowledge-graph/auto-generate">
                <Zap className="h-4 w-4 mr-2" />
                Auto-Generate
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>AI-powered entity extraction</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graph Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Graph Statistics</CardTitle>
            <CardDescription>Overview of your knowledge graph</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Total Entities</span>
                <span className="text-sm text-muted-foreground">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Relationships</span>
                <span className="text-sm text-muted-foreground">3,891</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Concepts</span>
                <span className="text-sm text-muted-foreground">156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Connected Components</span>
                <span className="text-sm text-muted-foreground">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Average Connections</span>
                <span className="text-sm text-muted-foreground">3.1</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest knowledge graph updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-2 border-blue-500 pl-4">
                <p className="text-sm font-medium">New entity: "Enterprise AI Solutions"</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <div className="border-l-2 border-green-500 pl-4">
                <p className="text-sm font-medium">Relationship verified: CMS → Content Strategy</p>
                <p className="text-xs text-muted-foreground">4 hours ago</p>
              </div>
              <div className="border-l-2 border-purple-500 pl-4">
                <p className="text-sm font-medium">Auto-generated 15 new relationships</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
              <div className="border-l-2 border-orange-500 pl-4">
                <p className="text-sm font-medium">Concept updated: "Digital Transformation"</p>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
