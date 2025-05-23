import type { CollectionConfig } from "payload/types"

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "author", "category", "status", "createdAt"],
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
        description: 'URL path for this post (e.g., "my-first-post")',
      },
    },
    {
      name: "content",
      type: "richText",
      required: true,
    },
    {
      name: "excerpt",
      type: "textarea",
      admin: {
        description: "Brief description for previews and SEO",
      },
    },
    {
      name: "featuredImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "category",
      type: "select",
      options: [
        { label: "News", value: "news" },
        { label: "Analysis", value: "analysis" },
        { label: "Opinion", value: "opinion" },
        { label: "Culture", value: "culture" },
        { label: "Technology", value: "technology" },
        { label: "Faith", value: "faith" },
        { label: "Politics", value: "politics" },
      ],
      required: true,
    },
    {
      name: "tags",
      type: "text",
      admin: {
        description: "Comma-separated tags",
      },
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
    {
      name: "publishedAt",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "seo",
      type: "group",
      fields: [
        {
          name: "title",
          type: "text",
          admin: {
            description: "SEO title (leave blank to use post title)",
          },
        },
        {
          name: "description",
          type: "textarea",
          admin: {
            description: "SEO meta description",
          },
        },
        {
          name: "keywords",
          type: "text",
          admin: {
            description: "Comma-separated keywords",
          },
        },
      ],
    },
  ],
}
