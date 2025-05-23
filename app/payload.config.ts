import { buildConfig } from "payload/config"
import path from "path"

// Define collections
const Users = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
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
      options: [
        {
          label: "Admin",
          value: "admin",
        },
        {
          label: "Editor",
          value: "editor",
        },
      ],
    },
  ],
}

const Media = {
  slug: "media",
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
}

const Posts = {
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
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "users",
    },
    {
      name: "publishedDate",
      type: "date",
    },
    {
      name: "featuredImage",
      type: "upload",
      relationTo: "media",
    },
  ],
}

// Build and export the config
const config = buildConfig({
  serverURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  admin: {
    user: Users.slug,
  },
  collections: [Users, Media, Posts],
  typescript: {
    outputFile: path.resolve(__dirname, "../payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "../generated-schema.graphql"),
  },
  db: {
    type: "postgres",
    url: process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || "",
  },
  secret: process.env.PAYLOAD_SECRET || "your-secret-key",
})

export default config
