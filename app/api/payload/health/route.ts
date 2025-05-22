import { NextResponse } from "next/server"
import payload from "payload"
import config from "@/app/payload/payload.config"

export async function GET() {
  try {
    // Check if Payload is available
    if (!process.env.PAYLOAD_SECRET || !process.env.POSTGRES_URL) {
      return NextResponse.json(
        {
          status: "error",
          message: "Payload configuration missing",
          missingVars: {
            PAYLOAD_SECRET: !process.env.PAYLOAD_SECRET,
            POSTGRES_URL: !process.env.POSTGRES_URL,
          },
        },
        { status: 500 },
      )
    }

    // Try to initialize Payload
    let initialized = false
    try {
      await payload.init({
        secret: process.env.PAYLOAD_SECRET,
        config,
      })
      initialized = true
    } catch (error) {
      console.error("Failed to initialize Payload:", error)
      return NextResponse.json(
        {
          status: "error",
          message: "Failed to initialize Payload",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      )
    }

    if (!initialized) {
      return NextResponse.json(
        {
          status: "error",
          message: "Payload initialization failed",
        },
        { status: 500 },
      )
    }

    // Try a simple query to test database connection
    try {
      await payload.find({
        collection: "users",
        limit: 1,
      })
    } catch (error) {
      console.error("Database query failed:", error)
      return NextResponse.json(
        {
          status: "error",
          message: "Database connection failed",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      status: "healthy",
      message: "Payload CMS is running correctly",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Payload health check failed:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Payload CMS is not available",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
