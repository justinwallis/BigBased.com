import { type NextRequest, NextResponse } from "next/server"
import { createPool } from "@vercel/postgres"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    // Get the request body
    const body = await req.json()

    // Verify the secret
    if (body.secret !== process.env.PAYLOAD_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
    }

    // Get the email and password
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Create a connection to the database
    const pool = createPool({
      connectionString: process.env.POSTGRES_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    })

    // Check if the user already exists
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email])

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert the admin user
    await pool.query("INSERT INTO users (email, password, roles, name) VALUES ($1, $2, $3, $4)", [
      email,
      hashedPassword,
      ["admin"],
      "Admin User",
    ])

    // Return success
    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      user: {
        email,
        roles: ["admin"],
        name: "Admin User",
      },
    })
  } catch (error) {
    console.error("Error creating admin user:", error)
    return NextResponse.json(
      {
        error: "Error creating admin user",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
