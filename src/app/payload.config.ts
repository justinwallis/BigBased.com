import { buildConfig } from "payload/config"
import { postgresAdapter } from "@payloadcms/db-postgres"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob"
import path from "path"

// Import collections
import Users from "./collections/Users"
import Media from "./collections/Media"
import Pages from "./collections/Pages"
import Posts from "./collections/Posts"

// Create and export the config
const configPromise = buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
  admin: {
    user: "users",
    bundler: {
      enabled: false,
    },
  },
  editor: lexicalEditor({}),
  collections: [Users, Media, Pages, Posts],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  storage: {
    vercelBlob: vercelBlobStorage({
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  },
})

export default configPromise
