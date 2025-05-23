import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function POST(req: NextRequest) {
  try {
    // Get the request body
    const body = await req.json()

    // Verify the secret
    if (body.secret !== process.env.PAYLOAD_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
    }

    // Create a connection to the database using Neon
    const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

    // SQL to create the tables
    const createTablesSql = `
      -- Create the users table
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        roles TEXT[] DEFAULT ARRAY['user'],
        "supabaseUserId" VARCHAR(255),
        name VARCHAR(255),
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );

      -- Create the pages table
      CREATE TABLE IF NOT EXISTS pages (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content JSONB,
        "metaTitle" VARCHAR(255),
        "metaDescription" TEXT,
        "publishedAt" TIMESTAMP,
        "_status" VARCHAR(50) DEFAULT 'draft',
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );

      -- Create the posts table
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content JSONB,
        excerpt TEXT,
        "featuredImage" INTEGER,
        "publishedAt" TIMESTAMP,
        "_status" VARCHAR(50) DEFAULT 'draft',
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );

      -- Create the media table
      CREATE TABLE IF NOT EXISTS media (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        "mimeType" VARCHAR(100),
        filesize INTEGER,
        width INTEGER,
        height INTEGER,
        alt VARCHAR(255),
        url VARCHAR(500),
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );

      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
      CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
      CREATE INDEX IF NOT EXISTS idx_pages_status ON pages("_status");
      CREATE INDEX IF NOT EXISTS idx_posts_status ON posts("_status");
    `

    // Execute the SQL
    await sql(createTablesSql)

    // Return success
    return NextResponse.json({ success: true, message: "Database tables created successfully" })
  } catch (error) {
    console.error("Error setting up database:", error)
    return NextResponse.json(
      {
        error: "Error setting up database",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
