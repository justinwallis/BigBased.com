import type { CollectionConfig } from "payload/types"

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "filename",
  },
  access: {
    read: () => true,
  },
  upload: {
    staticURL: "/media",
    staticDir: "media",
    mimeTypes: ["image/*", "application/pdf", "video/*"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      admin: {
        description: "Alternative text for accessibility",
      },
    },
    {
      name: "caption",
      type: "text",
    },
  ],
}
