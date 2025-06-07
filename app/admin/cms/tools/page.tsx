import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import CMSToolsClient from "./cms-tools-client"

export default function CMSToolsPage() {
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
          <h1 className="text-3xl font-bold text-foreground">CMS Tools & Migration</h1>
          <p className="text-muted-foreground">Advanced tools for content migration, backup, and system maintenance</p>
        </div>
      </div>

      <CMSToolsClient />
    </div>
  )
}
