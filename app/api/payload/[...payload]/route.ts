import { type NextRequest, NextResponse } from "next/server"
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

// Create a proper Payload Express app
import express from "express"
import payload from "payload"

// Initialize Payload
let payloadInitialized = false

// Handle all Payload requests
export async function GET(req: NextRequest) {
  return handlePayloadRequest(req)
}

export async function POST(req: NextRequest) {
  return handlePayloadRequest(req)
}

export async function PUT(req: NextRequest) {
  return handlePayloadRequest(req)
}

export async function PATCH(req: NextRequest) {
  return handlePayloadRequest(req)
}

export async function DELETE(req: NextRequest) {
  return handlePayloadRequest(req)
}

// Simple handler that initializes Payload directly
async function handlePayloadRequest(req: NextRequest) {
  try {
    // Initialize Payload if not already initialized
    if (!payloadInitialized) {
      await payload.init({
        config: payloadConfig,
        secret: process.env.PAYLOAD_SECRET || "",
        express: express(),
        onInit: () => {
          payloadInitialized = true
          console.log("Payload initialized successfully")
        },
      })
    }

    // Get the path from the request
    const url = new URL(req.url)
    const path = url.pathname.replace("/api/payload", "")

    // Log the request for debugging
    console.log(`Payload request: ${req.method} ${path}`)

    // Convert the Next.js request to an Express-compatible format
    const expressReq = {
      method: req.method,
      url: path,
      headers: Object.fromEntries(req.headers),
      body: req.body ? await req.json() : undefined,
      query: Object.fromEntries(url.searchParams),
    }

    // Process the request through Payload
    let result
    try {
      if (path.startsWith("/admin")) {
        // For admin routes, use the admin API
        result = await payload.admin.getAdminUI()
        return new NextResponse(result, {
          status: 200,
          headers: {
            "Content-Type": "text/html",
          },
        })
      } else if (path.startsWith("/api")) {
        // For API routes, use the appropriate collection
        const collection = path.split("/")[2]
        if (collection) {
          result = await payload.find({
            collection,
          })
          return NextResponse.json(result)
        }
      }

      // Default response
      return NextResponse.json({ message: "Payload CMS API" })
    } catch (error) {
      console.error("Error processing Payload request:", error)
      return NextResponse.json({ error: "Error processing request" }, { status: 500 })
    }
  } catch (error) {
    console.error("Payload initialization error:", error)
    return NextResponse.json({ error: "Payload initialization failed" }, { status: 500 })
  }
}
