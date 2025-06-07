import { buildConfig } from "payload/config"
import path from "path"
import { webpackBundler } from "@payloadcms/bundler-webpack"
import { postgresAdapter } from "@payloadcms/db-postgres"
import { slateEditor } from "@payloadcms/richtext-slate"
import { payloadCloud } from "@payloadcms/plugin-cloud"
import { blobStoragePlugin } from "@payloadcms/plugin-cloud-storage"
import { vercelBlobAdapter } from "@payloadcms/plugin-cloud-storage/vercel"

// Collections
import Pages from "./collections/Pages"
import Media from "./collections/Media"

export default buildConfig({
  admin: {
    user: "users",
    bundler: webpackBundler(),
    // Route admin to /cms-admin instead of /admin
    root: "/cms-admin",
    meta: {
      titleSuffix: "- Big Based CMS",
      favicon: "/favicon.ico",
      ogImage: "/og-image.png",
    },
  },
  editor: slateEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  collections: [
    Pages,
    Media,
    // We'll add more collections in Phase 2
  ],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
  plugins: [
    payloadCloud(),
    blobStoragePlugin({
      adapter: vercelBlobAdapter({
        token: process.env.BLOB_READ_WRITE_TOKEN,
      }),
      enabled: true,
    }),
  ],
})
