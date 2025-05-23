import type { CollectionConfig } from "payload/types"
import path from "path"
import { put } from "@vercel/blob"

const Media: CollectionConfig = {
  slug: "media",
  upload: {
    staticDir: path.resolve(__dirname, "../../../public/media"),
    // Use Vercel Blob for file storage
    handlers: {
      upload: async ({ file, data }) => {
        // Only proceed if we have a file
        if (!file || !file.buffer) return

        try {
          // Upload to Vercel Blob
          const filename = `${Date.now()}-${file.filename}`
          const { url } = await put(filename, file.buffer, {
            access: "public",
            contentType: file.mimetype,
          })

          // Return the URL to be saved in the database
          return {
            filename,
            url,
          }
        } catch (error) {
          console.error("Error uploading to Vercel Blob:", error)
          throw error
        }
      },
    },
  },
  access: {
    read: () => true,
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
