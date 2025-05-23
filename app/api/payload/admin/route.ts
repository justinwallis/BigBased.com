import { type NextRequest, NextResponse } from "next/server"
import payload from "payload"
import { buildConfig } from "payload"
import { postgresAdapter } from "@payloadcms/db-postgres"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob"
import path from "path"

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

// Initialize Payload if it hasn't been initialized yet
const initPayload = async () => {
  // Check if payload is already initialized
  if (payload.initialized) return payload

  try {
    // Initialize payload with config
    await payload.init({
      config: payloadConfig,
      secret: process.env.PAYLOAD_SECRET || "",
      local: true,
      // This is needed for Vercel serverless environment
      express: null,
    })

    return payload
  } catch (error) {
    console.error("Error initializing Payload:", error)
    throw error
  }
}

// Handle admin panel requests
export async function GET(req: NextRequest) {
  try {
    // Initialize Payload
    const payloadInstance = await initPayload()

    // Serve the admin UI
    const adminHTML = await payloadInstance.admin.getAdminUI({
      req: {
        url: req.url,
        headers: Object.fromEntries(req.headers),
        method: req.method,
      },
    })

    // Return the admin UI
    return new NextResponse(adminHTML, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    })
  } catch (error) {
    console.error("Error serving admin UI:", error)
    return NextResponse.json(
      {
        error: "Failed to serve admin UI",
        details: error instanceof Error ? error.message : String(error),
        stack: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.stack : undefined) : undefined,
      },
      { status: 500 },
    )
  }
}

// Handle POST requests for admin actions
export async function POST(req: NextRequest) {
  try {
    // Initialize Payload
    const payloadInstance = await initPayload()

    // Handle admin POST requests
    const adminResponse = await payloadInstance.admin.handleRequest({
      req: {
        url: req.url,
        headers: Object.fromEntries(req.headers),
        method: req.method,
        body: await req.text(),
      },
    })

    return new NextResponse(adminResponse.body, {
      status: adminResponse.status,
      headers: adminResponse.headers,
    })
  } catch (error) {
    console.error("Error handling admin POST:", error)
    return NextResponse.json(
      {
        error: "Failed to handle admin request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
