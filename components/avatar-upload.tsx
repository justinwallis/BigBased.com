"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { uploadImageClient, deleteImageClient } from "@/lib/upload-client"
import { Upload, Trash2, Loader2 } from "lucide-react"

interface AvatarUploadProps {
  currentAvatarUrl: string
  onAvatarChange: (newUrl: string) => void
  userInitials: string
  className?: string
}

export function AvatarUpload({ currentAvatarUrl, onAvatarChange, userInitials, className }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadError("")

    try {
      const result = await uploadImageClient(file, "avatar")

      if (result.success && result.url) {
        onAvatarChange(result.url)
      } else {
        setUploadError(result.error || "Failed to upload avatar")
      }
    } catch (error) {
      setUploadError("An unexpected error occurred")
      console.error("Upload error:", error)
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDeleteAvatar = async () => {
    if (!currentAvatarUrl || currentAvatarUrl.includes("dicebear.com")) {
      // Can't delete default avatars
      return
    }

    setIsDeleting(true)
    setUploadError("")

    try {
      const result = await deleteImageClient(currentAvatarUrl)

      if (result.success) {
        // Set back to default avatar
        const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${userInitials}`
        onAvatarChange(defaultAvatar)
      } else {
        setUploadError(result.error || "Failed to delete avatar")
      }
    } catch (error) {
      setUploadError("An unexpected error occurred")
      console.error("Delete error:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const isDefaultAvatar = currentAvatarUrl.includes("dicebear.com") || !currentAvatarUrl

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Avatar className={className || "h-24 w-24"}>
          <AvatarImage src={currentAvatarUrl || "/placeholder.svg"} alt="Profile picture" />
          <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
        </Avatar>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Profile Picture</Label>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={triggerFileSelect}
              disabled={isUploading || isDeleting}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </>
              )}
            </Button>

            {!isDefaultAvatar && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDeleteAvatar}
                disabled={isUploading || isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </>
                )}
              </Button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            className="hidden"
          />

          <p className="text-xs text-muted-foreground">Upload a JPEG, PNG, WebP, or GIF image (max 5MB)</p>
        </div>
      </div>

      {uploadError && (
        <div className="p-3 rounded-md text-sm bg-red-50 text-red-700 border border-red-200">{uploadError}</div>
      )}
    </div>
  )
}
