import { buildConfig } from "payload/config"
import { postgresAdapter } from "@payloadcms/db-postgres"
import { slateEditor } from "@payloadcms/richtext-slate"

// Simple Pages collection
const Pages = {
  slug: "pages",
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
    },
    {
      name: "content",
      type: "richText",
    },
    {
      name: "status",
      type: "select",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
      defaultValue: "draft",
    },
  ],
}

// Users collection for CMS access
const Users = {
  slug: "users",
  auth: true,
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "role",
      type: "select",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
      defaultValue: "editor",
    },
  ],
}

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
  admin: {
    disable: true, // This is key - disable the admin UI completely
  },
  editor: slateEditor({}),
  collections: [Users, Pages],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  secret: process.env.PAYLOAD_SECRET || "your-secret-here",
})
