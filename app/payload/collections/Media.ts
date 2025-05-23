import type { CollectionConfig } from "payload/types"
import type { PutBlobResult } from "@vercel/blob"
import path from "path"

const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  upload: {
    staticDir: path.resolve(__dirname, "../../public/media"),
    staticURL: "/media",
    disableLocalStorage: true,
    handlers: {
      upload: async ({ req, file, data }) => {
        try {
          // Use Vercel Blob for storage
          const filename = `${Date.now()}-${file.name}`
          const buffer = await file.data()

          const response = await fetch(`https://api.vercel.com/v1/blobs`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
              "Content-Type": file.mimetype,
              "X-Vercel-Filename": filename,
            },
            body: buffer,
          })

          const result = (await response.json()) as PutBlobResult

          // Return the URL to be saved to the database
          return {
            filename,
            filesize: file.size,
            mimeType: file.mimetype,
            url: result.url,
          }
        } catch (error) {
          console.error("Error uploading to Vercel Blob:", error)
          throw error
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
      name: "caption",
      type: "text",
    },
  ],
}

export default Media
