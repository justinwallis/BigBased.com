import { NextResponse } from "next/server"
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

// Serve a simple admin HTML page
export async function GET() {
  return NextResponse.json({
    message: "Please use the setup page to initialize your CMS",
    setupUrl: "/admin",
  })
}

// Handle POST requests for login
// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json()

//     // Check if this is a login request
//     if (body.email && body.password) {
//       // For now, just return a success response if the credentials match our admin user
//       if (body.email === "admin@bigbased.com" && body.password === "BigBased2024!") {
//         return NextResponse.json({
//           user: {
//             id: 1,
//             email: "admin@bigbased.com",
//             name: "Admin User",
//             roles: ["admin"],
//           },
//           token: "mock-jwt-token",
//         })
//       } else {
//         return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
//       }
//     }

//     return NextResponse.json({ message: "Invalid request" }, { status: 400 })
//   } catch (error) {
//     console.error("Error processing admin POST request:", error)
//     return NextResponse.json(
//       { error: "Error processing request", details: error instanceof Error ? error.message : String(error) },
//       { status: 500 },
//     )
//   }
// }
