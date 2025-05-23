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
  cors: ["https://bigbased.com", "https://*.bigbased.com", "http://localhost:3000"],
  csrf: ["https://bigbased.com", "https://*.bigbased.com", "http://localhost:3000"],
})

// Simple handler that initializes Payload directly
async function handlePayloadRequest(req: NextRequest) {
  try {
    const payload = await getPayload({
      config: payloadConfig,
      secret: process.env.PAYLOAD_SECRET!,
    })

    // Handle different HTTP methods
    const method = req.method
    const url = new URL(req.url)
    const pathname = url.pathname.replace("/api/payload", "")

    // Basic routing for admin panel
    if (pathname.startsWith("/admin") || pathname === "/") {
      // Return a simple response for admin routes
      return new NextResponse("Payload Admin", {
        status: 200,
        headers: { "Content-Type": "text/html" },
      })
    }

    // Handle API routes
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ message: "Payload API endpoint" })
    }

    return NextResponse.json({ message: "Payload CMS" })
  } catch (error) {
    console.error("Payload handler error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  return handlePayloadRequest(req)
}

export async function POST(req: NextRequest) {
  return handlePayloadRequest(req)
}

export async function PATCH(req: NextRequest) {
  return handlePayloadRequest(req)
}

export async function PUT(req: NextRequest) {
  return handlePayloadRequest(req)
}

export async function DELETE(req: NextRequest) {
  return handlePayloadRequest(req)
}
