import { buildConfig } from "payload/config"
import path from "path"
import Users from "./collections/Users"
import Media from "./collections/Media"
import Posts from "./collections/Posts"

const config = buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
  admin: {
    user: Users.slug,
  },
  collections: [Users, Media, Posts],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
  db: {
    type: "postgres",
    url: process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || "",
  },
  secret: process.env.PAYLOAD_SECRET || "",
})

export default config
