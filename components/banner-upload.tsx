"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { uploadImageClient, deleteImageClient } from "@/lib/upload-client"
import { Upload, Trash2, Loader2, ImageIcon } from "lucide-react"

interface BannerUploadProps {
  currentBannerUrl: string
  onBannerChange: (newUrl: string) => void
}

export function BannerUpload({ currentBannerUrl, onBannerChange }: BannerUploadProps) {
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
      const result = await uploadImageClient(file, "banner")

      if (result.success && result.url) {
        onBannerChange(result.url)
      } else {
        setUploadError(result.error || "Failed to upload banner")
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

  const handleDeleteBanner = async () => {
    if (!currentBannerUrl) {
      return
    }

    setIsDeleting(true)
    setUploadError("")

    try {
      const result = await deleteImageClient(currentBannerUrl)

      if (result.success) {
        // Clear the banner
        onBannerChange("")
      } else {
        setUploadError(result.error || "Failed to delete banner")
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

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium flex items-center space-x-2">
        <ImageIcon className="h-4 w-4" />
        <span>Profile Banner</span>
      </Label>

      {/* Banner Preview */}
      <div className="relative">
        <div
          className="h-32 w-full rounded-lg border-2 border-dashed border-gray-300 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden"
          style={{
            backgroundImage: currentBannerUrl ? `url(${currentBannerUrl})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {!currentBannerUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-70" />
                <p className="text-sm opacity-70">No banner uploaded</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      </div>

      {/* Upload Controls */}
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
              Upload Banner
            </>
          )}
        </Button>

        {currentBannerUrl && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDeleteBanner}
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

      <p className="text-xs text-muted-foreground">
        Upload a JPEG, PNG, WebP, or GIF image (max 10MB). Recommended size: 1200x400px
      </p>

      {uploadError && (
        <div className="p-3 rounded-md text-sm bg-red-50 text-red-700 border border-red-200">{uploadError}</div>
      )}
    </div>
  )
}
