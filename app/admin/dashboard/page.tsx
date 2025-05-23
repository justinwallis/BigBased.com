import { Database, Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-5">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Payload CMS Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Payload CMS
            </CardTitle>
            <CardDescription>Access the Payload CMS admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="default" asChild className="w-full justify-start">
                <Link href="/admin/cms">
                  <Settings className="h-4 w-4 mr-2" />
                  Open Payload CMS
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Database Management Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Management
            </CardTitle>
            <CardDescription>Initialize and manage CMS database tables</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" asChild className="w-full justify-start">
                <Link href="/admin/init-db">
                  <Settings className="h-4 w-4 mr-2" />
                  Initialize Database
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
