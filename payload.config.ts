import { buildConfig } from "payload/config"
import { postgresAdapter } from "@payloadcms/db-postgres"
import { slateEditor } from "@payloadcms/richtext-slate"
import { webpackBundler } from "@payloadcms/bundler-webpack"
import { cloudStoragePlugin } from "@payloadcms/plugin-cloud-storage"
import { vercelBlobAdapter } from "@payloadcms/plugin-cloud-storage/vercel"
import path from "path"

// Import collections
import { Users } from "./collections/Users"
import { Pages } from "./collections/Pages"
import { Media } from "./collections/Media"
import { Posts } from "./collections/Posts"

const serverURL =
  process.env.PAYLOAD_PUBLIC_SERVER_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000"

export default buildConfig({
  serverURL,
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    meta: {
      titleSuffix: "- Big Based CMS",
      favicon: "/favicon.ico",
      ogImage: "/og-image.png",
    },
  },
  editor: slateEditor({}),
  collections: [Users, Pages, Media, Posts],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
  plugins: [
    cloudStoragePlugin({
      collections: {
        media: {
          adapter: vercelBlobAdapter({
            token: process.env.BLOB_READ_WRITE_TOKEN!,
          }),
        },
      },
    }),
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL!,
    },
  }),
  cors: [serverURL],
  csrf: [serverURL],
})
