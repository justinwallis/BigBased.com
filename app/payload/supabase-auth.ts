import { createServerClient } from "@/lib/supabase/server"
import type { User } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import payload from "payload"

// Function to create or get a Payload user from a Supabase user
export async function syncSupabaseUserToPayload(supabaseUser: User) {
  try {
    // Check if a Payload user with this Supabase ID already exists
    const existingUsers = await payload.find({
      collection: "users",
      where: {
        supabaseUserId: {
          equals: supabaseUser.id,
        },
      },
    })

    if (existingUsers.docs.length > 0) {
      // User exists, return the first match
      return existingUsers.docs[0]
    }

    // User doesn't exist, create a new one
    const newUser = await payload.create({
      collection: "users",
      data: {
        email: supabaseUser.email,
        name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split("@")[0],
        supabaseUserId: supabaseUser.id,
        roles: ["user"], // Default role
      },
    })

    return newUser
  } catch (error) {
    console.error("Error syncing Supabase user to Payload:", error)
    throw error
  }
}

// Middleware to authenticate Payload requests using Supabase
export async function payloadAuthMiddleware(req: NextRequest) {
  try {
    // Get the Supabase server client
    const supabase = createServerClient()

    // Get the session from Supabase
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session?.user) {
      // Sync the Supabase user to Payload
      const payloadUser = await syncSupabaseUserToPayload(session.user)

      // Add the Payload user to the request
      // Note: This is a simplification, you'll need to adapt this to work with Payload's auth system
      // @ts-ignore - Adding custom property to request
      req.user = payloadUser
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Error in Payload auth middleware:", error)
    return NextResponse.next()
  }
}
