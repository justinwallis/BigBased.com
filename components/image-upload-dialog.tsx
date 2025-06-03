"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload } from "lucide-react"

interface ImageUploadDialogProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (file: File) => Promise<void>
  title: string
  description: string
  imageType: "avatar" | "banner"
  acceptedTypes?: string
  maxSizeMB?: number
}

export function ImageUploadDialog({
  isOpen,
  onClose,
  onUpload,
  title,
  description,
  imageType,
  acceptedTypes = "image/jpeg,image/png,image/webp,image/gif",
  maxSizeMB = 5,
}: ImageUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds the ${maxSizeMB}MB limit`)
      return
    }

    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      setError("Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.")
      return
    }

    setError(null)
    setSelectedFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setError(null)

    try {
      await onUpload(selectedFile)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const resetDialog = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClose = () => {
    resetDialog()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {previewUrl ? (
            <div className="relative">
              <div
                className={`w-full ${
                  imageType === "banner" ? "h-48" : "h-64"
                } rounded-md overflow-hidden border border-gray-200 dark:border-gray-700`}
              >
                <img
                  src={previewUrl || "/placeholder.svg"}
                  alt="Preview"
                  className={`w-full h-full ${imageType === "avatar" ? "object-cover" : "object-cover"}`}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  setSelectedFile(null)
                  setPreviewUrl(null)
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                  }
                }}
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-8">
              <Upload className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Drag and drop your image here, or click to select
              </p>
              <Label
                htmlFor="image-upload"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md cursor-pointer"
              >
                Select Image
              </Label>
              <Input
                ref={fileInputRef}
                id="image-upload"
                type="file"
                accept={acceptedTypes}
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {imageType === "avatar" ? "JPEG, PNG, WebP, or GIF (max 5MB)" : "JPEG, PNG, WebP, or GIF (max 10MB)"}
              </p>
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!selectedFile || isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
