import { buildConfig } from "payload"
import { postgresAdapter } from "@payloadcms/db-postgres"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob"
import path from "path"

// Import collections
import { Users } from "./collections/Users"
import { Pages } from "./collections/Pages"
import { Posts } from "./collections/Posts"
import { Media } from "./collections/Media"

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"

export default buildConfig({
  admin: {
    user: "users",
    meta: {
      titleSuffix: "- Big Based CMS",
      favicon: "/favicon.ico",
      ogImage: "/og-image.png",
    },
  },
  collections: [Users, Pages, Posts, Media],
  editor: lexicalEditor({}),
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || process.env.NEON_NEON_DATABASE_URL || "",
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    },
  }),
  storage: {
    media: vercelBlobStorage({
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
    }),
  },
  cors: [serverURL, "https://bigbased.com", "https://*.bigbased.com"],
  csrf: [serverURL, "https://bigbased.com", "https://*.bigbased.com"],
})
