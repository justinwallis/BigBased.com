"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  Folder,
  FolderPlus,
  Grid,
  List,
  MoreHorizontal,
  FileText,
  ImageIcon,
  Film,
  File,
  Download,
  Trash2,
  Edit,
  Eye,
} from "lucide-react"
import type { MediaFile } from "@/app/actions/cms-actions"

interface MediaFolder {
  id: string
  name: string
  path: string
  parent_id: string | null
  created_at: string
}

interface MediaLibraryClientProps {
  initialMediaFiles: MediaFile[]
  initialMediaFolders: MediaFolder[]
  currentFolderId?: string
}

export default function MediaLibraryClient({
  initialMediaFiles,
  initialMediaFolders,
  currentFolderId,
}: MediaLibraryClientProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(initialMediaFiles)
  const [mediaFolders, setMediaFolders] = useState<MediaFolder[]>(initialMediaFolders)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const { toast } = useToast()
  const router = useRouter()

  // Filter media files and folders based on search
  const filteredFolders = mediaFolders.filter((folder) => folder.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredFiles = mediaFiles.filter(
    (file) =>
      file.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.original_filename.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get file icon based on mime type
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return <ImageIcon className="h-6 w-6" />
    } else if (mimeType.startsWith("video/")) {
      return <Film className="h-6 w-6" />
    } else if (mimeType.startsWith("text/")) {
      return <FileText className="h-6 w-6" />
    } else {
      return <File className="h-6 w-6" />
    }
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB"
    else return (bytes / 1073741824).toFixed(1) + " GB"
  }

  // Handle folder creation
  const handleCreateFolder = () => {
    const folderName = prompt("Enter folder name:")
    if (!folderName) return

    // TODO: Implement folder creation
    toast({
      title: "Coming Soon",
      description: "Folder creation will be available soon",
    })
  }

  // Handle file deletion
  const handleDeleteFile = (id: string, filename: string) => {
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) {
      return
    }

    // TODO: Implement file deletion
    toast({
      title: "Coming Soon",
      description: "File deletion will be available soon",
    })
  }

  // Render empty state
  if (filteredFolders.length === 0 && filteredFiles.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          {searchQuery ? (
            <>
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Results Found</h3>
              <p className="text-muted-foreground text-center mb-4">No files or folders match your search query</p>
              <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
            </>
          ) : (
            <>
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Media Files</h3>
              <p className="text-muted-foreground text-center mb-4">
                Upload your first file or create a folder to organize your media
              </p>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/admin/cms/media/upload">Upload Files</Link>
                </Button>
                <Button variant="outline" onClick={handleCreateFolder}>
                  Create Folder
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search media..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCreateFolder}>
            <FolderPlus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Breadcrumb navigation will go here */}

      {/* Media content */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Folders */}
          {filteredFolders.map((folder) => (
            <Link key={folder.id} href={`/admin/cms/media?folder=${folder.id}`} className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 flex flex-col items-center">
                  <Folder className="h-16 w-16 text-amber-500 my-2" />
                  <p className="text-center font-medium truncate w-full">{folder.name}</p>
                </CardContent>
              </Card>
            </Link>
          ))}

          {/* Files */}
          {filteredFiles.map((file) => (
            <Card key={file.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex flex-col items-center">
                {file.mime_type.startsWith("image/") ? (
                  <div className="relative h-24 w-full mb-2">
                    <Image
                      src={file.file_path || "/placeholder.svg"}
                      alt={file.alt_text || file.original_filename}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-24 w-full flex items-center justify-center mb-2">{getFileIcon(file.mime_type)}</div>
                )}
                <div className="w-full">
                  <p className="font-medium truncate">{file.original_filename}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.file_size)}</p>
                </div>
                <div className="mt-2 w-full flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={file.file_path} target="_blank">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href={file.file_path} download={file.original_filename}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteFile(file.id, file.original_filename)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {/* Folders */}
          {filteredFolders.map((folder) => (
            <Link key={folder.id} href={`/admin/cms/media?folder=${folder.id}`} className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Folder className="h-6 w-6 text-amber-500 mr-3" />
                    <div>
                      <p className="font-medium">{folder.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Created {new Date(folder.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {/* Files */}
          {filteredFiles.map((file) => (
            <Card key={file.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  {file.mime_type.startsWith("image/") ? (
                    <div className="relative h-10 w-10 mr-3">
                      <Image
                        src={file.file_path || "/placeholder.svg"}
                        alt={file.alt_text || file.original_filename}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="mr-3">{getFileIcon(file.mime_type)}</div>
                  )}
                  <div>
                    <p className="font-medium">{file.original_filename}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.file_size)} •{new Date(file.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={file.file_path} target="_blank">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <a href={file.file_path} download={file.original_filename}>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteFile(file.id, file.original_filename)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
