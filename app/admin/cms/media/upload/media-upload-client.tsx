"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Upload, X, File, ImageIcon, Film, FileText } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface MediaFolder {
  id: string
  name: string
  path: string
}

interface MediaUploadClientProps {
  mediaFolders: MediaFolder[]
}

interface FileWithPreview extends File {
  id: string
  preview?: string
  progress: number
  error?: string
  uploaded?: boolean
}

export default function MediaUploadClient({ mediaFolders }: MediaUploadClientProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [folderId, setFolderId] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const newFiles = Array.from(e.target.files).map((file) => ({
      ...file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }))

    setFiles((prev) => [...prev, ...newFiles])
  }

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()

    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return

    const newFiles = Array.from(e.dataTransfer.files).map((file) => ({
      ...file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }))

    setFiles((prev) => [...prev, ...newFiles])
  }

  // Remove file from list
  const removeFile = (id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id)
      if (file?.preview) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter((f) => f.id !== id)
    })
  }

  // Get file icon
  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-8 w-8" />
    if (type.startsWith("video/")) return <Film className="h-8 w-8" />
    if (type.startsWith("text/")) return <FileText className="h-8 w-8" />
    return <File className="h-8 w-8" />
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB"
    else return (bytes / 1073741824).toFixed(1) + " GB"
  }

  // Upload files
  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No Files",
        description: "Please select files to upload",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      for (const file of files) {
        if (file.uploaded) continue

        // Update progress
        setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, progress: 10 } : f)))

        // Create form data
        const formData = new FormData()
        formData.append("file", file)
        if (folderId) formData.append("folder_id", folderId)

        try {
          // Simulate upload progress
          for (let progress = 20; progress <= 90; progress += 20) {
            await new Promise((resolve) => setTimeout(resolve, 200))
            setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, progress } : f)))
          }

          // TODO: Replace with actual upload API call
          // const response = await fetch('/api/upload/media', {
          //   method: 'POST',
          //   body: formData,
          // })

          // if (!response.ok) {
          //   throw new Error('Upload failed')
          // }

          // Simulate successful upload
          await new Promise((resolve) => setTimeout(resolve, 500))

          setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, progress: 100, uploaded: true } : f)))
        } catch (error) {
          setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, error: "Upload failed" } : f)))
        }
      }

      toast({
        title: "Upload Complete",
        description: "Files uploaded successfully",
      })

      // Redirect back to media library after a delay
      setTimeout(() => {
        router.push("/admin/cms/media")
      }, 1000)
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "An error occurred during upload",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="folder">Destination Folder</Label>
              <Select value={folderId} onValueChange={setFolderId}>
                <SelectTrigger id="folder">
                  <SelectValue placeholder="Select folder (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="root">Root folder</SelectItem>
                  {mediaFolders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.path}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Drop Zone */}
      <Card>
        <CardContent className="pt-6">
          <div
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
          >
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Drop files here</h3>
            <p className="text-muted-foreground mb-4">or click to browse your computer</p>
            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              Browse Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
            />
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Files to Upload ({files.length})</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setFiles([])} disabled={isUploading}>
                  Clear All
                </Button>
                <Button onClick={handleUpload} disabled={isUploading || files.every((f) => f.uploaded)}>
                  {isUploading ? "Uploading..." : "Upload Files"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  {/* File Preview/Icon */}
                  <div className="flex-shrink-0">
                    {file.preview ? (
                      <img
                        src={file.preview || "/placeholder.svg"}
                        alt={file.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <div className="h-12 w-12 flex items-center justify-center bg-muted rounded">
                        {getFileIcon(file.type)}
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file.size)} • {file.type}
                    </p>

                    {/* Progress Bar */}
                    {file.progress > 0 && !file.uploaded && !file.error && (
                      <div className="mt-2">
                        <Progress value={file.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">{file.progress}% uploaded</p>
                      </div>
                    )}

                    {/* Success/Error States */}
                    {file.uploaded && <p className="text-sm text-green-600 mt-1">✓ Uploaded successfully</p>}
                    {file.error && <p className="text-sm text-red-600 mt-1">✗ {file.error}</p>}
                  </div>

                  {/* Remove Button */}
                  <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)} disabled={isUploading}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
