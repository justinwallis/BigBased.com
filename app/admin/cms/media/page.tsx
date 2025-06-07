import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Upload } from "lucide-react"
import { getMediaFiles, getMediaFolders } from "@/app/actions/cms-actions"
import MediaLibraryClient from "./media-library-client"

export default async function MediaLibraryPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const folderId = searchParams.folder as string | undefined

  const [mediaFilesResult, mediaFoldersResult] = await Promise.all([getMediaFiles(folderId), getMediaFolders(folderId)])

  const mediaFiles = mediaFilesResult.success ? mediaFilesResult.data : []
  const mediaFolders = mediaFoldersResult.success ? mediaFoldersResult.data : []

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
            <h1 className="text-3xl font-bold text-foreground">Media Library</h1>
            <p className="text-muted-foreground">Manage your images, documents, and other media files</p>
          </div>
        </div>
        <Button asChild>
          <Link href="/admin/cms/media/upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Link>
        </Button>
      </div>

      <MediaLibraryClient
        initialMediaFiles={mediaFiles}
        initialMediaFolders={mediaFolders}
        currentFolderId={folderId}
      />
    </div>
  )
}
