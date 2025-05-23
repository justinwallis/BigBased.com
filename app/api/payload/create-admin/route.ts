import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    // Get the request body
    const body = await req.json()

    // Verify the secret
    if (body.secret !== process.env.PAYLOAD_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
    }

    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Create a connection to the database using Neon
    const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create the admin user
    const result = await sql`
      INSERT INTO users (email, password, roles, "createdAt", "updatedAt")
      VALUES (${email}, ${hashedPassword}, ARRAY['admin'], NOW(), NOW())
      RETURNING id, email
    `

    // Return success
    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      user: {
        id: result[0].id,
        email: result[0].email,
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
