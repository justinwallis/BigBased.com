"use server"

import { createClient } from "@/lib/supabase/server"

export async function debugUserProfile() {
  const debugInfo: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "unknown",
    steps: [],
    errors: [],
  }

  try {
    // Check environment variables
    debugInfo.steps.push("Checking environment variables...")
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const nextPublicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const nextPublicSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    debugInfo.envVars = {
      supabaseUrl: !!supabaseUrl,
      supabaseAnonKey: !!supabaseAnonKey,
      supabaseServiceKey: !!supabaseServiceKey,
      nextPublicSupabaseUrl: !!nextPublicSupabaseUrl,
      nextPublicSupabaseAnonKey: !!nextPublicSupabaseAnonKey,
    }

    // Test regular client
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
          }
        : null,
    }

    if (!userData?.user) {
      debugInfo.errors.push("No authenticated user found")
      return debugInfo
    }

    // Test profile access with regular client
    debugInfo.steps.push("Testing profile access with regular client...")
    const { data: regularProfile, error: regularProfileError } = await regularClient
      .from("profiles")
      .select("*")
      .eq("id", userData.user.id)
      .single()

    debugInfo.regularProfileAccess = {
      hasProfile: !!regularProfile,
      profileData: regularProfile,
      error: regularProfileError
        ? {
            message: regularProfileError.message,
            code: regularProfileError.code,
            details: regularProfileError.details,
            hint: regularProfileError.hint,
          }
        : null,
    }

    // Test service role client
    debugInfo.steps.push("Testing service role Supabase client...")
    const serviceClient = createClient(true)
    const { data: serviceProfile, error: serviceProfileError } = await serviceClient
      .from("profiles")
      .select("*")
      .eq("id", userData.user.id)
      .single()

    debugInfo.serviceProfileAccess = {
      hasProfile: !!serviceProfile,
      profileData: serviceProfile,
      error: serviceProfileError
        ? {
            message: serviceProfileError.message,
            code: serviceProfileError.code,
            details: serviceProfileError.details,
            hint: serviceProfileError.hint,
          }
        : null,
    }

    // Test table structure
    debugInfo.steps.push("Testing table structure...")
    const { data: tableData, error: tableError } = await serviceClient.rpc("check_table_exists", {
      table_name: "profiles",
    })

    debugInfo.tableTest = {
      canAccessTable: !!tableData,
      error: tableError
        ? {
            message: tableError.message,
            code: tableError.code,
            details: tableError.details,
            hint: tableError.hint,
          }
        : null,
    }

    // Test RLS policies
    debugInfo.steps.push("Testing RLS policies...")
    const { data: rlsData, error: rlsError } = await regularClient.rpc("get_auth_uid")

    debugInfo.rlsTest = {
      authUid: rlsData,
      error: rlsError
        ? {
            message: rlsError.message,
            code: rlsError.code,
            details: rlsError.details,
            hint: rlsError.hint,
          }
        : null,
    }

    return debugInfo
  } catch (error: any) {
    debugInfo.errors.push(error.message)
    return debugInfo
  }
}

export async function testProfileCreation() {
  const debugInfo: any = {
    timestamp: new Date().toISOString(),
    steps: [],
    errors: [],
  }

  try {
    debugInfo.steps.push("Attempting to create profile...")

    // Get current user
    const supabase = createClient(false)
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData?.user) {
      debugInfo.errors.push("No authenticated user found")
      return debugInfo
    }

    debugInfo.user = {
      id: userData.user.id,
      email: userData.user.email,
      metadata: userData.user.user_metadata,
    }

    // Try to insert a profile
    const serviceClient = createClient(true)
    const { data: insertData, error: insertError } = await serviceClient
      .from("profiles")
      .upsert(
        {
          id: userData.user.id,
          email: userData.user.email,
          full_name: userData.user.user_metadata?.full_name || userData.user.user_metadata?.name || "",
          username: userData.user.user_metadata?.username || userData.user.email?.split("@")[0] || "",
          social_links: {},
          stripe_customer_id: "test_" + Date.now(),
        },
        { onConflict: "id" },
      )
      .select()

    debugInfo.insertResult = {
      success: !insertError,
      data: insertData,
      error: insertError
        ? {
            message: insertError.message,
            code: insertError.code,
            details: insertError.details,
            hint: insertError.hint,
          }
        : null,
    }

    return debugInfo
  } catch (error: any) {
    debugInfo.errors.push(error.message)
    return debugInfo
  }
}
