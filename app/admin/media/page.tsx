"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { ImageIcon, Plus, Trash } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type Media = {
  id: string
  filename: string
  original_name: string
  mime_type: string
  size: number
  url: string
  alt_text: string | null
  created_at: string
}

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("media").select("*").order("created_at", { ascending: false })

      if (error) throw error

      setMedia(data || [])
    } catch (err) {
      console.error("Error fetching media:", err)
      setError("Failed to load media")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMedia = async (id: string, filename: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage.from("media").remove([filename])

      if (storageError) throw storageError

      // Delete from database
      const { error: dbError } = await supabase.from("media").delete().eq("id", id)

      if (dbError) throw dbError

      setMedia(media.filter((item) => item.id !== id))
    } catch (err) {
      console.error("Error deleting media:", err)
      setError(err instanceof Error ? err.message : "An error occurred while deleting the media")
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading media...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Media Library</h1>
        <Button asChild>
          <Link href="/admin/media/upload">
            <Plus className="h-4 w-4 mr-2" />
            Upload Media
          </Link>
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {media.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <ImageIcon className="h-16 w-16 mx-auto text-gray-400" />
          <h2 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">No media found</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Upload your first image or file to get started.</p>
          <Button asChild className="mt-4">
            <Link href="/admin/media/upload">Upload Media</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {media.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                {item.mime_type.startsWith("image/") ? (
                  <img
                    src={item.url || "/placeholder.svg"}
                    alt={item.alt_text || item.original_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <div className="text-4xl mb-2">📄</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {item.original_name}
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.original_name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatFileSize(item.size)} • {item.mime_type}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    View
                  </a>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this file. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteMedia(item.id, item.filename)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
