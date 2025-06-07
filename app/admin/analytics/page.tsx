import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Globe, TrendingUp, Users } from "lucide-react"

// Force dynamic rendering
export const dynamic = "force-dynamic"

async function getAnalyticsData() {
  const supabase = createClient()

  try {
    // Get total domains
    const { data: domains, error: domainsError } = await supabase
      .from("domains")
      .select("id, domain, is_active, created_at, custom_branding")
      .order("created_at", { ascending: false })

    if (domainsError) {
      console.error("Error fetching domains:", domainsError)
      return { domains: [], totalDomains: 0, activeDomains: 0, analytics: [] }
    }

    // Get analytics data
    const { data: analytics, error: analyticsError } = await supabase
      .from("domain_analytics")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100)

    if (analyticsError) {
      console.error("Error fetching analytics:", analyticsError)
    }

    const activeDomains = domains?.filter((d) => d.is_active).length || 0

    return {
      domains: domains || [],
      totalDomains: domains?.length || 0,
      activeDomains,
      analytics: analytics || [],
    }
  } catch (error) {
    console.error("Error in getAnalyticsData:", error)
    return { domains: [], totalDomains: 0, activeDomains: 0, analytics: [] }
  }
}

export default async function AnalyticsPage() {
  const { domains, totalDomains, activeDomains, analytics } = await getAnalyticsData()

  // Calculate some basic metrics
  const pageViews = analytics.filter((a) => a.visit_type === "pageview").length
  const uniqueVisitors = new Set(analytics.map((a) => a.metadata?.ip || "unknown")).size

  // Recent domains (last 7 days)
  const recentDomains = domains.filter((d) => {
    const createdAt = new Date(d.created_at)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    return createdAt > weekAgo
  }).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Monitor your multi-tenant platform performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Domains</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDomains.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{activeDomains} active domains</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pageViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total page views tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all domains</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{recentDomains}</div>
            <p className="text-xs text-muted-foreground">New domains this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Domain Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Domain Status Overview</CardTitle>
            <CardDescription>Status breakdown of all configured domains</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Domains</span>
                <span className="text-sm text-muted-foreground">{activeDomains}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Inactive Domains</span>
                <span className="text-sm text-muted-foreground">{totalDomains - activeDomains}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">BigBased Domains</span>
                <span className="text-sm text-muted-foreground">
                  {domains.filter((d) => d.domain.includes("bigbased")).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">BasedBook Domains</span>
                <span className="text-sm text-muted-foreground">
                  {domains.filter((d) => d.domain.includes("basedbook")).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Custom Domains</span>
                <span className="text-sm text-muted-foreground">
                  {domains.filter((d) => !d.domain.includes("bigbased") && !d.domain.includes("basedbook")).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest domain analytics and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.length > 0 ? (
                analytics.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{activity.visit_type}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">Domain ID: {activity.domain_id}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                  <p className="text-xs text-muted-foreground">Analytics will appear as domains receive traffic</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Domains */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Added Domains</CardTitle>
          <CardDescription>Latest domains added to your network</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {domains.slice(0, 10).map((domain) => (
              <div key={domain.id} className="flex items-center justify-between p-2 rounded-lg border">
                <div>
                  <p className="text-sm font-medium">{domain.domain}</p>
                  <p className="text-xs text-muted-foreground">
                    {domain.custom_branding?.site_name || "No site name configured"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      domain.is_active
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {domain.is_active ? "Active" : "Inactive"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(domain.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Setup */}
      {analytics.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Analytics Setup</CardTitle>
            <CardDescription>Configure analytics tracking for your domains</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Your domains are configured and ready! Analytics will start appearing as visitors access your domains.
              </p>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Available Features:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Domain-specific traffic analytics</li>
                  <li>• User engagement metrics</li>
                  <li>• Performance monitoring</li>
                  <li>• Custom event tracking</li>
                  <li>• Real-time visitor tracking</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
