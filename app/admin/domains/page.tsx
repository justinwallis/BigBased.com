"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Database, Settings } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import DomainAdminClient from "./domain-admin-client"

// Force dynamic rendering
export const dynamic = "force-dynamic"

export default async function DomainsPage() {
  try {
    const supabase = createClient()

    // Fetch domains from the database
    const { data: domains, error } = await supabase
      .from("domains")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching domains:", error)
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin" className="text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Domain Management</h1>
              <p className="text-muted-foreground">Error loading domains: {error.message}</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Error
              </CardTitle>
              <CardDescription>
                Could not fetch domains from the database. Please check your database connection.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Error: {error.message}</p>
              <Button className="mt-4" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    const domainList = domains || []

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin" className="text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Domain Management</h1>
            <p className="text-muted-foreground">Manage your {domainList.length} configured domains</p>
          </div>
        </div>

        <DomainAdminClient initialDomains={domainList} />
      </div>
    )
  } catch (error) {
    console.error("Unexpected error in domains page:", error)

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin" className="text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Domain Management</h1>
            <p className="text-muted-foreground">Unexpected error occurred</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Error
            </CardTitle>
            <CardDescription>An unexpected error occurred while loading the domain management page.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error instanceof Error ? error.message : "Unknown error"}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
}
