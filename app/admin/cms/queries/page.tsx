import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import QueryPresetsClient from "./query-presets-client"

export default function QueryPresetsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Query Presets</h1>
          <p className="text-muted-foreground">Save and manage frequently used content queries</p>
        </div>
        <Button asChild>
          <Link href="/admin/cms/queries/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Query
          </Link>
        </Button>
      </div>

      <QueryPresetsClient />
    </div>
  )
}
