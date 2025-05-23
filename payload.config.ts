import { buildConfig } from "payload"
import { postgresAdapter } from "@payloadcms/db-postgres"
import { slateEditor } from "@payloadcms/richtext-slate"
import path from "path"

export default buildConfig({
  admin: {
    user: "users",
  },
  collections: [
    {
      slug: "users",
      auth: true,
      access: {
        delete: () => false,
        update: ({ req: { user } }) => Boolean(user),
      },
      fields: [
        {
          name: "name",
          type: "text",
        },
        {
          name: "roles",
          type: "select",
          hasMany: true,
          defaultValue: ["user"],
          options: [
            {
              label: "Admin",
              value: "admin",
            },
            {
              label: "User",
              value: "user",
            },
          ],
        },
      ],
    },
    {
      slug: "pages",
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
          name: "content",
          type: "richText",
          editor: slateEditor({}),
        },
        {
          name: "published",
          type: "checkbox",
          defaultValue: false,
        },
      ],
    },
    {
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
          name: "content",
          type: "richText",
          editor: slateEditor({}),
        },
        {
          name: "excerpt",
          type: "textarea",
        },
        {
          name: "featuredImage",
          type: "upload",
          relationTo: "media",
        },
        {
          name: "categories",
          type: "relationship",
          relationTo: "categories",
          hasMany: true,
        },
        {
          name: "published",
          type: "checkbox",
          defaultValue: false,
        },
        {
          name: "publishedDate",
          type: "date",
        },
      ],
    },
    {
      slug: "categories",
      admin: {
        useAsTitle: "name",
      },
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
        },
        {
          name: "slug",
          type: "text",
          required: true,
          unique: true,
        },
      ],
    },
    {
      slug: "media",
      upload: {
        staticURL: "/media",
        staticDir: "media",
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
        ],
        adminThumbnail: "thumbnail",
        mimeTypes: ["image/*"],
      },
      fields: [
        {
          name: "alt",
          type: "text",
        },
      ],
    },
  ],
  editor: slateEditor({}),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    },
  }),
})
