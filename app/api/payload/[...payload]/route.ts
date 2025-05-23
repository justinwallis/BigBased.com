import { type NextRequest, NextResponse } from "next/server"
import { buildConfig } from "payload"
import { postgresAdapter } from "@payloadcms/db-postgres"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob"
import payload from "payload"
import express from "express"

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

// Initialize Payload if not already initialized
let payloadInitialized = false

async function initializePayload() {
  if (payloadInitialized) return

  try {
    await payload.init({
      config: payloadConfig,
      secret: process.env.PAYLOAD_SECRET || "",
      express: express(),
      onInit: () => {
        payloadInitialized = true
        console.log("Payload initialized successfully")
      },
    })
  } catch (error) {
    console.error("Error initializing Payload:", error)
    throw error
  }
}

// Handle all Payload requests
export async function GET(req: NextRequest, { params }: { params: { payload: string[] } }) {
  try {
    await initializePayload()

    // Get the path from the request
    const path = `/${params.payload.join("/")}`
    console.log(`Processing GET request for path: ${path}`)

    // For admin routes, serve the admin UI
    if (path === "/admin") {
      try {
        // Directly return a simple JSON response for testing
        return NextResponse.json({ message: "Payload API is working" })
      } catch (error) {
        console.error("Error serving admin UI:", error)
        return NextResponse.json({ error: "Failed to serve admin UI", details: String(error) }, { status: 500 })
      }
    }

    // For API routes, use the find method
    try {
      // Extract collection name from path
      const pathParts = path.split("/").filter(Boolean)
      if (pathParts.length > 0) {
        const collection = pathParts[0]

        // Check if this is a valid collection
        if (["users", "pages", "posts", "media"].includes(collection)) {
          const result = await payload.find({
            collection,
          })
          return NextResponse.json(result)
        }
      }

      // Default response for root API
      return NextResponse.json({ message: "Payload CMS API" })
    } catch (error) {
      console.error("Error processing API request:", error)
      return NextResponse.json({ error: "Error processing API request", details: String(error) }, { status: 500 })
    }
  } catch (error) {
    console.error("Payload initialization error:", error)
    return NextResponse.json({ error: "Payload initialization failed", details: String(error) }, { status: 500 })
  }
}

// Support other HTTP methods
export async function POST(req: NextRequest, { params }: { params: { payload: string[] } }) {
  try {
    await initializePayload()

    // Get the path and body from the request
    const path = `/${params.payload.join("/")}`
    const body = await req.json()

    console.log(`Processing POST request for path: ${path}`)

    // Extract collection name from path
    const pathParts = path.split("/").filter(Boolean)
    if (pathParts.length > 0) {
      const collection = pathParts[0]

      // Check if this is a valid collection
      if (["users", "pages", "posts", "media"].includes(collection)) {
        try {
          const result = await payload.create({
            collection,
            data: body,
          })
          return NextResponse.json(result)
        } catch (error) {
          console.error("Error creating document:", error)
          return NextResponse.json({ error: "Error creating document", details: String(error) }, { status: 500 })
        }
      }
    }

    // Default response
    return NextResponse.json({ message: "Invalid collection or path" }, { status: 400 })
  } catch (error) {
    console.error("Error processing POST request:", error)
    return NextResponse.json({ error: "Error processing POST request", details: String(error) }, { status: 500 })
  }
}
