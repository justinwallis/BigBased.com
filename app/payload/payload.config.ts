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

const serverURL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(process.cwd()),
    },
    meta: {
      titleSuffix: "- Big Based CMS",
      favicon: "/favicon.ico",
      ogImage: "/og-image.png",
    },
  },
  collections: [Users, Pages, Posts, Media],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(process.cwd(), "types/payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || "",
    },
  }),
  plugins: [
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
    }),
  ],
  cors: [process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000", "https://bigbased.com", "https://*.bigbased.com"],
  csrf: [process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000", "https://bigbased.com", "https://*.bigbased.com"],
})
