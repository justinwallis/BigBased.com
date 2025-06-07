import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import DomainAdminClient from "./domain-admin-client"

// This is a server component - no "use client" directive
export default async function DomainsPage() {
  // We'll fetch domains on the client side to avoid server/client mixing
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
          <p className="text-muted-foreground">Configure and manage your domains</p>
        </div>
      </div>

      <DomainAdminClient />
    </div>
  )
}
