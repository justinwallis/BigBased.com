import type { NextRequest } from "next/server"
import { getPayload } from "payload"
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

// Cache the Payload instance
let cachedPayload: any = null

// Initialize Payload
const getPayloadClient = async () => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET environment variable is missing")
  }

  if (cachedPayload) {
    return cachedPayload
  }

  try {
    // Use the core Payload initialization
    const payloadInstance = await getPayload({
      config: payloadConfig,
      secret: process.env.PAYLOAD_SECRET,
    })

    // Cache the instance
    cachedPayload = payloadInstance

    return payloadInstance
  } catch (error) {
    console.error("Failed to initialize Payload:", error)
    throw error
  }
}

// Handle all Payload requests
export async function GET(req: NextRequest, { params }: { params: { payload: string[] } }) {
  try {
    const payload = await getPayloadClient()

    // Create a mock Express-like request object
    const mockReq = {
      url: req.url,
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
      query: Object.fromEntries(new URL(req.url).searchParams.entries()),
      body: null,
    }

    // Handle the request using Payload's handler
    const response = await payload.handler(mockReq)

    return new Response(response.body, {
      status: response.status || 200,
      headers: response.headers || {},
    })
  } catch (error) {
    console.error("Error handling Payload request:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to handle request",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

export async function POST(req: NextRequest, { params }: { params: { payload: string[] } }) {
  try {
    const payload = await getPayloadClient()

    // Get the request body
    const body = await req.text()

    // Create a mock Express-like request object
    const mockReq = {
      url: req.url,
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
      query: Object.fromEntries(new URL(req.url).searchParams.entries()),
      body: body,
    }

    // Handle the request using Payload's handler
    const response = await payload.handler(mockReq)

    return new Response(response.body, {
      status: response.status || 200,
      headers: response.headers || {},
    })
  } catch (error) {
    console.error("Error handling Payload POST request:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to handle POST request",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

export async function PUT(req: NextRequest, { params }: { params: { payload: string[] } }) {
  try {
    const payload = await getPayloadClient()

    // Get the request body
    const body = await req.text()

    // Create a mock Express-like request object
    const mockReq = {
      url: req.url,
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
      query: Object.fromEntries(new URL(req.url).searchParams.entries()),
      body: body,
    }

    // Handle the request using Payload's handler
    const response = await payload.handler(mockReq)

    return new Response(response.body, {
      status: response.status || 200,
      headers: response.headers || {},
    })
  } catch (error) {
    console.error("Error handling Payload PUT request:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to handle PUT request",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { payload: string[] } }) {
  try {
    const payload = await getPayloadClient()

    // Create a mock Express-like request object
    const mockReq = {
      url: req.url,
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
      query: Object.fromEntries(new URL(req.url).searchParams.entries()),
      body: null,
    }

    // Handle the request using Payload's handler
    const response = await payload.handler(mockReq)

    return new Response(response.body, {
      status: response.status || 200,
      headers: response.headers || {},
    })
  } catch (error) {
    console.error("Error handling Payload DELETE request:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to handle DELETE request",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
