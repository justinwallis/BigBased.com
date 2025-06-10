"use client"

import { NodeViewWrapper, NodeViewContent } from "@tiptap/react"
import { Resizable } from "re-resizable"
import { useState } from "react"

interface ResizableImageComponentProps {
  node: {
    attrs: {
      src: string
      alt?: string
      title?: string
      width?: string
      height?: string
      float?: "left" | "right" | "none"
      display?: "block" | "inline"
    }
  }
  updateAttributes: (attrs: Record<string, any>) => void
  selected: boolean
}

export default function ResizableImageComponent({ node, updateAttributes, selected }: ResizableImageComponentProps) {
  const { src, alt, title, width, height, float, display } = node.attrs
  const [isResizing, setIsResizing] = useState(false)

  const handleResizeStart = () => {
    setIsResizing(true)
  }

  const handleResizeStop = (e: any, direction: any, ref: HTMLElement, d: { width: number; height: number }) => {
    setIsResizing(false)
    updateAttributes({
      width: ref.style.width,
      height: ref.style.height,
    })
  }

  return (
    <NodeViewWrapper className={`relative ${selected ? "ring-2 ring-blue-500" : ""}`}>
      <Resizable
        size={{ width: width || "100%", height: height || "auto" }}
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
        lockAspectRatio={true}
        className={`inline-block ${float === "left" ? "float-left mr-4" : ""} ${
          float === "right" ? "float-right ml-4" : ""
        } ${display === "block" ? "block mx-auto" : ""}`}
        style={{
          display: display || "inline-block",
        }}
      >
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          title={title}
          className={`block max-w-full h-auto ${isResizing ? "pointer-events-none" : ""}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </Resizable>
      <NodeViewContent className="hidden" /> {/* This is important for Tiptap to manage content */}
    </NodeViewWrapper>
  )
}
