"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { ArrowLeft, Upload, Trash } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function UploadMediaPage() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<{ [key: string]: number }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const supabase = createClientComponentClient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files)
      setFiles(selectedFiles)
      // Initialize progress for each file
      const initialProgress: { [key: string]: number } = {}
      selectedFiles.forEach((file) => {
        initialProgress[file.name] = 0
      })
      setProgress(initialProgress)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files)
      setFiles(droppedFiles)
      // Initialize progress for each file
      const initialProgress: { [key: string]: number } = {}
      droppedFiles.forEach((file) => {
        initialProgress[file.name] = 0
      })
      setProgress(initialProgress)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("You must be logged in to upload files")
      }

      // Upload each file
      for (const file of files) {
        // Create a unique filename
        const timestamp = new Date().getTime()
        const fileExt = file.name.split(".").pop()
        const fileName = `${timestamp}-${file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[^a-z0-9]/gi, "-")
          .toLowerCase()}.${fileExt}`
        const filePath = `${fileName}`

        // Upload to storage
        const { data: uploadData, error: uploadError } = await supabase.storage.from("media").upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        })

        if (uploadError) throw uploadError

        // Get the public URL
        const { data: urlData } = supabase.storage.from("media").getPublicUrl(filePath)

        // Create a record in the media table
        const { error: dbError } = await supabase.from("media").insert({
          filename: filePath,
          original_name: file.name,
          mime_type: file.type,
          size: file.size,
          url: urlData.publicUrl,
          alt_text: file.name,
          created_by: user.id,
        })

        if (dbError) throw dbError

        // Update progress
        setProgress((prev) => ({ ...prev, [file.name]: 100 }))
      }

      // Redirect back to media library
      router.push("/admin/media")
      router.refresh()
    } catch (err) {
      console.error("Error uploading files:", err)
      setError(err instanceof Error ? err.message : "An error occurred while uploading files")
      setUploading(false)
    }
  }

  const removeFile = (fileName: string) => {
    setFiles(files.filter((file) => file.name !== fileName))
    setProgress((prev) => {
      const newProgress = { ...prev }
      delete newProgress[fileName]
      return newProgress
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" asChild className="mr-4">
          <Link href="/admin/media">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Media Library
          </Link>
        </Button>
        <h1 className="text-3xl font-semibold">Upload Media</h1>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
            disabled={uploading}
          />
          <Upload className="h-12 w-12 mx-auto text-gray-400" />
          <h2 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">
            {uploading ? "Uploading..." : "Drop files here or click to upload"}
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Support for images, documents, and other file types</p>
        </div>

        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Selected Files</h3>
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.name} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{file.type.startsWith("image/") ? "🖼️" : "📄"}</div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{file.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatFileSize(file.size)} • {file.type}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(file.name)
                      }}
                      disabled={uploading}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${progress[file.name] || 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button onClick={handleUpload} disabled={files.length === 0 || uploading}>
            {uploading ? "Uploading..." : "Upload Files"}
          </Button>
        </div>
      </div>
    </div>
  )
}
