import type { CollectionConfig } from "payload/types"

const Media: CollectionConfig = {
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
    disableLocalStorage: true,
    mimeTypes: ["image/png", "image/jpeg", "image/gif", "image/svg+xml", "image/webp"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
    },
    {
      name: "caption",
      type: "text",
    },
  ],
}

export default Media
