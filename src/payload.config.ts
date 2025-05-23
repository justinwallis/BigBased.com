import { buildConfig } from "payload/config"
import { postgresAdapter } from "@payloadcms/db-postgres"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob"
import path from "path"

// Import collections
import { Users } from "./collections/Users"
import { Media } from "./collections/Media"
import { Pages } from "./collections/Pages"
import { Posts } from "./collections/Posts"

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || "a-very-secret-key",
  admin: {
    user: "users",
    importMap: {
      baseDir: path.resolve(process.cwd()),
    },
  },
  collections: [Users, Media, Pages, Posts],
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  plugins: [
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN!,
    }),
  ],
  typescript: {
    outputFile: path.resolve(process.cwd(), "src/payload-types.ts"),
  },
})
