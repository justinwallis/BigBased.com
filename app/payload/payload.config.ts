import { buildConfig } from "payload/config"
import { postgresAdapter } from "@payloadcms/db-postgres"
import { slateEditor } from "@payloadcms/richtext-slate"
import path from "path"
import { Users } from "./collections/Users"
import { Pages } from "./collections/Pages"
import { Media } from "./collections/Media"
import { Posts } from "./collections/Posts"

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  admin: {
    user: Users.slug,
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
  db: postgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL,
    },
  }),
  cors: [process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"],
  csrf: [process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"],
})
