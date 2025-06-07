"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Monitor, Smartphone, Tablet, RefreshCw, ExternalLink } from "lucide-react"
import type { ContentItem } from "@/app/actions/cms-actions"

interface LivePreviewClientProps {
  contentItem: ContentItem
}

const PREVIEW_SIZES = {
  desktop: { width: "100%", height: "100%", label: "Desktop" },
  tablet: { width: "768px", height: "1024px", label: "Tablet" },
  mobile: { width: "375px", height: "667px", label: "Mobile" },
}

export default function LivePreviewClient({ contentItem }: LivePreviewClientProps) {
  const [selectedSize, setSelectedSize] = useState<keyof typeof PREVIEW_SIZES>("desktop")
  const [isLoading, setIsLoading] = useState(true)
  const [previewUrl, setPreviewUrl] = useState("")
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // Generate preview URL based on content type and slug
    const baseUrl = window.location.origin
    const url = `${baseUrl}/preview/${contentItem.content_type_id}/${contentItem.slug}?preview=true&id=${contentItem.id}`
    setPreviewUrl(url)
  }, [contentItem])

  const handleRefresh = () => {
    if (iframeRef.current) {
      setIsLoading(true)
      iframeRef.current.src = previewUrl
    }
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const getSizeIcon = (size: keyof typeof PREVIEW_SIZES) => {
    switch (size) {
      case "desktop":
        return <Monitor className="h-4 w-4" />
      case "tablet":
        return <Tablet className="h-4 w-4" />
      case "mobile":
        return <Smartphone className="h-4 w-4" />
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-background p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/cms/content/${contentItem.id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Editor
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{contentItem.title}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant={contentItem.status === "published" ? "default" : "secondary"}>
                  {contentItem.status}
                </Badge>
                <span>•</span>
                <span>Live Preview</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Device Size Selector */}
            <Select
              value={selectedSize}
              onValueChange={(value) => setSelectedSize(value as keyof typeof PREVIEW_SIZES)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {getSizeIcon(selectedSize)}
                    {PREVIEW_SIZES[selectedSize].label}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PREVIEW_SIZES).map(([key, size]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      {getSizeIcon(key as keyof typeof PREVIEW_SIZES)}
                      {size.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>

            <Button variant="outline" size="sm" asChild>
              <Link href={previewUrl} target="_blank">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-gray-100 p-4 overflow-hidden">
        <div className="h-full flex items-center justify-center">
          <div
            className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300"
            style={{
              width: PREVIEW_SIZES[selectedSize].width,
              height: PREVIEW_SIZES[selectedSize].height,
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          >
            {isLoading && (
              <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">Loading preview...</p>
                </div>
              </div>
            )}

            <iframe
              ref={iframeRef}
              src={previewUrl}
              className="w-full h-full border-0"
              onLoad={handleIframeLoad}
              title={`Preview of ${contentItem.title}`}
            />
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="border-t bg-background p-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Viewing: {PREVIEW_SIZES[selectedSize].width} × {PREVIEW_SIZES[selectedSize].height}
          </span>
          <span>Last updated: {new Date(contentItem.updated_at).toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
