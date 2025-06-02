import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

    console.log("Email Debug - Environment Check:", {
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseAnonKey,
      hasBaseUrl: !!baseUrl,
      supabaseUrlPreview: supabaseUrl?.substring(0, 30) + "...",
      baseUrl: baseUrl,
    })

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        success: false,
        error: "Missing Supabase environment variables",
        details: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseAnonKey,
        },
      })
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Test with a more realistic email domain
    const testEmail = `test-${Date.now()}@gmail.com`
    const testPassword = "TestPassword123!"

    console.log("Testing signup with:", testEmail)

    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        emailRedirectTo: `${baseUrl || "https://bigbased.com"}/auth/callback`,
      },
    })

    console.log("Signup result:", { data, error })

    // Also test with the original signup function to see if there's a difference
    console.log("Testing with realistic email domain...")

    // Test a second email with different domain
    const testEmail2 = `debug-${Date.now()}@yahoo.com`
    const { data: data2, error: error2 } = await supabase.auth.signUp({
      email: testEmail2,
      password: testPassword,
      options: {
        emailRedirectTo: `${baseUrl || "https://bigbased.com"}/auth/callback`,
      },
    })

    console.log("Second test result:", { data2, error2 })

    return NextResponse.json({
      success: !error && !error2,
      tests: [
        {
          email: testEmail,
          success: !error,
          data: data
            ? {
                user: data.user
                  ? {
                      id: data.user.id,
                      email: data.user.email,
                      email_confirmed_at: data.user.email_confirmed_at,
                      confirmation_sent_at: data.user.confirmation_sent_at,
                    }
                  : null,
                session: data.session ? "Session created" : "No session",
              }
            : null,
          error: error?.message,
        },
        {
          email: testEmail2,
          success: !error2,
          data: data2
            ? {
                user: data2.user
                  ? {
                      id: data2.user.id,
                      email: data2.user.email,
                      email_confirmed_at: data2.user.email_confirmed_at,
                      confirmation_sent_at: data2.user.confirmation_sent_at,
                    }
                  : null,
                session: data2.session ? "Session created" : "No session",
              }
            : null,
          error: error2?.message,
        },
      ],
      environment: {
        supabaseUrl: supabaseUrl?.substring(0, 50) + "...",
        baseUrl,
        redirectTo: `${baseUrl || "https://bigbased.com"}/auth/callback`,
      },
    })
  } catch (error) {
    console.error("Email debug error:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
    })
  }
}
