import { type NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"

export async function GET() {
  return NextResponse.json({
    message: "Use POST method to setup database",
    usage: "POST with { secret: 'your-payload-secret' }",
  })
}

export async function POST(req: NextRequest) {
  try {
    // Get the secret from the request body
    const body = await req.json()
    const { secret } = body

    // Validate the secret
    if (!secret || secret !== process.env.PAYLOAD_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
    }

    console.log("Setting up database tables...")

    // Create a connection pool with SSL disabled
    const pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    })

    // Create the tables
    await pool.query(`
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
    `)

    // Close the connection
    await pool.end()

    return NextResponse.json({
      success: true,
      message: "Database tables created successfully",
      nextStep: "Now run the init endpoint to create the admin user",
    })
  } catch (error) {
    console.error("Error setting up database:", error)
    return NextResponse.json(
      {
        error: "Failed to setup database",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
