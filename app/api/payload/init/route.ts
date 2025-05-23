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

// Handle GET requests
export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: "Use POST method to initialize database",
    usage: "POST with { secret: 'your-payload-secret' }",
  })
}

// Handle POST requests
export async function POST(req: NextRequest) {
  try {
    // Get the secret from the request body
    const body = await req.json()
    const { secret } = body

    // Validate the secret
    if (!secret || secret !== process.env.PAYLOAD_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
    }

    console.log("Initializing Payload with valid secret...")

    // Initialize Payload
    const payload = await getPayload({
      config: payloadConfig,
      secret: process.env.PAYLOAD_SECRET || "",
    })

    console.log("Payload initialized, checking for admin user...")

    // Create the admin user if it doesn't exist
    const adminEmail = "admin@bigbased.com"
    const existingAdmin = await payload.find({
      collection: "users",
      where: {
        email: {
          equals: adminEmail,
        },
      },
    })

    console.log(`Found ${existingAdmin.totalDocs} existing admin users`)

    if (existingAdmin.totalDocs === 0) {
      console.log("Creating admin user...")
      await payload.create({
        collection: "users",
        data: {
          email: adminEmail,
          password: "BigBased2024!",
          roles: ["admin"],
        },
      })
      console.log("Admin user created successfully")
    }

    // Return success
    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      adminEmail,
      adminPassword: "BigBased2024!",
    })
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json(
      { error: "Failed to initialize database", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
