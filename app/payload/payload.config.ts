import { buildConfig } from "payload/config"
import { postgresAdapter } from "@payloadcms/db-postgres"
import { slateEditor } from "@payloadcms/richtext-slate"
import { webpackBundler } from "@payloadcms/bundler-webpack"
import path from "path"

// Collections
import Users from "./collections/Users"
import Pages from "./collections/Pages"
import Media from "./collections/Media"
import Posts from "./collections/Posts"

const payloadConfig = () => {
  return buildConfig({
    serverURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    admin: {
      user: Users.slug,
      bundler: webpackBundler(),
    },
    editor: slateEditor({}),
    collections: [Users, Pages, Media, Posts],
    typescript: {
      outputFile: path.resolve(__dirname, "../payload-types.ts"),
    },
    db: postgresAdapter({
      pool: {
        connectionString: process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL || "",
      },
    }),
    csrf: [
      // Allow all origins
      "*",
    ],
    cors: "*",
  })
}

export default payloadConfig
