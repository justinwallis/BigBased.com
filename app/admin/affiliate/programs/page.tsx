import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Globe, Settings, BarChart3 } from "lucide-react"
import { getAffiliatePrograms } from "@/app/actions/affiliate-actions"

export default async function AffiliateProgramsPage() {
  const programsResult = await getAffiliatePrograms()
  const programs = programsResult.success ? programsResult.data : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/affiliate">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Affiliate
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Affiliate Programs</h1>
            <p className="text-muted-foreground">Manage your affiliate programs and commission structures</p>
          </div>
        </div>
        <Button asChild>
          <Link href="/admin/affiliate/programs/new">
            <Plus className="h-4 w-4 mr-2" />
            New Program
          </Link>
        </Button>
      </div>

      {/* Programs List */}
      <div className="grid gap-6">
        {programs.map((program: any) => (
          <Card key={program.id} className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-500" />
                    {program.name}
                    <Badge variant={program.status === "active" ? "default" : "secondary"}>{program.status}</Badge>
                  </CardTitle>
                  <CardDescription>{program.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/affiliate/programs/${program.id}/analytics`}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/affiliate/programs/${program.id}/settings`}>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Commission Rate</p>
                  <p className="font-semibold">{(program.default_commission_rate * 100).toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Commission Type</p>
                  <p className="font-semibold capitalize">{program.commission_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cookie Duration</p>
                  <p className="font-semibold">{program.cookie_duration} days</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Min Payout</p>
                  <p className="font-semibold">${program.min_payout_amount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {programs.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No affiliate programs yet</h3>
              <p className="text-muted-foreground mb-4">Create your first affiliate program to get started</p>
              <Button asChild>
                <Link href="/admin/affiliate/programs/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Program
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
