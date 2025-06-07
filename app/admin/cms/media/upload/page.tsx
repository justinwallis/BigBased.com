import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getMediaFolders } from "@/app/actions/cms-actions"
import MediaUploadClient from "./media-upload-client"

export default async function MediaUploadPage() {
  const mediaFoldersResult = await getMediaFolders()
  const mediaFolders = mediaFoldersResult.success ? mediaFoldersResult.data : []

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/cms/media" className="text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Media Library
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Upload Media</h1>
          <p className="text-muted-foreground">Upload images, documents, and other files to your media library</p>
        </div>
      </div>

      <MediaUploadClient mediaFolders={mediaFolders} />
    </div>
  )
}
