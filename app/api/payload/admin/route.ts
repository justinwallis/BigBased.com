import { type NextRequest, NextResponse } from "next/server"
import { getPayload } from "payload"
import { buildConfig } from "payload"
import { postgresAdapter } from "@payloadcms/db-postgres"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob"

// Import collections
import { Users } from "@/app/payload/collections/Users"
import { Pages } from "@/app/payload/collections/Pages"
import { Posts } from "@/app/payload/collections/Posts"
import { Media } from "@/app/payload/collections/Media"

// Modify the connection string to disable SSL verification
function getModifiedConnectionString() {
  const originalString = process.env.POSTGRES_URL || ""

  // If the string already has parameters, append the SSL mode
  if (originalString.includes("?")) {
    return `${originalString}&sslmode=no-verify`
  }

  // Otherwise add the parameter with a question mark
  return `${originalString}?sslmode=no-verify`
}

// Create the config inline to avoid import issues
const payloadConfig = buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: "- Big Based CMS",
      favicon: "/favicon.ico",
      ogImage: "/og-image.png",
    },
  },
  collections: [Users, Pages, Posts, Media],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || "insecure-secret-for-dev-only",
  db: postgresAdapter({
    pool: {
      connectionString: getModifiedConnectionString(),
      ssl: {
        rejectUnauthorized: false,
      },
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
  cors: ["https://bigbased.com", "https://*.bigbased.com", "http://localhost:3000"],
  csrf: ["https://bigbased.com", "https://*.bigbased.com", "http://localhost:3000"],
})

// Handle admin panel requests
export async function GET(req: NextRequest) {
  try {
    // Initialize Payload
    const payload = await getPayload({
      config: payloadConfig,
      secret: process.env.PAYLOAD_SECRET || "",
    })

    // Get the admin UI
    const adminUI = await payload.getAdminUI({
      req: {
        url: req.url,
        headers: Object.fromEntries(req.headers),
        method: req.method,
      },
    })

    // Return the admin UI
    return new NextResponse(adminUI, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    })
  } catch (error) {
    console.error("Error serving admin UI:", error)
    return NextResponse.json(
      { error: "Failed to serve admin UI", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
