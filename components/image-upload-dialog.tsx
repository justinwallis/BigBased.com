"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Upload, X } from "lucide-react"

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
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      return `File size exceeds the ${maxSizeMB}MB limit`
    }

    // Validate file type
    if (!acceptedTypes.split(",").includes(file.type)) {
      return "Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image."
    }

    return null
  }

  const processFile = (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    processFile(file)
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    const file = files[0]

    if (file) {
      processFile(file)
    }
  }, [])

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setError(null)

    try {
      await onUpload(selectedFile)
      // Don't close here - let the parent component handle success
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
    setIsDragOver(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClose = () => {
    resetDialog()
    onClose()
  }

  const removeFile = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">{title}</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {previewUrl ? (
            <div className="relative">
              <div
                className={`w-full ${
                  imageType === "banner" ? "h-48" : "h-64"
                } rounded-md overflow-hidden border border-gray-200 dark:border-gray-700`}
              >
                <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={removeFile}
              >
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          ) : (
            <div
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md p-8 transition-colors cursor-pointer ${
                isDragOver
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                  : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                Drag and drop your image here, or click to select
              </p>
              <div className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer transition-colors">
                Select Image
              </div>
              <Input
                ref={fileInputRef}
                type="file"
                accept={acceptedTypes}
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                {imageType === "avatar" ? "JPEG, PNG, WebP, or GIF (max 5MB)" : "JPEG, PNG, WebP, or GIF (max 10MB)"}
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
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
