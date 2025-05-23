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

    // Try to create tables directly using SQL queries through the REST API
    // We'll do this one table at a time to better handle errors

    // Create users table
    const { error: usersError } = await supabase
      .from("users")
      .insert({
        id: 1,
        email: "admin@bigbased.com",
        password: "$2a$10$IZCFKfXFu.bYAJbCmKxSJeO6CYa2.zvqJpv4jEw.kSrQmhkZKbXgq", // Hashed version of BigBased2024!
        roles: ["admin"],
        name: "Admin User",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()

    if (usersError) {
      console.log("Error creating users table or inserting admin:", usersError)

      // If the table doesn't exist, let's try to create it using the Postgres connection
      if (usersError.code === "42P01") {
        console.log("Attempting to create tables directly in Supabase...")

        // Use the Supabase REST API to execute SQL
        const { error: sqlError } = await supabase.rpc("exec_sql", {
          query: `
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
          `,
        })

        if (sqlError) {
          console.error("Failed to create users table:", sqlError)

          // Let's try one more approach - direct SQL through the database connection
          return NextResponse.json({
            success: false,
            error: "Failed to create tables automatically",
            message: "Please run the SQL script manually in the Supabase SQL editor",
            sqlScript: `
              -- Run this in your Supabase SQL Editor
              
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
              
              -- Insert admin user
              INSERT INTO users (email, password, roles, name)
              VALUES (
                'admin@bigbased.com',
                '$2a$10$IZCFKfXFu.bYAJbCmKxSJeO6CYa2.zvqJpv4jEw.kSrQmhkZKbXgq', -- Hashed version of BigBased2024!
                ARRAY['admin'],
                'Admin User'
              )
              ON CONFLICT (email) DO NOTHING;
            `,
          })
        }

        // Try inserting the admin user again
        const { error: insertError } = await supabase
          .from("users")
          .insert({
            id: 1,
            email: "admin@bigbased.com",
            password: "$2a$10$IZCFKfXFu.bYAJbCmKxSJeO6CYa2.zvqJpv4jEw.kSrQmhkZKbXgq", // Hashed version of BigBased2024!
            roles: ["admin"],
            name: "Admin User",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
          .select()

        if (insertError) {
          console.error("Failed to insert admin user:", insertError)
          return NextResponse.json(
            {
              success: false,
              error: "Failed to create admin user",
              details: insertError.message,
            },
            { status: 500 },
          )
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Database setup completed successfully",
      adminEmail: "admin@bigbased.com",
      adminPassword: "BigBased2024!",
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
