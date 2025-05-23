import type { CollectionConfig } from "payload/types"

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "excerpt",
      type: "textarea",
    },
    {
      name: "content",
      type: "richText",
    },
    {
      name: "featuredImage",
      type: "relationship",
      relationTo: "media",
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "publishedDate",
      type: "date",
    },
    {
      name: "status",
      type: "select",
      options: [
        {
          label: "Draft",
          value: "draft",
        },
        {
          label: "Published",
          value: "published",
        },
      ],
      defaultValue: "draft",
      required: true,
    },
  ],
}
