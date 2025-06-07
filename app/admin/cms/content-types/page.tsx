import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import ContentTypesClient from "./content-types-client"

export default function ContentTypesPage() {
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
            <h1 className="text-3xl font-bold text-foreground">Content Types</h1>
            <p className="text-muted-foreground">Define the structure of your content</p>
          </div>
        </div>
        <Button asChild>
          <Link href="/admin/cms/content-types/new">
            <Plus className="h-4 w-4 mr-2" />
            New Content Type
          </Link>
        </Button>
      </div>

      <ContentTypesClient />
    </div>
  )
}
