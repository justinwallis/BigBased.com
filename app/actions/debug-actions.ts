"use server"

import { createClient } from "@/lib/supabase/server"

export async function debugUserProfile() {
  const debugInfo: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    steps: [],
    errors: [],
  }

  try {
    // Step 1: Check environment variables
    debugInfo.steps.push("Checking environment variables...")
    debugInfo.envVars = {
      supabaseUrl: !!process.env.SUPABASE_URL,
      supabaseAnonKey: !!process.env.SUPABASE_ANON_KEY,
      supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      nextPublicSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      nextPublicSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }

    // Step 2: Test regular client
    debugInfo.steps.push("Testing regular Supabase client...")
    const regularClient = createClient(false)

    const { data: userData, error: userError } = await regularClient.auth.getUser()
    debugInfo.regularClient = {
      hasUser: !!userData?.user,
      userId: userData?.user?.id,
      userEmail: userData?.user?.email,
      error: userError
        ? {
            message: userError.message,
            status: userError.status,
            name: userError.name,
          }
        : null,
    }

    if (userData?.user) {
      // Step 3: Test profile access with regular client
      debugInfo.steps.push("Testing profile access with regular client...")
      const { data: profileData, error: profileError } = await regularClient
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .single()

      debugInfo.regularProfileAccess = {
        hasProfile: !!profileData,
        profileData: profileData,
        error: profileError
          ? {
              message: profileError.message,
              code: profileError.code,
              details: profileError.details,
              hint: profileError.hint,
            }
          : null,
      }
    }

    // Step 4: Test service role client
    debugInfo.steps.push("Testing service role Supabase client...")
    const serviceClient = createClient(true)

    if (userData?.user) {
      const { data: serviceProfileData, error: serviceProfileError } = await serviceClient
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .single()

      debugInfo.serviceProfileAccess = {
        hasProfile: !!serviceProfileData,
        profileData: serviceProfileData,
        error: serviceProfileError
          ? {
              message: serviceProfileError.message,
              code: serviceProfileError.code,
              details: serviceProfileError.details,
              hint: serviceProfileError.hint,
            }
          : null,
      }
    }

    // Step 5: Test table existence and permissions
    debugInfo.steps.push("Testing table structure...")
    const { data: tableInfo, error: tableError } = await serviceClient.from("profiles").select("*").limit(1)

    debugInfo.tableTest = {
      canAccessTable: !tableError,
      error: tableError
        ? {
            message: tableError.message,
            code: tableError.code,
            details: tableError.details,
            hint: tableError.hint,
          }
        : null,
    }

    // Step 6: Test RLS policies
    debugInfo.steps.push("Testing RLS policies...")
    if (userData?.user) {
      const { data: rlsTest, error: rlsError } = await regularClient.rpc("auth.uid")
      debugInfo.rlsTest = {
        authUid: rlsTest,
        error: rlsError
          ? {
              message: rlsError.message,
              code: rlsError.code,
            }
          : null,
      }
    }
  } catch (error: any) {
    debugInfo.errors.push({
      step: "General error",
      message: error.message,
      stack: error.stack,
    })
  }

  return debugInfo
}

export async function testProfileCreation() {
  const debugInfo: any = {
    timestamp: new Date().toISOString(),
    steps: [],
    errors: [],
  }

  try {
    const serviceClient = createClient(true)
    const regularClient = createClient(false)

    // Get current user
    const { data: userData, error: userError } = await regularClient.auth.getUser()

    if (userError || !userData?.user) {
      debugInfo.errors.push({
        step: "Get user",
        error: userError,
      })
      return debugInfo
    }

    const user = userData.user
    debugInfo.user = {
      id: user.id,
      email: user.email,
      metadata: user.user_metadata,
    }

    // Try to create profile with service client
    debugInfo.steps.push("Attempting to create profile...")

    const { data: insertResult, error: insertError } = await serviceClient
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
        username: user.user_metadata?.username || user.email?.split("@")[0] || "",
        social_links: {},
      })
      .select()
      .single()

    debugInfo.insertResult = {
      success: !insertError,
      data: insertResult,
      error: insertError
        ? {
            message: insertError.message,
            code: insertError.code,
            details: insertError.details,
            hint: insertError.hint,
          }
        : null,
    }
  } catch (error: any) {
    debugInfo.errors.push({
      step: "General error",
      message: error.message,
      stack: error.stack,
    })
  }

  return debugInfo
}
