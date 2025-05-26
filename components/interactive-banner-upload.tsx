"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { uploadImageClient, deleteImageClient } from "@/lib/upload-client"
import { Upload, Trash2, Loader2, ImageIcon, MoveUp, MoveDown, RotateCcw } from "lucide-react"

interface InteractiveBannerUploadProps {
  currentBannerUrl: string
  onBannerChange: (newUrl: string) => void
  bannerPosition?: string
  onPositionChange?: (position: string) => void
  className?: string
}

export function InteractiveBannerUpload({
  currentBannerUrl,
  onBannerChange,
  bannerPosition = "center",
  onPositionChange,
  className = "h-32 md:h-48",
}: InteractiveBannerUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [isHovered, setIsHovered] = useState(false)
  const [showPositionControls, setShowPositionControls] = useState(false)
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
        setShowPositionControls(true)
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
        onBannerChange("")
        setShowPositionControls(false)
        if (onPositionChange) {
          onPositionChange("center")
        }
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

  const adjustPosition = (direction: "up" | "down" | "reset") => {
    if (!onPositionChange) return

    let newPosition = bannerPosition

    switch (direction) {
      case "up":
        if (bannerPosition === "bottom") newPosition = "center"
        else if (bannerPosition === "center") newPosition = "top"
        break
      case "down":
        if (bannerPosition === "top") newPosition = "center"
        else if (bannerPosition === "center") newPosition = "bottom"
        break
      case "reset":
        newPosition = "center"
        break
    }

    onPositionChange(newPosition)
  }

  const getPositionValue = () => {
    switch (bannerPosition) {
      case "top":
        return "top"
      case "bottom":
        return "bottom"
      case "center":
      default:
        return "center"
    }
  }

  return (
    <div className="relative">
      <div
        className={`${className} bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden cursor-pointer transition-all duration-200 ${
          isHovered ? "ring-2 ring-blue-400 ring-opacity-50" : ""
        }`}
        style={{
          backgroundImage: currentBannerUrl ? `url(${currentBannerUrl})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: getPositionValue(),
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={!currentBannerUrl ? triggerFileSelect : undefined}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Upload Area - Show when no banner */}
        {!currentBannerUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="bg-black/30 rounded-lg p-6 backdrop-blur-sm">
                {isUploading ? (
                  <>
                    <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin" />
                    <p className="text-sm">Uploading banner...</p>
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm font-medium mb-1">Click to upload banner</p>
                    <p className="text-xs opacity-80">JPEG, PNG, WebP, or GIF (max 10MB)</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Controls - Show on hover when banner exists */}
        {currentBannerUrl && (isHovered || showPositionControls) && (
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={triggerFileSelect}
              disabled={isUploading || isDeleting}
              className="bg-black/50 hover:bg-black/70 text-white border-white/20"
            >
              <Upload className="h-3 w-3 mr-1" />
              Change
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={handleDeleteBanner}
              disabled={isUploading || isDeleting}
              className="bg-black/50 hover:bg-black/70 text-white border-white/20"
            >
              {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
            </Button>
          </div>
        )}

        {/* Position Controls - Show when banner exists */}
        {currentBannerUrl && (isHovered || showPositionControls) && onPositionChange && (
          <div className="absolute bottom-4 right-4 flex space-x-1">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => adjustPosition("up")}
              disabled={bannerPosition === "top"}
              className="bg-black/50 hover:bg-black/70 text-white border-white/20 px-2"
              title="Move up"
            >
              <MoveUp className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => adjustPosition("reset")}
              className="bg-black/50 hover:bg-black/70 text-white border-white/20 px-2"
              title="Center"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => adjustPosition("down")}
              disabled={bannerPosition === "bottom"}
              className="bg-black/50 hover:bg-black/70 text-white border-white/20 px-2"
              title="Move down"
            >
              <MoveDown className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Position Indicator */}
        {currentBannerUrl && (isHovered || showPositionControls) && (
          <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
            Position: {bannerPosition}
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error message */}
      {uploadError && (
        <div className="mt-2 p-2 rounded text-sm bg-red-50 text-red-700 border border-red-200">{uploadError}</div>
      )}
    </div>
  )
}
