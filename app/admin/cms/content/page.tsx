import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import { getContentTypes, getContentItems } from "@/app/actions/cms-actions"
import ContentListClient from "./content-list-client"

export default async function ContentPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const typeId = searchParams.type as string | undefined

  const [contentTypesResult, contentItemsResult] = await Promise.all([getContentTypes(), getContentItems(typeId)])

  const contentTypes = contentTypesResult.success ? contentTypesResult.data : []
  const contentItems = contentItemsResult.success ? contentItemsResult.data : []

  const selectedType = typeId ? contentTypes.find((type) => type.id === typeId) : null

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
            <h1 className="text-3xl font-bold text-foreground">
              {selectedType ? `${selectedType.name} Content` : "All Content"}
            </h1>
            <p className="text-muted-foreground">
              {selectedType
                ? `Manage ${selectedType.name.toLowerCase()} content items`
                : "Manage all content across your site"}
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/admin/cms/content/new${typeId ? `?type=${typeId}` : ""}`}>
            <Plus className="h-4 w-4 mr-2" />
            Create Content
          </Link>
        </Button>
      </div>

      <ContentListClient initialContentItems={contentItems} contentTypes={contentTypes} selectedTypeId={typeId} />
    </div>
  )
}
