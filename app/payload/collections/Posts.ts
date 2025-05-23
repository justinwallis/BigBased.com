import type { CollectionConfig } from "payload/types"

const Posts: CollectionConfig = {
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
      name: "publishedDate",
      type: "date",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "category",
      type: "select",
      options: [
        {
          value: "technology",
          label: "Technology",
        },
        {
          value: "culture",
          label: "Culture",
        },
        {
          value: "politics",
          label: "Politics",
        },
        {
          value: "faith",
          label: "Faith",
        },
        {
          value: "economy",
          label: "Economy",
        },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "featuredImage",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Featured image for this post",
      },
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
          value: "draft",
          label: "Draft",
        },
        {
          value: "published",
          label: "Published",
        },
      ],
      defaultValue: "draft",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "meta",
      type: "group",
      fields: [
        {
          name: "description",
          type: "textarea",
        },
        {
          name: "keywords",
          type: "text",
        },
      ],
    },
  ],
}

export default Posts
