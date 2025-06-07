import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import DomainAdminClient from "./domain-admin-client"
import DomainConfigClient from "./domain-config-client"
import BulkImportClient from "./bulk-import-client"

export default function DomainsPage() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Domain Management</h1>
          <p className="text-muted-foreground">Configure and manage your domains</p>
        </div>
      </div>

      <div className="grid gap-6">
        <DomainAdminClient />
        <DomainConfigClient />
        <BulkImportClient />
      </div>
    </div>
  )
}
