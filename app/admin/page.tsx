import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"

export default async function AdminPage() {
  const supabase = createClient()

  // Get domain count
  const { count: domainCount } = await supabase.from("domains").select("*", { count: "exact", head: true })

  // Get active domain count
  const { count: activeDomainCount } = await supabase
    .from("domains")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/domains">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Domain Management</CardTitle>
              <CardDescription>Manage all your domains</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{domainCount || 0} domains</div>
              <p className="text-muted-foreground">{activeDomainCount || 0} active</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/analytics">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>View domain performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Coming Soon</div>
              <p className="text-muted-foreground">Domain analytics</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/settings">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Configure system settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Coming Soon</div>
              <p className="text-muted-foreground">Global configuration</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
