import type { CollectionConfig } from "payload/types"

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
  },
  access: {
    read: () => true,
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
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "users",
      required: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "category",
      type: "select",
      options: [
        {
          label: "Digital Sovereignty",
          value: "digital-sovereignty",
        },
        {
          label: "Cultural Decay",
          value: "cultural-decay",
        },
        {
          label: "Truth Archives",
          value: "truth-archives",
        },
        {
          label: "Parallel Economy",
          value: "parallel-economy",
        },
      ],
      required: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "featuredImage",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "content",
      type: "richText",
      required: true,
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
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "tags",
      type: "array",
      fields: [
        {
          name: "tag",
          type: "text",
        },
      ],
      admin: {
        position: "sidebar",
      },
    },
  ],
}
