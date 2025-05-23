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

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
  admin: {
    user: "users",
  },
  editor: lexicalEditor({}),
  collections: [Users, Media, Pages, Posts],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
  plugins: [
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: {
          generateFileURL: ({ filename }) => {
            return `https://vercel-blob-storage.vercel.app/${filename}`
          },
        },
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
    }),
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
  }),
  secret: process.env.PAYLOAD_SECRET || "a-very-secret-key",
})
