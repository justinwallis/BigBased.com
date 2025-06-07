import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus } from "lucide-react"
import { getRedirects } from "@/app/actions/cms-redirects-actions"
import { RedirectsListClient } from "./redirects-list-client"

export default async function RedirectsPage() {
  const redirectsResult = await getRedirects()
  const redirects = redirectsResult.success ? redirectsResult.data : []

  const stats = {
    total: redirects.length,
    active: redirects.filter((r) => r.is_active).length,
    inactive: redirects.filter((r) => !r.is_active).length,
    totalHits: redirects.reduce((sum, r) => sum + (r.hit_count || 0), 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/cms" className="text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to CMS
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Redirects Management</h1>
            <p className="text-muted-foreground">Manage URL redirects and track their usage</p>
          </div>
        </div>
        <Button asChild>
          <Link href="/admin/cms/redirects/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Redirect
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Redirects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All redirects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">Disabled redirects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time usage</p>
          </CardContent>
        </Card>
      </div>

      {/* Redirects List */}
      <Card>
        <CardHeader>
          <CardTitle>All Redirects</CardTitle>
          <CardDescription>Manage your URL redirects and monitor their performance</CardDescription>
        </CardHeader>
        <CardContent>
          <RedirectsListClient redirects={redirects} />
        </CardContent>
      </Card>
    </div>
  )
}
