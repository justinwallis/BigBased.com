import type { CollectionConfig } from "payload/types"

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  upload: {
    staticURL: "/media",
    staticDir: "public/media",
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
      },
      {
        name: "hero",
        width: 1920,
        height: 1080,
        position: "centre",
      },
    ],
    mimeTypes: ["image/png", "image/jpeg", "image/gif", "image/svg+xml", "image/webp"],
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
