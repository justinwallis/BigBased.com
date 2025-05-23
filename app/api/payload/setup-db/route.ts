import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

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

    console.log("Setting up database tables using Supabase client...")

    // Create Supabase client
    const supabase = createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "")

    // Create the users table
    const { error: usersError } = await supabase.rpc("create_payload_tables", {
      sql_query: `
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
        
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
        CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
        CREATE INDEX IF NOT EXISTS idx_pages_status ON pages("_status");
        CREATE INDEX IF NOT EXISTS idx_posts_status ON posts("_status");
      `,
    })

    if (usersError) {
      console.error("Error creating tables:", usersError)

      // Try a simpler approach with individual queries
      console.log("Trying alternative approach with individual queries...")

      // Create users table
      const { error: createUsersError } = await supabase.from("users").select("id").limit(1)

      if (createUsersError && createUsersError.code === "42P01") {
        // Table doesn't exist
        const { error } = await supabase.rpc("execute_sql", {
          sql: `
            CREATE TABLE IF NOT EXISTS users (
              id SERIAL PRIMARY KEY,
              email VARCHAR(255) UNIQUE NOT NULL,
              password VARCHAR(255) NOT NULL,
              roles TEXT[] DEFAULT ARRAY['user'],
              "createdAt" TIMESTAMP DEFAULT NOW(),
              "updatedAt" TIMESTAMP DEFAULT NOW()
            );
          `,
        })

        if (error) {
          throw new Error(`Failed to create users table: ${error.message}`)
        }
      }

      // Try to create an admin user directly
      const { error: insertError } = await supabase
        .from("users")
        .insert([
          {
            email: "admin@bigbased.com",
            password: "$2a$10$IZCFKfXFu.bYAJbCmKxSJeO6CYa2.zvqJpv4jEw.kSrQmhkZKbXgq", // Hashed version of BigBased2024!
            roles: ["admin"],
          },
        ])
        .select()

      if (insertError) {
        throw new Error(`Failed to create admin user: ${insertError.message}`)
      }

      return NextResponse.json({
        success: true,
        message: "Created admin user directly in database",
        adminEmail: "admin@bigbased.com",
        adminPassword: "BigBased2024!",
      })
    }

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
