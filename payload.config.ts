import { buildConfig } from "payload"
import { postgresAdapter } from "@payloadcms/db-postgres"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob"
import path from "path"

// Import collections
import { Users } from "./app/payload/collections/Users"
import { Pages } from "./app/payload/collections/Pages"
import { Posts } from "./app/payload/collections/Posts"
import { Media } from "./app/payload/collections/Media"

const serverURL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

// Create the config
const payloadConfig = buildConfig({
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
  secret: process.env.PAYLOAD_SECRET || "insecure-secret-for-dev-only",
  typescript: {
    outputFile: path.resolve(process.cwd(), "types/payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || "",
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
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
  cors: [serverURL, "https://bigbased.com", "https://*.bigbased.com"],
  csrf: [serverURL, "https://bigbased.com", "https://*.bigbased.com"],
  serverURL,
})

// Export all required formats
export default payloadConfig
export const config = payloadConfig
export { payloadConfig }
