import type { CollectionConfig } from "payload/types"
import type { PutBlobResult } from "@vercel/blob"
import path from "path"

const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "filename",
  },
  upload: {
    staticURL: "/media",
    staticDir: "media",
    disableLocalStorage: true,
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/png", "image/jpeg", "image/gif", "image/svg+xml", "image/webp"],
    handlers: {
      upload: async ({ req, file, data }) => {
        const { put } = await import("@vercel/blob")

        if (!file.buffer) {
          throw new Error("No file buffer")
        }

        const filename = `${path.parse(file.filename).name}-${Date.now()}${path.extname(file.filename)}`

        try {
          const blob: PutBlobResult = await put(filename, file.buffer, {
            access: "public",
            contentType: file.mimeType,
          })

          return {
            filename,
            mimeType: file.mimeType,
            filesize: file.size,
            width: data.width,
            height: data.height,
            url: blob.url,
          }
        } catch (error) {
          console.error("Error uploading to Vercel Blob:", error)
          throw error
        }
      },
      afterRead: async ({ doc }) => {
        return {
          ...doc,
          url: doc.url,
        }
      },
    },
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
    {
      name: "url",
      type: "text",
      admin: {
        readOnly: true,
      },
    },
  ],
}

export default Media
