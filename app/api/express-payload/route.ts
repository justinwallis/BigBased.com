import { type NextRequest, NextResponse } from "next/server"
import express from "express"
import payload from "payload"
import { config } from "@/payload.config"

// Create an Express app
const app = express()

// Initialize Payload
let payloadInitialized = false
const initializePayload = async () => {
  if (!payloadInitialized) {
    await payload.init({
      express: app,
      config,
    })
    payloadInitialized = true
  }
  return payload
}

// Handle all requests
export async function GET(req: NextRequest) {
  try {
    // Initialize Payload
    const payloadInstance = await initializePayload()

    // Get the path from the URL
    const url = new URL(req.url)
    const path = url.pathname.replace("/api/express-payload", "")

    // If this is a request for the admin UI
    if (path === "" || path === "/") {
      try {
        // Get the admin UI HTML
        const html = await payloadInstance.admin.getAdminUI({
          req: {
            url: "/admin",
            headers: Object.fromEntries(req.headers),
            method: "GET",
          },
        })

        // Return the HTML
        return new NextResponse(html, {
          headers: {
            "Content-Type": "text/html",
          },
        })
      } catch (error) {
        console.error("Error getting admin UI:", error)
        return NextResponse.json({ error: "Failed to get admin UI" }, { status: 500 })
      }
    }

    // For API requests, return JSON
    return NextResponse.json({ message: "Payload API" })
  } catch (error) {
    console.error("Error handling request:", error)
    return NextResponse.json({ error: "Failed to handle request" }, { status: 500 })
  }
}

// Handle POST requests
export async function POST(req: NextRequest) {
  try {
    // Initialize Payload
    const payloadInstance = await initializePayload()

    // Get the path from the URL
    const url = new URL(req.url)
    const path = url.pathname.replace("/api/express-payload", "")

    // Get the request body
    const body = await req.json()

    // Handle login requests
    if (path === "/api/users/login") {
      try {
        const result = await payloadInstance.login({
          collection: "users",
          data: {
            email: body.email,
            password: body.password,
          },
        })
        return NextResponse.json(result)
      } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json({ error: "Login failed" }, { status: 401 })
      }
    }

    // Default response
    return NextResponse.json({ message: "Payload API POST" })
  } catch (error) {
    console.error("Error handling POST request:", error)
    return NextResponse.json({ error: "Failed to handle POST request" }, { status: 500 })
  }
}
