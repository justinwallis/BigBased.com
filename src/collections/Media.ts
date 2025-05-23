import type { CollectionConfig } from "payload/types"

export const Media: CollectionConfig = {
  slug: "media",
  upload: {
    staticURL: "/media",
    staticDir: "media",
    mimeTypes: ["image/*", "video/*", "audio/*", "application/pdf"],
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
