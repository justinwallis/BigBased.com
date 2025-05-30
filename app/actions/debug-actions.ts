"use server"

import { createClient } from "@/lib/supabase/server"

export async function debugUserProfile() {
  const timestamp = new Date().toISOString()
  const steps: string[] = []
  const errors: string[] = []
  const result: any = { timestamp, steps, errors }

  try {
    // Check environment variables
    steps.push("Checking environment variables...")
    const envVars = {
      supabaseUrl: !!process.env.SUPABASE_URL,
      supabaseAnonKey: !!process.env.SUPABASE_ANON_KEY,
      supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      nextPublicSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      nextPublicSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      stripeSecretKey: !!process.env.STRIPE_SECRET_KEY,
      stripePublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    }
    result.envVars = envVars

    // Test regular client
    steps.push("Testing regular Supabase client...")
    const supabase = createClient(false)
    const { data: userData, error: userError } = await supabase.auth.getUser()

    result.regularClient = {
      hasUser: !!userData?.user,
      userId: userData?.user?.id || null,
      userEmail: userData?.user?.email || null,
      error: userError ? userError.message : null,
    }

    // Test profiles table
    steps.push("Testing profiles table...")
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userData?.user?.id)
      .single()

    result.profileData = {
      exists: !!profileData,
      profile: profileData || null,
      error: profileError ? profileError.message : null,
    }

    // Test RPC functions
    steps.push("Testing RPC functions...")
    const { data: rpcData, error: rpcError } = await supabase.rpc("get_profile_stripe_customer", {
      user_id: userData?.user?.id,
    })

    result.rpcTest = {
      success: !rpcError,
      data: rpcData,
      error: rpcError,
    }

    // Test service role client
    steps.push("Testing service role client...")
    const serviceClient = createClient(true)
    const { data: serviceRpcData, error: serviceRpcError } = await serviceClient.rpc("get_profile_stripe_customer", {
      user_id: userData?.user?.id,
    })

    result.serviceRpcTest = {
      success: !serviceRpcError,
      data: serviceRpcData,
      error: serviceRpcError,
    }

    // Create profile if it doesn't exist
    if (profileError && profileError.code === "PGRST116") {
      steps.push("Creating profile...")
      const { data: createProfileData, error: createProfileError } = await serviceClient.rpc(
        "create_profile_if_not_exists",
        {
          user_id: userData?.user?.id,
          user_email: userData?.user?.email,
          user_name: userData?.user?.user_metadata?.name || userData?.user?.user_metadata?.full_name,
        },
      )

      result.createProfile = {
        success: !createProfileError,
        data: createProfileData,
        error: createProfileError,
      }
    }

    return result
  } catch (error: any) {
    errors.push(error.message)
    return { ...result, error: error.message, stack: error.stack }
  }
}

export async function testStripeCustomerCreation() {
  const timestamp = new Date().toISOString()
  const steps: string[] = []
  const errors: string[] = []
  const result: any = { timestamp, steps }

  try {
    // Get user data
    steps.push("Getting user data...")
    const supabase = createClient(false)
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError) {
      errors.push(`Auth error: ${userError.message}`)
      return { ...result, errors, error: userError.message }
    }

    result.user = {
      id: userData.user?.id,
      email: userData.user?.email,
      metadata: userData.user?.user_metadata,
    }

    // Test get_profile_stripe_customer RPC
    steps.push("Testing get_profile_stripe_customer RPC...")
    const { data: getProfileData, error: getProfileError } = await supabase.rpc("get_profile_stripe_customer", {
      user_id: userData.user?.id,
    })

    result.getResult = {
      success: !getProfileError,
      data: getProfileData,
      error: getProfileError,
    }

    // Test update_profile_stripe_customer RPC
    steps.push("Testing update_profile_stripe_customer RPC...")
    const testCustomerId = `cus_test_${Math.floor(Math.random() * 10000000000)}`

    const { data: updateProfileData, error: updateProfileError } = await supabase.rpc(
      "update_profile_stripe_customer",
      {
        customer_id: testCustomerId,
        user_id: userData.user?.id,
      },
    )

    result.updateResult = {
      success: !updateProfileError,
      testCustomerId,
      data: updateProfileData,
      error: updateProfileError,
    }

    return result
  } catch (error: any) {
    errors.push(error.message)
    return { ...result, errors, error: error.message, stack: error.stack }
  }
}
